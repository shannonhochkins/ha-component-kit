import { Connection } from "home-assistant-js-websocket";
import { timeCacheEntityPromiseFunc } from "./time-cache-entity-promise";
import type { CameraEntity } from "@core";

export interface SignedPath {
  path: string;
}

export const getSignedPath = (connection: Connection, path: string): Promise<SignedPath> =>
  connection.sendMessagePromise({ type: "auth/sign_path", path });

export interface CameraPreferences {
  preload_stream: boolean;
  orientation: number;
}

export interface CameraThumbnail {
  content_type: string;
  content: string;
}

export interface Stream {
  url: string;
}

export const cameraUrlWithWidthHeight = (base_url: string, width: number, height: number) => `${base_url}&width=${width}&height=${height}`;

export const computeMJPEGStreamUrl = (entity: CameraEntity) =>
  `/api/camera_proxy_stream/${entity.entity_id}?token=${entity.attributes.access_token}`;

export const fetchThumbnailUrlWithCache = async (connection: Connection, entityId: string, width: number, height: number) => {
  const base_url = await timeCacheEntityPromiseFunc("_cameraTmbUrl", 9000, fetchThumbnailUrl, connection, entityId);
  return cameraUrlWithWidthHeight(base_url, width, height);
};

export const fetchThumbnailUrl = async (connection: Connection, entityId: string) => {
  const { path } = await getSignedPath(connection, `/api/camera_proxy/${entityId}`);
  return path;
};

export const fetchStreamUrl = async (connection: Connection, entityId: string, format?: "hls") => {
  const data = {
    type: "camera/stream",
    entity_id: entityId,
  };
  if (format) {
    // @ts-expect-error - conditional add
    data.format = format;
  }
  const { url } = await connection.sendMessagePromise<Stream>(data);
  return url;
};

export const fetchCameraPrefs = (connection: Connection, entityId: string) =>
  connection.sendMessagePromise<CameraPreferences>({
    type: "camera/get_prefs",
    entity_id: entityId,
  });

const CAMERA_MEDIA_SOURCE_PREFIX = "media-source://camera/";

export const isCameraMediaSource = (mediaContentId: string) => mediaContentId.startsWith(CAMERA_MEDIA_SOURCE_PREFIX);

export const getEntityIdFromCameraMediaSource = (mediaContentId: string) => mediaContentId.substring(CAMERA_MEDIA_SOURCE_PREFIX.length);
