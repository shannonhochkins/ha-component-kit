import { HassEntity } from 'home-assistant-js-websocket';
import { createEntity } from './createEntity';

const now = new Date();

export const defaults = {
  attributes: {
    friendly_name: "Living room TV",
  },
  state: "off",
  entity_id: "media_player.fake_tv",
  last_changed: now.toISOString(),
  last_updated: now.toISOString(),
  context: {
    id: "1",
    user_id: null,
    parent_id: null,
  },
} satisfies HassEntity;

export const createMediaPlayer = (entity_id: string, overrides: Partial<HassEntity> = {}) => {
  return createEntity(entity_id, defaults, overrides);
}