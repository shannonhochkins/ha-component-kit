// import {
//   css,
//   CSSResultGroup,
//   html,
//   LitElement,
//   PropertyValues,
//   nothing,
// } from "lit";
// import { customElement, property, state } from "lit/decorators";
// import { isComponentLoaded } from "../common/config/is_component_loaded";
// import { computeStateName } from "../common/entity/compute_state_name";
// import { supportsFeature } from "../common/entity/supports-feature";
// import {
//   CAMERA_SUPPORT_STREAM,
//   computeMJPEGStreamUrl,
//   STREAM_TYPE_HLS,
//   STREAM_TYPE_WEB_RTC,
// } from "../data/camera";
import { supportsFeatureFromAttributes, useHass, useEntity, STREAM_TYPE_WEB_RTC, STREAM_TYPE_HLS, useCamera } from '@hakit/core';
import type { CameraEntity, FilterByDomain, EntityName } from '@hakit/core';
// import "./ha-hls-player";
// import "./ha-web-rtc-player";
import { HlsPlayer } from '../players/hls';
import { WebRTCPlayer } from '../players/webrtc';

import { useEffect, useRef, useState, useCallback } from "react";

interface CameraStreamProps {
  /** The name of your entity */
  entity: FilterByDomain<EntityName, "camera">;
  muted?: boolean;
  controls?: boolean;
  playsInline?: boolean;
  autoPlay?: boolean;
}

export function CameraStream({
  entity,
  muted,
  controls,
  autoPlay,
  playsInline,
}: CameraStreamProps) {
  const camera = useCamera(entity);
  const { stream, poster, mjpeg } = camera;
  if (mjpeg.shouldRenderMJPEG && mjpeg.url) {
    return <img src={mjpeg.url} alt={`Preview of the ${camera.attributes.friendly_name ?? camera.entity_id} camera.`} />
  }
  if (camera.attributes.frontend_stream_type === STREAM_TYPE_HLS) {
    return !poster.loading && poster.url && !stream.loading && stream.url && <HlsPlayer 
      autoPlay={autoPlay}
      muted={muted}
      controls={controls}
      playsInline={playsInline}
      posterUrl={poster.url}
      url={stream.url} />;
  }
  if (camera.attributes.frontend_stream_type === STREAM_TYPE_WEB_RTC) {
    return <WebRTCPlayer
      autoPlay={autoPlay}
      playsInline={playsInline}
      muted={muted}
      controls={controls}
      entity={entity}
      posterUrl={poster.url}
    />
  }
  return null;
}

// @customElement("ha-camera-stream")
// export class HaCameraStream extends LitElement {


//   public willUpdate(changedProps: PropertyValues): void {
//     if (
//       changedProps.has("stateObj") &&
//       !this._shouldRenderMJPEG &&
//       this.stateObj &&
//       (changedProps.get("stateObj") as CameraEntity | undefined)?.entity_id !==
//         this.stateObj.entity_id
//     ) {
//       this._getPosterUrl();
//       if (this.stateObj!.attributes.frontend_stream_type === STREAM_TYPE_HLS) {
//         this._forceMJPEG = undefined;
//         this._url = undefined;
//         this._getStreamUrl();
//       }
//     }
//   }

//   public connectedCallback() {
//     super.connectedCallback();
//     this._connected = true;
//   }

//   public disconnectedCallback() {
//     super.disconnectedCallback();
//     this._connected = false;
//   }

//   protected render() {
//     if (!this.stateObj) {
//       return nothing;
//     }
//     if (__DEMO__ || this._shouldRenderMJPEG) {
//       return html`<img
//         .src=${__DEMO__
//           ? this.stateObj.attributes.entity_picture!
//           : this._connected
//           ? computeMJPEGStreamUrl(this.stateObj)
//           : ""}
//         .alt=${`Preview of the ${computeStateName(this.stateObj)} camera.`}
//       />`;
//     }
//     if (this.stateObj.attributes.frontend_stream_type === STREAM_TYPE_HLS) {
//       return this._url
//         ? html`<ha-hls-player
//             autoplay
//             playsinline
//             .allowExoPlayer=${this.allowExoPlayer}
//             .muted=${this.muted}
//             .controls=${this.controls}
//             .hass=${this.hass}
//             .url=${this._url}
//             .posterUrl=${this._posterUrl}
//           ></ha-hls-player>`
//         : nothing;
//     }
//     if (this.stateObj.attributes.frontend_stream_type === STREAM_TYPE_WEB_RTC) {
//       return html`<ha-web-rtc-player
//         autoplay
//         playsinline
//         .muted=${this.muted}
//         .controls=${this.controls}
//         .hass=${this.hass}
//         .entityid=${this.stateObj.entity_id}
//         .posterUrl=${this._posterUrl}
//       ></ha-web-rtc-player>`;
//     }
//     return nothing;
//   }



// }
