import { HassEntity } from 'home-assistant-js-websocket';
import { createEntity } from './createEntity';

const now = new Date();

const defaults = {
  entity_id: "automation.dim_lights",
    state: "on",
    attributes: {
        id: "1660460668213",
        last_triggered: new Date(now.setHours(-100)).toISOString(),
        mode: "single",
        current: 0,
        friendly_name: "Dim Lights"
    },
    context: {
      id: "01H989071CWR02B5HG861JXWCC",
      parent_id: null,
      user_id: null,
    },
    last_changed: now.toISOString(),
    last_updated: now.toISOString(),
} satisfies HassEntity;

export const createAutomation = (entity_id: string, overrides: Partial<HassEntity> = {}) => {
  return createEntity(entity_id, defaults, overrides);
}