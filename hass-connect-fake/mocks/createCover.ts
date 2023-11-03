import { HassEntity } from 'home-assistant-js-websocket';
import { createEntity } from './createEntity';

const now = new Date();

const defaults = {
  entity_id: "cover.cover",
  state: "open",
  attributes: {
    current_position: 50,
    current_tilt_position: 24,
    battery: 65,
    charging_status: false,
    device_temperature: 35,
    linkquality: 43,
    position: 50,
    power_outage_count: 5,
    running: false,
    update: {
        installed_version: -1,
        latest_version: -1,
        state: null
    },
    update_available: null,
    friendly_name: "LivingRoom Blind",
    supported_features: 255
  },
  context: {
    id: "01H4J3SQV4JJX4KF6G28K2AADY",
    parent_id: null,
    user_id: null,
  },
  last_changed: now.toISOString(),
  last_updated: now.toISOString(),
} satisfies HassEntity;

export const createCover = (entity_id: string, overrides: Partial<HassEntity> = {}) => {
  return createEntity(entity_id, defaults, overrides);
}