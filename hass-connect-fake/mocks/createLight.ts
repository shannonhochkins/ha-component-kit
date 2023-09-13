import { HassEntity } from 'home-assistant-js-websocket';
import { createEntity } from './createEntity';

const now = new Date();

const defaults = {
  attributes: {
    friendly_name: "Dining room light",
    icon: "mdi:light-recessed",
    min_color_temp_kelvin: 2702,
    max_color_temp_kelvin: 6535,
    min_mireds: 153,
    max_mireds: 370,
    effect_list: [
      "Night",
      "Read",
      "Meeting",
      "Leasure",
      "Soft",
      "Rainbow",
      "Shine",
      "Beautiful",
      "Music",
    ],
    supported_color_modes: ["color_temp", "hs"],
    color_mode: "hs",
    brightness: 255,
    hs_color: [9, 67.1],
    rgb_color: [255, 109, 83],
    xy_color: [0.591, 0.328],
    raw_state: true,
    supported_features: 23,
  },
  state: "on",
  entity_id: "light.fake_light_1",
  last_changed: now.toISOString(),
  last_updated: now.toISOString(),
  context: {
    id: "",
    user_id: null,
    parent_id: null,
  },
} satisfies HassEntity;

export const createLight = (entity_id: string, overrides: Partial<HassEntity> = {}) => {
  return createEntity(entity_id, defaults, overrides);
}