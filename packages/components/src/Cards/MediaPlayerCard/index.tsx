import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useApi, useHass, isUnavailableState, useEntity } from '@hakit/core';
import { snakeCase } from 'lodash';
import { useGesture } from "@use-gesture/react";
import type { HassEntity } from 'home-assistant-js-websocket';
import type { EntityName, FilterByDomain } from '@hakit/core';
import { FabCard, fallback, Row, Column } from '@components';
import { ErrorBoundary } from 'react-error-boundary';
import styled from '@emotion/styled';
import { motion } from "framer-motion";
import { Marquee } from './Marquee';
import type { MarqueeProps } from './Marquee';


const MediaPlayerWrapper = styled(motion.div)<{
  backgroundImage?: string;
  layoutName?: Layout;
}>`
  padding: 0;
  background-color: var(--ha-primary-background);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: background-color, box-shadow;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  ${props => props.layoutName === 'card' && `
    width: var(--ha-device-media-card-width);
    height: var(--ha-device-media-card-width);
  `}
  ${props => props.layoutName === 'slim' && `
    width: calc(var(--ha-device-media-card-width) * 1.5);
  `}
  ${props => {
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
      `
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
}>`
  width: 4rem;
  height: 4rem;
  overflow: hidden;
  border-radius: 0.5rem;
  background-size: cover;
  background-repeat: no-repeat;
  ${props => props.backgroundImage && `background-image: url('${props.backgroundImage}');`}
`;
const ProgressBar = styled.div<{
  entity: string;
  disabled?: boolean;
}>`
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
      width: ${props => `var(--progress-${props.entity}-width, 100%);`}
    }
  }
  ${props => props.disabled && `
    cursor: not-allowed;
    span {
      &:before {
        background: rgba(255,255,255,0.2);
      }
    }
  `}
`;
const Title = styled.div`
  font-size: 0.8rem;
`;

const Base = styled(Column)`
  padding: 0.5rem 0.5rem 1rem;
  background-color: rgba(0,0,0,0.5);
`;
const Empty = styled.span``;

const StyledFab = styled(FabCard)`
  background-color: white;
  color: black;
  opacity: 0.8;
  transition: opacity var(--ha-transition-duration) var(--ha-easing);
  &:not(:disabled) {
    &:hover, &:active {
      opacity: 1;
      background-color: white;
      color: black;
    }
  }
`;

const StyledMarquee = styled(Marquee)`
  font-size: 0.8rem;
`;

const VolumeSlider = styled.label`
  display: inline-block;
  width: 50%;
  color: rgba(0, 0, 0, 0.87);
  font-size: 1rem;
  line-height: 1.5;
  input {
    -webkit-appearance: none;
    position: relative;
    top: 24px;
    display: block;
    margin: 0 0 -36px;
    width: 100%;
    height: 36px;
    background-color: transparent;
    cursor: pointer;
    &:focus {
      outline: none;
    }
    
    &::-webkit-slider-runnable-track, &::-moz-range-track, &::-ms-track {
      margin: 17px 0;
      border-radius: 1px;
      width: 100%;
      height: 2px;
      background-color: rgba(33, 150, 243, 0.24);
    }
    &::-webkit-slider-thumb, &::-moz-range-thumb, &::-ms-thumb {
      appearance: none;
      -webkit-appearance: none;
      border: none;
      border-radius: 50%;
      height: 2px;
      width: 2px;
      background-color: rgb(33, 150, 243);
      transform: scale(6, 6);
      transition: box-shadow 0.2s;
    }
    &::-moz-focus-outer {
      border: none;
    }
    &::-moz-range-progress, &::-ms-fill-lower {
      border-radius: 1px;
      height: 2px;
      background-color: rgb(33, 150, 243);
    }
    &:disabled {
      cursor: default;
      opacity: 0.38;
      cursor: not-allowed;
      &::-webkit-slider-runnable-track, &::-moz-range-track, &::-ms-track {
        background-color: rgba(0, 0, 0, 0.38);
      }
      &::-webkit-slider-thumb, &::-moz-range-thumb, &::-ms-thumb {
        background-color: rgb(0, 0, 0);
        color: rgb(255, 255, 255); /* Safari */
        box-shadow: 0 0 0 1px rgb(255, 255, 255) !important;
        transform: scale(4, 4);
      }
      &::-moz-range-progress, &:-ms-fill-lower  {
        background-color: rgba(0, 0, 0, 0.87);
      }
    }
    &:hover {
      &::-webkit-slider-thumb, &::-moz-range-thumb, &::-ms-thumb {
        box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.04);
      }
    }
    &:focus {
      &::-webkit-slider-thumb, &::-moz-range-thumb, &::-ms-thumb {
        box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.16);
      }
    }
    
    &:active {
      &::-webkit-slider-thumb, &::-moz-range-thumb, &::-ms-thumb {
        box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.24) !important;
      }
    }
  }
`;

type VolumeLayout = 'slider' | 'buttons';
type Layout = 'card' | 'slim';

const DEFAULT_FAB_SIZE = 30;

export interface MediaPlayerCardProps {
  entity: FilterByDomain<EntityName, 'media_player'>;
  group?: FilterByDomain<EntityName, 'media_player'>[];
  /** display the artwork @default 'background' */
  layout?: Layout,
  marqueeProps?: MarqueeProps;
  volumeLayout?: VolumeLayout;
  hideMute?: boolean;
  hideAppName?: boolean;
  hideEntityName?: boolean;
  disabled?: boolean;
  showThumbnail?: boolean;
  showArtworkBackground?: boolean;
}
function _MediaPlayerCard({
  entity: _entity,
  group = [],
  volumeLayout = 'buttons',
  showThumbnail = false,
  showArtworkBackground = true,
  layout = 'card',
  hideMute = false,
  hideAppName = false,
  hideEntityName = false,
  disabled: _disabled = false,
  marqueeProps
}: MediaPlayerCardProps) {
  const entity = useEntity(_entity);
  const api = useApi('mediaPlayer');
  const interval = useRef<NodeJS.Timeout | null>(null);
  const { getEntity, callService } = useHass();
  const progressRef = useRef<HTMLDivElement>(null);
  // const entity = getEntity(_entity);
  const groupedEntities = group
    .map(entity => getEntity(entity, true))
    // TODO - potentially filter out unavailable entities
    .filter((entity): entity is HassEntity => entity !== null);
  const allEntityIds = useMemo(() => [_entity, ...groupedEntities.map(x => x.entity_id)], [_entity, groupedEntities]);
  const { state } = entity;
  const playing = state === 'playing';
  const buffering = state === 'buffering';
  console.log('groupedEntities', groupedEntities);
  const {
    friendly_name,
    media_title,
    app_name,
    media_duration,
    media_position,
    media_position_updated_at,
    volume_level,
    is_volume_muted,
  } = entity.attributes;
  const deviceName = friendly_name ?? entity.entity_id;
  const title = media_title;
  const appName = app_name;
  const artworkUrl = entity.attributes.entity_picture ? entity.attributes.entity_picture : null;
  const isUnavailable = isUnavailableState(state);
  const isIdle = state === 'idle';
  const isStandby = state === 'standby';
  const disabled = isUnavailable || _disabled;

  const [volume, setVolume] = useState(volume_level);

  const calculatePercentageViewed = useCallback((media_duration?: number, media_position?: number) => {
    if (!media_duration || !media_position) return 0;
    const progress = (media_position / media_duration) * 100;
    if (progressRef.current) {
      progressRef.current.style.setProperty(`--progress-${snakeCase(_entity)}-width`, `${progress}%`);
    }
  }, [_entity]);

  useEffect(() => {
    if (volume !== volume_level) {
      setVolume(volume_level)
    }
  }, [volume, volume_level]);

  useEffect(() => {
    if (playing && interval.current === null && media_position_updated_at !== undefined && media_position !== undefined) {
      interval.current = setInterval(() => {
        const now = new Date();
        const lastUpdated = new Date(media_position_updated_at);
        const timeDifferenceInSeconds = (now.getTime() - lastUpdated.getTime()) / 1000;

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
    }
  }, [playing, media_position, media_position_updated_at, media_duration, calculatePercentageViewed]);

  function joinGroups(join: boolean) {
    if (!join) {
      api.join(entity.entity_id, {
        entity_id: entity.entity_id,
        // @ts-expect-error - types are wrong....
        group_members: groupedEntities.map(x => x.entity_id),
      });
    } else {
      api.unjoin(entity.entity_id, {
        entity_id: entity.entity_id,
      });
    }
  }
  const seekTrack = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    if (progressRef.current) {
      // Get the bounding client rectangle
      const rect = progressRef.current.getBoundingClientRect();

      // Calculate the click position relative to the element
      const x = event.clientX - rect.left;

      // Translate the click position into a percentage between 0-100
      const percentage = (x / rect.width);

      console.log(`Clicked at ${percentage}%`);
      api.mediaSeek(allEntityIds, {
        seek_position: percentage * (media_duration ?? 0),
      });
    }
  }, [api, allEntityIds, media_duration])
  // Calculate percentage viewed whenever mediaPosition or mediaDuration changes
  useEffect(() => {
    calculatePercentageViewed(media_duration, media_position);
  }, [media_position, calculatePercentageViewed, media_duration]);

  const bindProgress = useGesture(
    {
      
      onHover: (state) => {
        if (disabled) return;
        
      },
      onClick: (state) => {
        if (disabled) return;
        
      },
    },
    {
      drag: {
        filterTaps: true,
      },
    },
  );

  function VolumeControls() {
    return <>
      {!hideMute && <StyledFab disabled={disabled} size={DEFAULT_FAB_SIZE} icon={is_volume_muted ? 'mdi:volume-off' : 'mdi:volume-high'} onClick={() => {
        api.volumeMute(allEntityIds, {
          is_volume_muted: !is_volume_muted,
        })
      }} />}
      {volumeLayout === 'buttons' && <>
        <StyledFab disabled={disabled} size={DEFAULT_FAB_SIZE} icon="mdi:volume-minus" onClick={() => api.volumeDown(allEntityIds)} />
        <StyledFab disabled={disabled} size={DEFAULT_FAB_SIZE} icon="mdi:volume-plus" onClick={() => api.volumeUp(allEntityIds)} />
      </>}
      {volumeLayout === 'slider' && <VolumeSlider>
        <input type="range"
          min={0}
          max={1}
          disabled={disabled}
          step={0.02}
          value={is_volume_muted ? 0 : volume}
          onChange={event => {
            setVolume(event.target.valueAsNumber);
            api.volumeSet(allEntityIds, {
              volume_level: event.target.valueAsNumber
            });
          }} />
        </VolumeSlider>}
    </>;
  }

  function PlaybackControls({ size, feature }: { size: number, feature: boolean }) {
    return <>
      <StyledFab disabled={disabled} size={size} icon="mdi:skip-previous" onClick={() => api.mediaPreviousTrack(allEntityIds)} />
      <StyledFab disabled={disabled} size={size * (feature ? 2 : 1)} icon={playing ? 'mdi:pause' : 'mdi:play'} onClick={() => {
        if (playing) {
          api.mediaPause(allEntityIds)
        } else {
          api.mediaPlay(allEntityIds)
        }
      }} />
      <StyledFab disabled={disabled} size={size} icon="mdi:skip-next" onClick={() => api.mediaNextTrack(allEntityIds)} />
    </>
  }

  console.log('mediaPlayer', allEntityIds, entity)

  return <>
    <MediaPlayerWrapper layoutName={layout} backgroundImage={showArtworkBackground === true && artworkUrl !== null ? artworkUrl : undefined}>
      <Column fullHeight fullWidth className="content" justifyContent='space-between'>
        <Empty />
        {layout === 'card' && <Row gap="1rem" fullWidth>
          <PlaybackControls feature size={40} />
        </Row>}
        
        <Base fullWidth gap="0.5rem">
          {layout === 'card' ? <Row gap="0.5rem" wrap='nowrap' fullWidth>
            <VolumeControls /> 
          </Row> : null}
          <Row gap="0.5rem" wrap='nowrap' fullWidth>
            {showThumbnail === true && artworkUrl !== null && <Thumbnail backgroundImage={artworkUrl} />}
            <Column gap="0.5rem" alignItems='flex-start' fullWidth>
              {deviceName && !hideEntityName && <Title className="deviceName">{hideEntityName ? '' : deviceName}</Title>}
              {title && <StyledMarquee
                speed={30}
                pauseOnHover={true}
                {...marqueeProps}
                className="title">
                  {title}{appName && !hideAppName ? ` - ${appName}` : ''}
              </StyledMarquee>}
            </Column>
          </Row>
          {layout === 'slim' ? <Row gap="0.5rem" wrap='nowrap' fullWidth>
            <VolumeControls />
            <PlaybackControls feature={false} size={DEFAULT_FAB_SIZE} />
          </Row> : null}
        </Base>

      </Column>
      <ProgressBar disabled={isIdle || isStandby || buffering || disabled} entity={snakeCase(_entity)} ref={progressRef} onClick={seekTrack}>
        <span />
      </ProgressBar>
    </MediaPlayerWrapper>
    {/* <pre style={{
      fontSize: 12,
      maxWidth: 700
    }}>
      {JSON.stringify(entity, null, 2)}
    </pre> */}
  </>
}

/** TODO */
export function MediaPlayerCard(props: MediaPlayerCardProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "MediaPlayerCard" })}>
      <_MediaPlayerCard {...props} />
    </ErrorBoundary>
  );
}