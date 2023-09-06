import { useEffect, useState, useRef } from 'react';
import { useEntity, useHass } from '@hakit/core';
import type { HassEntity } from 'home-assistant-js-websocket';
import type { EntityName, FilterByDomain } from '@hakit/core';
import { FabCard, fallback } from '@components';
import { ErrorBoundary } from 'react-error-boundary';
import styled from '@emotion/styled';


const MediaPlayerWrapper = styled.div<{
  backgroundImage?: string;
}>`
  padding: 1rem;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  ${props => props.backgroundImage && `background-image: url('${props.backgroundImage}');`}
  &:after {
    background: rgba(0,0,0,0.5);
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
  }
  .content {
    position: relative;
    z-index: 1;
  }
`;
const ProgressBar = styled.div<{
  progress: number;
}>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 0.5rem;
  background: rgba(255,255,255,0.2);
  border-radius: 0.25rem;
  overflow: hidden;
  width: 100%;
  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--ha-primary-active);
    width: ${props => props.progress}%;
  }
`;
const Title = styled.div``;

export interface MediaPlayerCardProps {
  entity: FilterByDomain<EntityName, 'media_player'>;
  /** display the artwork @default true */
  artwork?: boolean;
}
function _MediaPlayerCard({
  entity: _entity,
  artwork = true
}: MediaPlayerCardProps) {
  // TODO - determine why useEntity is not updating correctly
  const entity = useEntity(_entity, {
    throttle: 0
  });
  const [progress, setProgress] = useState(0);
  const interval = useRef<NodeJS.Timeout | null>(null);
  

  const { getEntity } = useHass();
  const entity_updated = getEntity(_entity) as HassEntity;
  const { state } = entity_updated;
  const playing = entity_updated.state === 'playing';
  const {
    friendly_name,
    media_title,
    app_name,
    media_duration,
    media_position,
    media_position_updated_at,
    volume_level,
    is_volume_muted,
  } = entity_updated.attributes;
  const deviceName = friendly_name ?? entity_updated.entity_id;
  const title = media_title;
  const appName = app_name;

  const [volume, setVolume] = useState(volume_level);

  const calculatePercentageViewed = (media_duration?: number, media_position?: number): number => {
    if (!media_duration || !media_position) return 0;
    return (media_position / media_duration) * 100;
  };

  useEffect(() => {
    if (volume !== volume_level) {
      setVolume(volume_level)
    }
  }, [volume, volume_level]);

  useEffect(() => {
    if (state === 'playing' && interval.current === null) {
      interval.current = setInterval(() => {
        const now = new Date();
        const lastUpdated = new Date(media_position_updated_at);
        const timeDifferenceInSeconds = (now.getTime() - lastUpdated.getTime()) / 1000;

        const newMediaPosition = media_position + timeDifferenceInSeconds;
        const progress = calculatePercentageViewed(media_duration, newMediaPosition);
        console.log('ticker', progress);

        setProgress(progress);
      }, 1000);
    } else if (state !== 'playing' && interval.current !== null) {
      clearInterval(interval.current);
      interval.current = null;
    }
  }, [state, media_position, media_position_updated_at, media_duration]);

  // Calculate percentage viewed whenever mediaPosition or mediaDuration changes
  useEffect(() => {
    const progress = calculatePercentageViewed(media_duration, media_position);
    setProgress(progress);
    console.log(`Percentage of track viewed: ${progress.toFixed(2)}%`);
  }, [media_position, media_duration]);

  function VolumeControls() {
    return <>
      <FabCard icon={is_volume_muted ? 'mdi:volume-mute' : 'mdi:volume-high'} onClick={() => entity.api.volumeUp()} />
      <input
          type="range"
          min={0}
          max={1}
          step={0.02}
          value={volume}
          onChange={event => {
            setVolume(event.target.valueAsNumber);
            entity.api.volumeSet({
              volume_level: event.target.valueAsNumber
            })
          }}
        />
    </>
  }

  console.log('mediaPlayer', entity_updated, progress)

  return <>
    <MediaPlayerWrapper backgroundImage={artwork ? entity.attributes.entity_picture : undefined}>
      <div className="content">
        {deviceName && <Title className="deviceName">{deviceName} {appName ? ` - ${appName}` : ''}</Title>}
        {title && <Title className="title">{title}</Title>}
        <FabCard icon={playing ? 'mdi:pause' : 'mdi:play'} onClick={() => {
          if (playing) {
            entity.api.mediaPause()
          } else {
            entity.api.mediaPlay()
          }
        }} />
        <FabCard icon="mdi:skip-next" onClick={() => entity.api.mediaNextTrack()} />
        <FabCard icon="mdi:skip-previous" onClick={() => entity.api.mediaPreviousTrack()} />
        <VolumeControls />
      </div>
      <ProgressBar progress={progress} />
    </MediaPlayerWrapper>
    <pre style={{
      fontSize: 12,
      maxWidth: 700
    }}>
      {JSON.stringify(entity_updated, null, 2)}
    </pre>
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



// export enum MediaPlayerEntityState {
//   PLAYING = 'playing',
//   PAUSED = 'paused',
//   IDLE = 'idle',
//   OFF = 'off',
//   ON = 'on',
//   UNAVAILABLE = 'unavailable',
//   UNKNOWN = 'unknown',
//   STANDBY = 'standby',
// }

// export interface MediaPlayerEntity extends HassEntityBase {
//   attributes: MediaPlayerEntityAttributes;
//   state: MediaPlayerEntityState;
// }

// export interface MediaPlayerEntityAttributes extends HassEntityAttributeBase {
//   media_content_id?: string;
//   media_content_type?: string;
//   media_artist?: string;
//   media_playlist?: string;
//   media_series_title?: string;
//   // eslint-disable-next-line  @typescript-eslint/no-explicit-any
//   media_season?: any;
//   // eslint-disable-next-line  @typescript-eslint/no-explicit-any
//   media_episode?: any;
//   app_name?: string;
//   media_position_updated_at?: string | number | Date;
//   media_duration?: number;
//   media_position?: number;
//   media_title?: string;
//   icon?: string;
//   entity_picture_local?: string;
//   is_volume_muted?: boolean;
//   volume_level?: number;
//   source?: string;
//   source_list?: string[];
//   sound_mode?: string;
//   sound_mode_list?: string[];
//   // TODO: type this;
//   repeat?: string;
//   shuffle?: boolean;
//   group_members?: string[];
//   sync_group?: string[];
// }