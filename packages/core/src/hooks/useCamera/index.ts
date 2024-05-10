import { useEntity, isUnavailableState, useHass, supportsFeatureFromAttributes } from "@core";
import type { HassEntityWithService, FilterByDomain, EntityName } from "@core";
import { useRef, useState, useCallback, useMemo, useEffect } from "react";
import { fetchThumbnailUrlWithCache, fetchStreamUrl, computeMJPEGStreamUrl } from "./camera";
import { ASPECT_RATIO_DEFAULT, MAX_IMAGE_WIDTH, CAMERA_SUPPORT_STREAM, STREAM_TYPE_WEB_RTC } from "./constants";

export interface UseCameraOptions {
  /** the requested width of the poster image @default 640 */
  imageWidth?: number;
  /** the requested aspect ratio of the image @default 9/16 */
  aspectRatio?: number;
  /** enable/disable the request for the poster */
  poster?: boolean;
  /** enable/disable the request for the stream */
  stream?: boolean;
}

export interface CameraEntityExtended extends HassEntityWithService<"camera"> {
  stream: {
    url: string | undefined;
    loading: boolean;
    error: Error | undefined;
    refresh: () => Promise<void>;
  };
  poster: {
    url: string | undefined;
    loading: boolean;
    error: Error | undefined;
    refresh: () => Promise<void>;
  };
  mjpeg: {
    url: string | undefined;
    shouldRenderMJPEG: boolean;
  };
}
/** The useCamera hook is designed to return all the custom complex logic in an easy to retrieve structure, it supports streams, motion jpeg, posters and the camera entity */
export function useCamera(entity: FilterByDomain<EntityName, "camera">, options?: UseCameraOptions): CameraEntityExtended {
  const camera = useEntity(entity);
  const { useStore, joinHassUrl } = useHass();
  const connection = useStore((state) => state.connection);
  const requestedStreamUrl = useRef(false);
  const requestedPosterUrl = useRef(false);
  const [posterUrl, setPosterUrl] = useState<string | undefined>(undefined);
  const [streamUrl, setStreamUrl] = useState<string | undefined>(undefined);
  const [streamError, setStreamError] = useState<Error | undefined>(undefined);
  const [posterError, setPosterError] = useState<Error | undefined>(undefined);
  const [streamLoading, setStreamLoading] = useState<boolean>(options?.stream === false ? false : true);
  const [posterLoading, setPosterLoading] = useState<boolean>(options?.poster === false ? false : true);
  const mjpeg = useMemo(() => joinHassUrl(computeMJPEGStreamUrl(camera)), [camera, joinHassUrl]);

  const _getPosterUrl = useCallback(async (): Promise<void> => {
    if (options?.poster === false) return;
    if (!connection) return;
    if (isUnavailableState(camera.state)) {
      return;
    }
    if (requestedPosterUrl.current) return;
    requestedPosterUrl.current = true;
    setPosterLoading(true);
    try {
      const width = Math.ceil((options?.imageWidth ?? MAX_IMAGE_WIDTH) * devicePixelRatio);
      const height = Math.ceil(width * (options?.aspectRatio ?? ASPECT_RATIO_DEFAULT));
      const cameraImageSrc = await fetchThumbnailUrlWithCache(connection, camera.entity_id, width, height);
      setPosterUrl(joinHassUrl(cameraImageSrc));
      setPosterLoading(false);
    } catch (err) {
      setPosterLoading(false);
      // poster url is optional
      if (err instanceof Error) {
        setPosterError(err);
      }
    }
  }, [camera.entity_id, joinHassUrl, camera.state, connection, options?.poster, options?.aspectRatio, options?.imageWidth]);

  const _getStreamUrl = useCallback(async (): Promise<void> => {
    if (options?.stream === false) return;
    if (!connection) return;
    if (isUnavailableState(camera.state)) {
      return;
    }
    if (requestedStreamUrl.current) return;
    requestedStreamUrl.current = true;
    setStreamLoading(true);
    try {
      const url = await fetchStreamUrl(connection, camera.entity_id);
      setStreamUrl(joinHassUrl(url));
      setStreamLoading(false);
    } catch (err) {
      setStreamLoading(false);
      // Fails if we were unable to get a stream
      console.error(err);
      if (err instanceof Error) {
        setStreamError(err);
      }
    }
  }, [camera.entity_id, joinHassUrl, camera.state, connection, options?.stream]);

  const _shouldRenderMJPEG = useCallback(() => {
    if (streamError) {
      // Fallback when unable to fetch stream url
      return true;
    }
    if (!supportsFeatureFromAttributes(camera.attributes, CAMERA_SUPPORT_STREAM)) {
      // Steaming is not supported by the camera so fallback to MJPEG stream
      return true;
    }
    if (camera.attributes.frontend_stream_type === STREAM_TYPE_WEB_RTC) {
      // Browser support required for WebRTC
      return typeof RTCPeerConnection === "undefined";
    }
    // Server side stream component required for HLS
    return false;
  }, [camera.attributes, streamError]);

  useEffect(() => {
    _getStreamUrl();
    _getPosterUrl();
  }, [_getStreamUrl, _getPosterUrl]);

  return useMemo(() => {
    const stream = {
      url: streamUrl,
      loading: streamLoading,
      error: streamError,
      refresh: async () => {
        requestedStreamUrl.current = false;
        return _getStreamUrl();
      },
    };
    const poster = {
      url: posterUrl,
      loading: posterLoading,
      error: posterError,
      refresh: async () => {
        requestedPosterUrl.current = false;
        return _getPosterUrl();
      },
    };
    const extendedCamera = {
      ...camera,
      stream,
      poster,
      mjpeg: {
        url: mjpeg,
        shouldRenderMJPEG: _shouldRenderMJPEG(),
      },
    } satisfies CameraEntityExtended;
    return extendedCamera;
  }, [
    camera,
    streamUrl,
    _shouldRenderMJPEG,
    streamLoading,
    streamError,
    _getStreamUrl,
    posterUrl,
    posterLoading,
    posterError,
    mjpeg,
    _getPosterUrl,
  ]);
}
