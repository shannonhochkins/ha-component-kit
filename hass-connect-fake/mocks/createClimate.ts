import { HassEntity } from 'home-assistant-js-websocket';
import { createEntity } from './createEntity';

const now = new Date();

const defaults = {
  entity_id: "climate.air_conditioner",
    state: "off",
    attributes: {
      hvac_modes: ["fan_only", "dry", "cool", "heat", "heat_cool", "off"],
      min_temp: 7,
      max_temp: 35,
      target_temp_step: 1,
      fan_modes: ["Low", "Mid", "High"],
      current_temperature: 24,
      temperature: 25,
      fan_mode: "High",
      hvac_action: "off",
      friendly_name: "Air Conditioner",
      supported_features: 9,
    },
    context: {
      id: "01H4J3SQV4JJX4KF6G28K2AADY",
      parent_id: null,
      user_id: null,
    },
    last_changed: now.toISOString(),
    last_updated: now.toISOString(),
} satisfies HassEntity;

export const createClimate = (entity_id: string, overrides: Partial<HassEntity> = {}) => {
  return createEntity(entity_id, defaults, overrides);
}