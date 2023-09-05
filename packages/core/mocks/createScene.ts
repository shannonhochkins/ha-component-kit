import { HassEntity } from 'home-assistant-js-websocket';
import { createEntity } from './createEntity';

const now = new Date();

const defaults = {
  entity_id: "scene.goodmorning",
  state: now.toISOString(),
  attributes: {
    entity_id: ["light.all_office_lights_2"],
    id: "1688447567040",
    icon: "mdi:sun-clock",
    friendly_name: "Goodmorning",
  },
  context: {
    id: "01H4FP0HY3K7R49GJS574K5TPW",
    parent_id: null,
    user_id: null,
  },
  last_changed: now.toISOString(),
  last_updated: now.toISOString(),
} satisfies HassEntity;

export const createScene = (entity_id: string, overrides: Partial<HassEntity> = {}) => {
  return createEntity(entity_id, defaults, overrides);
}