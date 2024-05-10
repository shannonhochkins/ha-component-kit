import { HassEntity } from 'home-assistant-js-websocket';
import { createEntity } from './createEntity';

const now = new Date();

const defaults = {
  entity_id: "binary_sensor.vehicle",
  state: "off",
  attributes: {
    icon: "mdi:car-off",
    friendly_name: "Time",
  },
  context: {
    id: "01H4JAXGF1RTA2MJGGPGAGM7VD",
    parent_id: null,
    user_id: null,
  },
  last_changed: now.toISOString(),
  last_updated: now.toISOString(),
} satisfies HassEntity;

export const createBinarySensor = (entity_id: string, overrides: Partial<HassEntity> = {}) => {
  return createEntity(entity_id, defaults, overrides);
}