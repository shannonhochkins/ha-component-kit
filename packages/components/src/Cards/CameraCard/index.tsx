import type {
  EntityName,
  FilterByDomain,
} from "@hakit/core";
import {
  useCamera,
} from "@hakit/core";
import { useEffect, useCallback, useRef } from "react";
import { PreloadImage } from "@components";

import { CameraStream } from './stream';

export interface CameraCardProps {
  /** The name of your entity */
  entity: FilterByDomain<EntityName, "camera">;
  view?: 'poster' | 'live';
  autoPlay?: boolean;
  muted?: boolean;
  controls?: boolean;
  playsInline?: boolean;
  /** the refresh rate for the poster image when in poster view @default 10000 */
  posterUpdateInterval?: number;
  /** use motion jpeg if supported, will only work if the view is "poster" @default false */
  useMJPEG?: boolean;
}

export function CameraCard({
  entity,
  view = 'poster',
  autoPlay,
  muted,
  controls,
  playsInline,
  posterUpdateInterval = 10000,
  useMJPEG = false,
}: CameraCardProps) {
  const cameraUpdater = useRef<number | undefined>(undefined);
  const camera = useCamera(entity, {
    // stream loading handled internally on the stream component
    stream: false,
    poster: view === 'poster'
  });
  const { poster, mjpeg } = camera;

  const _stopUpdateCameraInterval = (): void => {
    if (cameraUpdater.current) {
      clearInterval(cameraUpdater.current);
      cameraUpdater.current = undefined;
    }
  };

  const _startUpdateCameraInterval = useCallback((): void => {
    _stopUpdateCameraInterval();
    cameraUpdater.current = window.setInterval(
      () => poster.refresh(),
      posterUpdateInterval
    );
  }, [poster, posterUpdateInterval]);

  useEffect(() => {
    return () => {
      _stopUpdateCameraInterval();
    }
  }, []);

  useEffect(() => {
    if (view === 'poster') {
      _startUpdateCameraInterval();
    }
  }, [view, _startUpdateCameraInterval]);

  return <div>
    {useMJPEG && mjpeg.url && view === 'poster' && <PreloadImage lazy src={mjpeg.url} alt={`Preview of the ${camera.attributes.friendly_name ?? camera.entity_id} camera.`}>
      <div style={{
        width: '300px',
        height: '200px',
      }}>
        Apples
      </div>
    </PreloadImage>}
    {!useMJPEG && poster.url && view === 'poster' && <PreloadImage src={poster.url} lazy>
      <div style={{
        width: '300px',
        height: '200px',
      }}>
        Apples
      </div>
    </PreloadImage>}
    {view === 'live' && <CameraStream 
      autoPlay={autoPlay}
      muted={muted}
      controls={controls}
      playsInline={playsInline}
      entity={entity} />}
  </div>
}