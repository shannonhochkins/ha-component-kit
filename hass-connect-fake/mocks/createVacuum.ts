import { HassEntity } from 'home-assistant-js-websocket';
import { createEntity } from './createEntity';

const now = new Date();

const defaults = {
  entity_id: "vacuum.robot_vacuum",
  state: "docked",
  attributes: {
    fan_speed_list: ["Silent", "Standard", "Medium", "Turbo", "Gentle"],
    battery_level: 80,
    battery_icon: "mdi:battery-charging-100",
    fan_speed: "Standard",
    status: "Charging",
    friendly_name: "Robot vacuum",
    supported_features: 14204,
  },
  context: {
    id: "01H4J3SQV4JJX4KF6H28K2BBDY",
    parent_id: null,
    user_id: null,
  },
  last_changed: now.toISOString(),
  last_updated: now.toISOString(),
} satisfies HassEntity;

export const createVacuum = (entity_id: string, overrides: Partial<HassEntity> = {}) => {
  return createEntity(entity_id, defaults, overrides);
}