

import { HassEntity } from 'home-assistant-js-websocket';
import { createEntity } from './createEntity';

const now = new Date();

const defaults = {
  entity_id: "calendar.google_calendar",
  state: "off",
  attributes: {
      message: "REDACTED",
      all_day: false,
      start_time: now.toISOString(),
      end_time: now.toISOString(),
      location: "REDACTED",
      description: "REDACTED",
      offset_reached: false,
      friendly_name: "user@gmail.com",
      supported_features: 3
  },
  context: {
      id: "01HG7Q3VK1E31HD36JZ2ZCXA32",
      parent_id: null,
      user_id: null
  },
  last_changed: now.toISOString(),
  last_updated: now.toISOString()
} satisfies HassEntity;

export const createCalendar = (entity_id: string, overrides: Partial<HassEntity> = {}) => {
  return createEntity(entity_id, defaults, overrides);
}