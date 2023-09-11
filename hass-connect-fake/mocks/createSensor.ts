import { HassEntity } from 'home-assistant-js-websocket';
import { createEntity } from './createEntity';

const now = new Date();

// formatted time based on now
const formatted = now.toLocaleTimeString("en-US", {
  hour12: false,
  hour: "2-digit",
  minute: "2-digit",
});

const defaults = {
  entity_id: "sensor.time",
  state: formatted,
  attributes: {
    icon: "mdi:clock",
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

export const createSensor = (entity_id: string, overrides: Partial<HassEntity> = {}) => {
  return createEntity(entity_id, defaults, overrides);
}