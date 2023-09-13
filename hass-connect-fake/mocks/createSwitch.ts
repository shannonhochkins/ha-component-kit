import { HassEntity } from 'home-assistant-js-websocket';
import { createEntity } from './createEntity';

const now = new Date();

const defaults = {
  attributes: {
    friendly_name: "Gaming Computer",
  },
  state: "off",
  entity_id: "switch.fake_switch",
  last_changed: now.toISOString(),
  last_updated: now.toISOString(),
  context: {
    id: "",
    user_id: null,
    parent_id: null,
  },
} satisfies HassEntity;

export const createSwitch = (entity_id: string, overrides: Partial<HassEntity> = {}) => {
  return createEntity(entity_id, defaults, overrides);
}