import { useEffect, useRef, useCallback, useMemo } from "react";
import {
  useApi,
  useHass,
  isUnavailableState,
  useEntity,
  OFF,
  supportsFeatureFromAttributes,
} from "@hakit/core";
import { snakeCase, clamp } from "lodash";
import { useGesture } from "@use-gesture/react";
import type { HassEntity } from "home-assistant-js-websocket";
import type { EntityName, FilterByDomain } from "@hakit/core";
import { FabCard, fallback, Row, Column } from "@components";
import type { RowProps } from "@components";
import { ErrorBoundary } from "react-error-boundary";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { Marquee } from "./Marquee";
import { RangeSlider } from "./RangeSlider";
import type { MarqueeProps } from "./Marquee";
import { useThrottledCallback } from "use-debounce";

const MediaPlayerWrapper = styled(motion.div)<{
  backgroundImage?: string;
  layoutName?: Layout;
}>`
  padding: 0;
  background-color: var(--ha-primary-background);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: background-image, background-color, box-shadow;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  ${(props) =>
    props.layoutName === "card" &&
    `
    width: var(--ha-device-media-card-width);
    height: var(--ha-device-media-card-width);
  `}
  ${(props) =>
    props.layoutName === "slim" &&
    `
    width: calc(var(--ha-device-media-card-width) * 1.5);
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
    background-color: var(--ha-primary-background-hover);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  }

  .content {
    position: relative;
    z-index: 1;
  }
`;

const Thumbnail = styled.div<{
  backgroundImage?: string;
  size: string;
}>`
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 0.5rem;
  background-size: cover;
  background-repeat: no-repeat;
  ${(props) =>
    props.backgroundImage &&
    `background-image: url('${props.backgroundImage}');`}
`;

const Clock = styled.div<{
  entity: string;
}>`
  position: absolute;
  bottom: 0.5rem;
  left: 0;
  opacity: 0;
  transition: opacity var(--ha-transition-duration) var(--ha-easing);
  padding: 0.2rem;
  font-size: 0.8rem;
  background: var(--ha-primary-background);
  z-index: 1;
  border-radius: 0.25rem;
  pointer-events: none;
  transform: translateX(-50%);
  ${(props) => {
    return `
      &:before {
        content: var(--progress-${props.entity}-clock, '');
      }
    `;
  }}
`;

const ProgressBar = styled.div<{
  entity: string;
  disabled?: boolean;
}>`
  ${(props) => `
  position: absolute;
  bottom: 0;
  left: 0;
  padding-top: 0.5rem;
  border-radius: 0.25rem;
  overflow: hidden;
  width: 100%;
  z-index: 1;
  cursor: pointer;
  span {
    background: rgba(255,255,255,0.2);
    height: 0.3rem;
    position: relative;
    width: 100%;
    display: block;
    &:before {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--ha-primary-active);
      width: var(--progress-${props.entity}-width, 100%);
    }
  }
  &.disabled {
    cursor: not-allowed;
    span {
      &:before {
        background: rgba(255,255,255,0.2);
      }
    }
  }
  &:hover:not(.disabled) + .clock {
    opacity: 1;
  }
  `}
`;
const Title = styled.div`
  font-size: 0.8rem;
`;

const Base = styled(Column)`
  padding: 0.5rem 0.5rem 1rem;
  width: calc(100% - 1rem);
  background-color: rgba(0, 0, 0, 0.5);
`;
const Empty = styled.span``;

const StyledFab = styled(FabCard)`
  background-color: white;
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
      background-color: white;
      color: black;
    }
  }
`;

const StyledMarquee = styled(Marquee)`
  font-size: 0.8rem;
`;

const SmallText = styled.span`
  font-size: 0.8rem;
`;

const VolumeSlider = styled.label<{
  layout: Layout;
}>`
  display: inline-block;
  width: ${(props) => (props.layout === "card" ? "80%" : "60%")};
  color: rgba(0, 0, 0, 0.87);
  font-size: 1rem;
  line-height: 1.5;
`;

type VolumeLayout = "slider" | "buttons";
type Layout = "card" | "slim";

const DEFAULT_FAB_SIZE = 30;

interface PlaybackControlsProps {
  entity: FilterByDomain<EntityName, "media_player">;
  disabled: boolean;
  allEntityIds: string[];
  size?: number;
  feature?: boolean;
}
function PlaybackControls({
  entity: _entity,
  size = 20,
  feature,
  disabled,
  allEntityIds,
}: PlaybackControlsProps) {
  const entity = useEntity(_entity);
  const api = useApi("mediaPlayer");
  const playing = entity.state === "playing";
  const isOff = entity.state === OFF;
  const supportsPreviousTrack = supportsFeatureFromAttributes(
    entity.attributes,
    16,
  );
  const supportsNextTrack = supportsFeatureFromAttributes(
    entity.attributes,
    32,
  );
  const supportsPlay = supportsFeatureFromAttributes(entity.attributes, 16384);
  return (
    <>
      <StyledFab
        disabled={disabled || isOff || !supportsPreviousTrack}
        size={size}
        icon="mdi:skip-previous"
        onClick={() => api.mediaPreviousTrack(allEntityIds)}
      />
      <StyledFab
        disabled={disabled || isOff || !supportsPlay}
        size={size * (feature ? 2 : 1)}
        icon={playing ? "mdi:pause" : "mdi:play"}
        onClick={() => {
          if (playing) {
            api.mediaPause(allEntityIds);
          } else {
            api.mediaPlay(allEntityIds);
          }
        }}
      />
      <StyledFab
        disabled={disabled || isOff || !supportsNextTrack}
        size={size}
        icon="mdi:skip-next"
        onClick={() => api.mediaNextTrack(allEntityIds)}
      />
    </>
  );
}

interface AlternateControlsProps extends RowProps {
  entity: FilterByDomain<EntityName, "media_player">;
  disabled: boolean;
  allEntityIds: string[];
}

function AlternateControls({
  entity: _entity,
  disabled,
  allEntityIds,
}: AlternateControlsProps) {
  const entity = useEntity(_entity);
  const api = useApi("mediaPlayer");
  const supportsGrouping = supportsFeatureFromAttributes(
    entity.attributes,
    524288,
  );
  const groups = entity.attributes.group_members ?? [];
  const isOff = entity.state === OFF;
  const isUnavailable = isUnavailableState(entity.state);
  const supportsTurnOn = supportsFeatureFromAttributes(entity.attributes, 128);
  const supportsTurnOff = supportsFeatureFromAttributes(entity.attributes, 256);

  const joinGroups = useCallback(
    (join: boolean) => {
      if (join) {
        api.join(entity.entity_id, {
          // @ts-expect-error - types are wrong....
          entity_id: entity.entity_id,
          // @ts-expect-error - types are wrong....
          group_members: groupedEntities.map((x) => x.entity_id),
        });
      } else {
        api.unjoin(entity.entity_id, {
          entity_id: entity.entity_id,
        });
      }
    },
    [api, entity.entity_id],
  );
  return (
    <Row gap="0.5rem" wrap="nowrap">
      {supportsGrouping && (
        <StyledFab
          active={groups.length > 0}
          disabled={disabled}
          size={DEFAULT_FAB_SIZE}
          icon={
            groups.length === 0 ? "mdi:speaker-off" : "mdi:speaker-multiple"
          }
          onClick={() => joinGroups(groups.length === 0)}
        />
      )}
      {(isUnavailable || isOff) && <SmallText>{entity.state}</SmallText>}
      <StyledFab
        active={!isOff && !isUnavailable}
        disabled={disabled || !supportsTurnOn || !supportsTurnOff}
        size={DEFAULT_FAB_SIZE}
        icon="mdi:power"
        onClick={() => {
          if (isOff) {
            api.turnOn(allEntityIds);
          } else {
            api.turnOff(allEntityIds);
          }
        }}
      />
    </Row>
  );
}

interface VolumeProps {
  entity: FilterByDomain<EntityName, "media_player">;
  volumeLayout: VolumeLayout;
  hideMute: boolean;
  disabled: boolean;
  allEntityIds: string[];
  layout: Layout;
}

function VolumeControls({
  entity: _entity,
  volumeLayout,
  hideMute,
  disabled,
  allEntityIds,
  layout,
}: VolumeProps) {
  const entity = useEntity(_entity);
  const api = useApi("mediaPlayer");
  const { volume_level, is_volume_muted } = entity.attributes;
  const supportsVolumeSet = supportsFeatureFromAttributes(entity.attributes, 4);
  const supportsVolumeMute = supportsFeatureFromAttributes(
    entity.attributes,
    8,
  );
  return (
    <>
      {!hideMute && supportsVolumeMute && (
        <StyledFab
          disabled={disabled}
          size={DEFAULT_FAB_SIZE}
          icon={is_volume_muted ? "mdi:volume-off" : "mdi:volume-high"}
          onClick={() => {
            api.volumeMute(allEntityIds, {
              is_volume_muted: !is_volume_muted,
            });
          }}
        />
      )}
      {volumeLayout === "buttons" && supportsVolumeSet && (
        <>
          <StyledFab
            disabled={disabled}
            size={DEFAULT_FAB_SIZE}
            icon="mdi:volume-minus"
            onClick={() => api.volumeDown(allEntityIds)}
          />
          <StyledFab
            disabled={disabled}
            size={DEFAULT_FAB_SIZE}
            icon="mdi:volume-plus"
            onClick={() => api.volumeUp(allEntityIds)}
          />
        </>
      )}
      {volumeLayout === "slider" && supportsVolumeSet && (
        <VolumeSlider layout={layout}>
          <RangeSlider
            type="range"
            min={0}
            max={1}
            disabled={disabled}
            step={0.02}
            value={is_volume_muted ? 0 : volume_level}
            onChange={(value) => {
              api.volumeSet(allEntityIds, {
                volume_level: value,
              });
            }}
          />
        </VolumeSlider>
      )}
    </>
  );
}

export interface MediaPlayerCardProps {
  /** the entity_id of the media_player to control */
  entity: FilterByDomain<EntityName, "media_player">;
  /** if the entity supports grouping, you can provide the groupMembers as a list to join them together */
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
  marqueeProps,
}: MediaPlayerCardProps) {
  const entity = useEntity(_entity);
  const api = useApi("mediaPlayer");
  const interval = useRef<NodeJS.Timeout | null>(null);
  const { getEntity } = useHass();
  const progressRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLDivElement>(null);
  const groupedEntities = groupMembers
    .map((entity) => getEntity(entity, true))
    .filter(
      (entity): entity is HassEntity =>
        entity !== null && !isUnavailableState(entity.state),
    );
  const allEntityIds = useMemo(
    () => [_entity, ...groupedEntities.map((x) => x.entity_id)],
    [_entity, groupedEntities],
  );
  const { state } = entity;
  const {
    friendly_name,
    media_title,
    app_name,
    media_duration,
    media_position,
    media_position_updated_at,
  } = entity.attributes;
  const deviceName = friendly_name ?? entity.entity_id;
  const title = media_title;
  const appName = app_name;
  const artworkUrl = entity.attributes.entity_picture
    ? entity.attributes.entity_picture
    : null;
  const isUnavailable = isUnavailableState(state);
  const isIdle = state === "idle";
  const isStandby = state === "standby";
  const isOff = state === OFF;
  const playing = state === "playing";
  const buffering = state === "buffering";
  const disabled = isUnavailable || _disabled;
  const seekDisabled = isIdle || isOff || isStandby || buffering || disabled;

  const updateClock = useCallback(
    (x: number) => {
      if (
        !progressRef.current ||
        !clockRef.current ||
        seekDisabled ||
        !playerRef.current ||
        !media_duration
      )
        return;
      // Get the bounding client rectangle
      const rect = progressRef.current.getBoundingClientRect();
      // Calculate the click position relative to the element
      const offsetX = x - rect.left;
      // Translate the click position into a percentage between 0-100
      const percentage = (offsetX / rect.width) * 100;
      // Calculate the current time in seconds
      const currentTimeInSeconds: number = (media_duration * percentage) / 100;
      // Convert the current time to minutes and remaining seconds
      const minutes: number = Math.max(
        0,
        Math.floor(currentTimeInSeconds / 60),
      );
      const seconds: number = Math.max(
        0,
        Math.floor(currentTimeInSeconds % 60),
      );
      // Convert minutes and seconds to string and ensure they have at least two digits
      const minutesStr: string = String(minutes).padStart(2, "0");
      const secondsStr: string = String(seconds).padStart(2, "0");
      // Update the clock
      clockRef.current.style.left = `${clamp(percentage, 5, 95)}%`;
      playerRef.current.style.setProperty(
        `--progress-${snakeCase(_entity)}-clock`,
        `'${minutesStr}:${secondsStr}'`,
      );
    },
    [_entity, media_duration, seekDisabled],
  );

  const calculatePercentageViewed = useCallback(
    (media_duration?: number, media_position?: number) => {
      if (!media_duration || !media_position) return 0;
      const progress = (media_position / media_duration) * 100;
      if (playerRef.current) {
        playerRef.current.style.setProperty(
          `--progress-${snakeCase(_entity)}-width`,
          `${progress}%`,
        );
      }
    },
    [_entity],
  );

  useEffect(() => {
    if (
      playing &&
      interval.current === null &&
      media_position_updated_at !== undefined &&
      media_position !== undefined
    ) {
      interval.current = setInterval(() => {
        const now = new Date();
        const lastUpdated = new Date(media_position_updated_at);
        const timeDifferenceInSeconds =
          (now.getTime() - lastUpdated.getTime()) / 1000.0;

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
  }, [
    playing,
    media_position,
    media_position_updated_at,
    media_duration,
    calculatePercentageViewed,
  ]);

  const seekTrack = useCallback(
    (x: number): void => {
      if (!progressRef.current) return;
      // Get the bounding client rectangle
      const rect = progressRef.current.getBoundingClientRect();
      // Calculate the click position relative to the element
      const offsetX = x - rect.left;
      // Translate the click position into a percentage between 0-100
      const percentage = offsetX / rect.width;
      api.mediaSeek(allEntityIds, {
        seek_position: percentage * (media_duration ?? 0),
      });
    },
    [api, allEntityIds, media_duration],
  );
  // Calculate percentage viewed whenever mediaPosition or mediaDuration changes
  useEffect(() => {
    calculatePercentageViewed(media_duration, media_position);
  }, [media_position, calculatePercentageViewed, media_duration]);

  const debounceUpdateClock = useThrottledCallback((value: number) => {
    updateClock(value);
  }, 20);

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

  const supportsGrouping = supportsFeatureFromAttributes(
    entity.attributes,
    524288,
  );

  if (groupMembers.length > 0 && !supportsGrouping) {
    throw new Error(
      `"${_entity}" does not support grouping, but you have provided groupMembers.`,
    );
  }

  const volumeProps = {
    entity: _entity,
    hideMute,
    disabled,
    allEntityIds,
    volumeLayout,
    layout,
  } satisfies VolumeProps;
  const playbackControlsProps = {
    entity: _entity,
    disabled,
    allEntityIds,
  } satisfies PlaybackControlsProps;

  return (
    <>
      <MediaPlayerWrapper
        ref={playerRef}
        layoutName={layout}
        backgroundImage={
          showArtworkBackground === true && artworkUrl !== null
            ? artworkUrl
            : undefined
        }
      >
        <Column
          fullHeight
          fullWidth
          className="content"
          justifyContent="space-between"
        >
          <Empty />
          {layout === "card" && (
            <Row gap="1rem" fullWidth>
              <PlaybackControls {...playbackControlsProps} feature size={40} />
            </Row>
          )}

          <Base
            fullWidth
            gap="0.5rem"
            style={{
              paddingBottom: isOff ? "0.5rem" : "1rem",
            }}
          >
            <Row gap="0.5rem" wrap="nowrap" fullWidth>
              {hideThumbnail === false && artworkUrl !== null && (
                <Thumbnail backgroundImage={artworkUrl} size={thumbnailSize} />
              )}
              <Column
                gap="0.5rem"
                alignItems="flex-start"
                style={{
                  width:
                    hideThumbnail === false
                      ? `calc(100% - (${thumbnailSize} + 2rem))`
                      : "100%",
                }}
              >
                <Row justifyContent="space-between" fullWidth>
                  {deviceName && !hideEntityName && (
                    <Title className="deviceName">
                      {hideEntityName ? "" : deviceName}
                      {buffering ? " - buffering" : ""}
                    </Title>
                  )}
                  {(isOff || layout ==='slim') && (
                    <AlternateControls
                      allEntityIds={allEntityIds}
                      entity={_entity}
                      disabled={disabled}
                    />
                  )}
                </Row>
                {title && !isOff && (
                  <StyledMarquee
                    speed={30}
                    pauseOnHover
                    play={playing}
                    autoFill
                    {...marqueeProps}
                    className="title"
                  >
                    {title}
                    {appName && !hideAppName ? ` - ${appName}` : ""}
                  </StyledMarquee>
                )}
              </Column>
            </Row>

            {!isUnavailable ? (
              <Row gap="0.5rem" wrap="nowrap" fullWidth>
                {!isOff && <VolumeControls {...volumeProps} />}
                {layout === "slim" && (
                  <PlaybackControls
                    {...playbackControlsProps}
                    feature={false}
                    size={DEFAULT_FAB_SIZE}
                  />
                )}
                {!isOff && layout === "card" && (
                  <AlternateControls
                    allEntityIds={allEntityIds}
                    entity={_entity}
                    disabled={disabled}
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
    </>
  );
}

/** A MediaPlayerCard to control media similar to the mini-media-player from Hacs, this is a very complicated component and I will require feedback if it does not work for you, different features are enabled / shown based on the media_player provided, it supports group players if the media_players provided support grouping, however i myself do not have devices that do support it so i would love some feedback to determine if it works or not! It supports skip, previous, volume, mute, power, seeking, play, pause, grouping, artwork */
export function MediaPlayerCard(props: MediaPlayerCardProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "MediaPlayerCard" })}>
      <_MediaPlayerCard {...props} />
    </ErrorBoundary>
  );
}
