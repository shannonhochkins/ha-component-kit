import { HassEntity } from 'home-assistant-js-websocket';
import { createEntity } from './createEntity';

const now = new Date();

const defaults = {
  entity_id: "alarm_control_panel.home_alarm",
  state: "disarmed",
  attributes: {
    code_format: "number",
    changed_by: null,
    code_arm_required: true,
    code_disarm_required: true,
    friendly_name: "Home Alarm",
    icon: "mdi:security",
  },
  context: {
    id: "01H989071CWR02B5HG861JXWCC",
    parent_id: null,
    user_id: null,
  },
  last_changed: now.toISOString(),
  last_updated: now.toISOString(),
} satisfies HassEntity;

export const createAlarmPanel = (entity_id: string, overrides: Partial<HassEntity> = {}) => {
  return createEntity(entity_id, defaults, overrides);
}