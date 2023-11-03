import { STREAM_TYPE_WEB_RTC, STREAM_TYPE_HLS, useCamera } from "@hakit/core";
import type { FilterByDomain, EntityName } from "@hakit/core";
import { HlsPlayer } from "../players/hls";
import { WebRTCPlayer } from "../players/webrtc";

import type { VideoState } from "../players";
export interface CameraStreamProps {
  /** The name of your entity */
  entity: FilterByDomain<EntityName, "camera">;
  /** if the player should start muted @default false */
  muted?: boolean;
  /** if the player should show the controls @default true */
  controls?: boolean;
  /** if the player should play inline @default false */
  playsInline?: boolean;
  /** if the player should start playing automatically @default false */
  autoPlay?: boolean;
  /** called whenever the video changes state, not every listener is available, but most of the important listeners are supported */
  onStateChange?: (state: VideoState) => void;
}

/**
 * A Simple wrapper for HLS and WEBRTC to display a live feed of your camera entity.
 * This component will not render anything if your camera does not support HLS or WEBRTC */
export function CameraStream({
  entity,
  muted = false,
  controls = true,
  autoPlay = false,
  playsInline = false,
  onStateChange,
}: CameraStreamProps) {
  const camera = useCamera(entity);
  const { stream, poster, mjpeg } = camera;
  if (mjpeg.shouldRenderMJPEG && mjpeg.url) {
    return <img src={mjpeg.url} alt={`Preview of the ${camera.attributes.friendly_name ?? camera.entity_id} camera.`} />;
  }
  if (camera.attributes.frontend_stream_type === STREAM_TYPE_HLS) {
    return (
      !poster.loading &&
      poster.url &&
      !stream.loading &&
      stream.url && (
        <HlsPlayer
          autoPlay={autoPlay}
          muted={muted}
          controls={controls}
          playsInline={playsInline}
          posterUrl={poster.url}
          onStateChange={onStateChange}
          url={stream.url}
        />
      )
    );
  }
  if (camera.attributes.frontend_stream_type === STREAM_TYPE_WEB_RTC) {
    return (
      <WebRTCPlayer
        autoPlay={autoPlay}
        playsInline={playsInline}
        muted={muted}
        controls={controls}
        entity={entity}
        onStateChange={onStateChange}
        posterUrl={poster.url}
      />
    );
  }
  return null;
}
