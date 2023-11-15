import { useEffect, useRef, useCallback, useMemo, useState, useId } from "react";
import { useService, useHass, isUnavailableState, useEntity, OFF, supportsFeatureFromAttributes } from "@hakit/core";
import { snakeCase, clamp } from "lodash";
import { useGesture } from "@use-gesture/react";
import type { HassEntity } from "home-assistant-js-websocket";
import type { EntityName, FilterByDomain } from "@hakit/core";
import { FabCard, fallback, Row, Column, CardBase, ModalMediaPlayerControls } from "@components";
import type { CardBaseProps, AvailableQueries } from "@components";
import { ErrorBoundary } from "react-error-boundary";
import styled from "@emotion/styled";
import { Marquee } from "./Marquee";
import type { MarqueeProps } from "./Marquee";
import { useThrottledCallback } from "use-debounce";
import { VolumeControls } from "./VolumeControls.tsx";
import { Thumbnail } from "./Thumbnail.tsx";
import { Clock } from "./Clock.tsx";
import { PlaybackControls } from "./PlaybackControls.tsx";
import { ProgressBar } from "./ProgressBar.tsx";
import { AlternateControls } from "./AlternateControls.tsx";

const MediaPlayerWrapper = styled(CardBase)<
  CardBaseProps<"div", FilterByDomain<EntityName, "media_player">> & {
    backgroundImage?: string;
    layoutName?: Layout;
  }
>`
  padding: 0;
  background-color: var(--ha-S300);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: background-image, background-color, box-shadow;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  width: 100%;
  flex-shrink: 1;

  ${(props) =>
    props.layoutName === "card" &&
    `
    aspect-ratio: 1/1;
  `}
  ${(props) => {
    if (props.backgroundImage) {
      return `
        background-image: url('${props.backgroundImage}');
        &:after {
          background: rgba(0,0,0,0.7);
          content: '';
          position: absolute;
          inset: 0;
          z-index: 0;
        }
      `;
    }
  }}
  &:disabled {
    cursor: not-allowed;
    opacity: 0.8;
  }

  &:active {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  }
  &:not(:disabled):hover {
    background-color: var(--ha-S400);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  }

  .content {
    position: relative;
    z-index: 1;
  }
`;

const Title = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 1);
`;

const Base = styled(Column)`
  padding: 0.5rem 0.5rem 1rem;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;
const Empty = styled.span``;

export const StyledFab = styled(FabCard)`
  &:not(.active) {
    color: black;
  }
  opacity: 0.8;
  transition: opacity var(--ha-transition-duration) var(--ha-easing);
  &:disabled {
    opacity: 0.38;
  }
  &:not(:disabled) {
    &:hover,
    &:active {
      opacity: 1;
      color: black;
    }
  }
  z-index: 2;
`;

const StyledMarquee = styled(Marquee)`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.87);
`;

export type VolumeLayout = "slider" | "buttons";
export type Layout = "card" | "slim";

export const DEFAULT_FAB_SIZE = 30;

type OmitProperties =
  | "title"
  | "as"
  | "layout"
  | "ref"
  | "entity"
  | "disabled"
  | "active"
  | "disableActiveState"
  | "disableScale"
  | "disableRipples"
  | "rippleProps";
export interface MediaPlayerCardProps extends Omit<CardBaseProps<"div", FilterByDomain<EntityName, "media_player">>, OmitProperties> {
  /** the entity_id of the media_player to control */
  entity: FilterByDomain<EntityName, "media_player">;
  /** an optional override for the title of the entity */
  title?: React.ReactNode;
  /**
   * if the entity supports grouping, you can provide the groupMembers as a list to join them together
   * specify all the group members you want to group together, including the entity_id of the entity itself
   */
  groupMembers?: FilterByDomain<EntityName, "media_player">[];
  /** the layout of the card @default 'card' */
  layout?: Layout;
  /** properties to pass to the track title marquee element  */
  marqueeProps?: MarqueeProps;
  /** the layout of the volume elements @default 'slider' */
  volumeLayout?: VolumeLayout;
  /** hide the mute button @default false */
  hideMute?: boolean;
  /** hide the app name eg YouTube @default false */
  hideAppName?: boolean;
  /** hide the entity friendly name @default false */
  hideEntityName?: boolean;
  /** disable the card manually if the internal disable functionality needs to be updated @default false */
  disabled?: boolean;
  /** hide the thumbnail element @default false */
  hideThumbnail?: boolean;
  /** the size of the thumbnail to show @default 3rem */
  thumbnailSize?: string;
  /** show the artwork as the background of the card @default true */
  showArtworkBackground?: boolean;
}
function _MediaPlayerCard({
  entity: _entity,
  groupMembers = [],
  volumeLayout = "slider",
  thumbnailSize = "3rem",
  hideThumbnail = false,
  showArtworkBackground = true,
  layout = "card",
  hideMute = false,
  hideAppName = false,
  hideEntityName = false,
  disabled: _disabled = false,
  service,
  serviceData,
  marqueeProps,
  className,
  ...rest
}: MediaPlayerCardProps) {
  const hass = useHass();
  const entity = useEntity(_entity);
  const mp = useService("mediaPlayer");
  const { joinHassUrl } = useHass();
  const interval = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLDivElement>(null);
  const entitiesById = hass.getAllEntities();
  const groupedEntities = groupMembers
    .map((entity) => entitiesById[entity] ?? null)
    .filter((entity): entity is HassEntity => entity !== null && !isUnavailableState(entity.state));
  const allEntityIds = useMemo(() => [_entity, ...groupedEntities.map((x) => x.entity_id)], [_entity, groupedEntities]);
  const { state } = entity;
  const { media_artist, media_title, app_name, media_duration, media_position, media_position_updated_at } = entity.attributes;
  const deviceNames = (entity?.attributes?.group_members || []).reduce((friendlyNames, entityId) => {
    const entity = entitiesById[entityId];
    if (!entity) {
      return friendlyNames;
    }

    return [...friendlyNames, entity.attributes?.friendly_name || entity.entity_id];
  }, [] as string[]);
  const title = `${media_artist ? media_artist + " - " : ""}${media_title}`;
  const appName = app_name;
  const artworkUrl = useMemo(() => {
    const url = entity.attributes.entity_picture ? entity.attributes.entity_picture : null;
    return url && url.startsWith("/") ? joinHassUrl(url) : url;
  }, [entity.attributes.entity_picture, joinHassUrl]);
  const isUnavailable = isUnavailableState(state);
  const isIdle = state === "idle";
  const isStandby = state === "standby";
  const isOff = state === OFF;
  const playing = state === "playing";
  const buffering = state === "buffering";
  const disabled = isUnavailable || _disabled;
  const seekDisabled = isIdle || isOff || isStandby || buffering || disabled;
  const [isGroupingModalOpen, setIsGroupingModalOpen] = useState(false);
  const groupingLayoutId = useId();

  const updateClock = useCallback(
    (x: number) => {
      if (!progressRef.current || !clockRef.current || seekDisabled || !playerRef.current || !media_duration) return;
      // Get the bounding client rectangle
      const rect = progressRef.current.getBoundingClientRect();
      // Calculate the click position relative to the element
      const offsetX = x - rect.left;
      // Translate the click position into a percentage between 0-100
      const percentage = (offsetX / rect.width) * 100;
      // Calculate the current time in seconds
      const currentTimeInSeconds: number = (media_duration * percentage) / 100;
      // Convert the current time to minutes and remaining seconds
      const minutes: number = Math.max(0, Math.floor(currentTimeInSeconds / 60));
      const seconds: number = Math.max(0, Math.floor(currentTimeInSeconds % 60));
      // Convert minutes and seconds to string and ensure they have at least two digits
      const minutesStr: string = String(minutes).padStart(2, "0");
      const secondsStr: string = String(seconds).padStart(2, "0");
      // Update the clock
      clockRef.current.style.left = `${clamp(percentage, 5, 95)}%`;
      playerRef.current.style.setProperty(`--progress-${snakeCase(_entity)}-clock`, `'${minutesStr}:${secondsStr}'`);
    },
    [_entity, media_duration, seekDisabled],
  );

  const calculatePercentageViewed = useCallback(
    (media_duration?: number, media_position?: number) => {
      if (!media_duration || !media_position) return 0;
      const progress = (media_position / media_duration) * 100;
      if (playerRef.current) {
        playerRef.current.style.setProperty(`--progress-${snakeCase(_entity)}-width`, `${clamp(progress, 0, 100)}%`);
      }
    },
    [_entity],
  );

  useEffect(() => {
    if (playing && interval.current === null && media_position_updated_at !== undefined && media_position !== undefined) {
      interval.current = setInterval(() => {
        const now = new Date();
        const lastUpdated = new Date(media_position_updated_at);
        const timeDifferenceInSeconds = (now.getTime() - lastUpdated.getTime()) / 1000.0;

        const newMediaPosition = media_position + timeDifferenceInSeconds;
        calculatePercentageViewed(media_duration, newMediaPosition);
      }, 1000);
    } else if (!playing && interval.current !== null) {
      clearInterval(interval.current);
      interval.current = null;
    }
    return () => {
      if (interval.current !== null) {
        clearInterval(interval.current);
        interval.current = null;
      }
    };
  }, [playing, media_position, media_position_updated_at, media_duration, calculatePercentageViewed]);

  const seekTrack = useCallback(
    (x: number): void => {
      if (!progressRef.current) return;
      // Get the bounding client rectangle
      const rect = progressRef.current.getBoundingClientRect();
      // Calculate the click position relative to the element
      const offsetX = x - rect.left;
      // Translate the click position into a percentage between 0-100
      const percentage = offsetX / rect.width;
      mp.mediaSeek(allEntityIds, {
        seek_position: percentage * (media_duration ?? 0),
      });
    },
    [mp, allEntityIds, media_duration],
  );
  // Calculate percentage viewed whenever mediaPosition or mediaDuration changes
  useEffect(() => {
    calculatePercentageViewed(media_duration, media_position);
  }, [media_position, calculatePercentageViewed, media_duration]);

  const debounceUpdateClock = useThrottledCallback((value: number) => {
    updateClock(value);
  }, 20);

  // noinspection JSVoidFunctionReturnValueUsed
  const bindProgress = useGesture({
    onMove: (state) => {
      if (seekDisabled) return;
      debounceUpdateClock(state.event.clientX);
    },
    onClick: (state) => {
      if (seekDisabled) return;
      seekTrack(state.event.clientX);
    },
  });

  const supportsGrouping = supportsFeatureFromAttributes(entity.attributes, 524288);

  if (groupMembers.length > 0 && !supportsGrouping) {
    throw new Error(`"${_entity}" does not support grouping, but you have provided groupMembers.`);
  }

  return (
    <>
      <MediaPlayerWrapper
        disabled={disabled}
        entity={_entity}
        // @ts-expect-error - don't know the entity name, so we can't know the service type
        service={service}
        // @ts-expect-error - don't know the entity name, so we can't know the service data
        serviceData={serviceData}
        disableScale
        disableActiveState
        disableRipples
        className={`media-player-card ${className ?? ""}`}
        elRef={playerRef}
        layoutName={layout}
        backgroundImage={showArtworkBackground === true && artworkUrl !== null ? artworkUrl : undefined}
        {...rest}
      >
        <Column fullHeight fullWidth className="column content" justifyContent="space-between">
          <Empty className="empty" />
          {layout === "card" && (
            <Row gap="1rem" fullWidth className="row">
              <PlaybackControls entity={_entity} disabled={disabled} allEntityIds={allEntityIds} feature size={40} />
            </Row>
          )}

          <Base
            className="base"
            fullWidth
            gap="0.5rem"
            style={{
              paddingBottom: isOff ? (layout === "slim" ? "1rem" : "0.5rem") : "1rem",
            }}
          >
            <Row className="row" gap="0.5rem" wrap="nowrap" fullWidth>
              {hideThumbnail === false && artworkUrl !== null && (
                <Thumbnail className="thumbnail" backgroundImage={artworkUrl} size={thumbnailSize} />
              )}
              <Column
                className="column"
                gap="0.5rem"
                alignItems="flex-start"
                style={{
                  width: hideThumbnail === false && artworkUrl !== null ? `calc(100% - (${thumbnailSize} + 0.5rem))` : "100%",
                }}
              >
                <Row className="row" justifyContent="space-between" fullWidth>
                  {deviceNames.length > 0 && !hideEntityName && (
                    <Title className="title device-name">
                      {hideEntityName ? "" : deviceNames.join(", ")}
                      {buffering ? (hideEntityName ? "" : " - ") + "buffering" : ""}
                    </Title>
                  )}
                  {(isOff || layout === "slim") && (
                    <AlternateControls
                      allEntityIds={allEntityIds}
                      entity={_entity}
                      disabled={disabled}
                      onSpeakerGroupClick={() => setIsGroupingModalOpen(true)}
                      layoutId={groupingLayoutId}
                    />
                  )}
                </Row>
                {title && !isOff && (
                  <StyledMarquee speed={30} pauseOnHover play={playing} autoFill {...marqueeProps} className="title marquee">
                    {title}
                    {appName && !hideAppName ? ` - ${appName}` : ""}
                  </StyledMarquee>
                )}
              </Column>
            </Row>

            {!isUnavailable ? (
              <Row className="row" gap="0rem" justifyContent="space-between" wrap="nowrap" fullWidth>
                {!isOff && (
                  <VolumeControls
                    entity={_entity}
                    disabled={disabled}
                    allEntityIds={allEntityIds}
                    volumeLayout={volumeLayout}
                    layout={layout}
                    hideMute={hideMute}
                  />
                )}
                {layout === "slim" && (
                  <PlaybackControls
                    entity={_entity}
                    disabled={disabled}
                    allEntityIds={allEntityIds}
                    feature={false}
                    size={DEFAULT_FAB_SIZE}
                  />
                )}
                {!isOff && layout === "card" && (
                  <AlternateControls
                    allEntityIds={allEntityIds}
                    entity={_entity}
                    disabled={disabled}
                    onSpeakerGroupClick={() => setIsGroupingModalOpen(true)}
                    layoutId={groupingLayoutId}
                  />
                )}
              </Row>
            ) : null}
          </Base>
        </Column>
        <ProgressBar
          className={`${seekDisabled ? "disabled" : ""} progress-bar`}
          disabled={seekDisabled}
          entity={snakeCase(_entity)}
          ref={progressRef}
          {...bindProgress()}
        >
          <span></span>
        </ProgressBar>
        <Clock entity={snakeCase(_entity)} className="clock" ref={clockRef} />
      </MediaPlayerWrapper>
      <ModalMediaPlayerControls
        mediaPlayerEntities={groupedEntities}
        open={isGroupingModalOpen}
        id={groupingLayoutId}
        onClose={() => setIsGroupingModalOpen(false)}
      />
    </>
  );
}

/** A MediaPlayerCard to control media similar to the mini-media-player from Hacs.
 * This is a very complicated component and I will require feedback if it does not work for you.
 * Different features are enabled / shown based on the media_player provided.
 * It supports group players if the media_players provided support grouping.
 * However, I myself do not have devices that do support it, so I would love some feedback to determine if it works or not!
 * It supports skip, previous, volume, mute, power, seeking, play, pause, grouping, artwork */
export function MediaPlayerCard(props: MediaPlayerCardProps) {
  const defaultColumns: AvailableQueries = {
    xxs: 12,
    xs: 6,
    sm: 6,
    md: 4,
    lg: 4,
    xlg: 3,
  };

  return (
    <ErrorBoundary {...fallback({ prefix: "MediaPlayerCard" })}>
      <_MediaPlayerCard {...defaultColumns} {...props} />
    </ErrorBoundary>
  );
}
