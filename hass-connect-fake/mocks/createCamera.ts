

import { HassEntity } from 'home-assistant-js-websocket';
import { createEntity } from './createEntity';

const now = new Date();

const defaults = {
  entity_id: "camera.demo_camera",
  state: "idle",
  attributes: {
    access_token: "FAKE_TOKEN",
    frontend_stream_type: "hls",
    entity_picture: "FAKE_PICTURE",
    friendly_name: "Frontdoor Camera",
    supported_features: 2
  },
  context: {
      id: "01HG7Q3VK1E31HD36JZ2ZCXA32",
      parent_id: null,
      user_id: null
  },
  last_changed: now.toISOString(),
  last_updated: now.toISOString()
} satisfies HassEntity;

export const createCamera = (entity_id: string, overrides: Partial<HassEntity> = {}) => {
  return createEntity(entity_id, defaults, overrides);
}