import { HassEntity } from "home-assistant-js-websocket";
import { createEntity } from "./createEntity";

const now = new Date();

const defaults = {
  entity_id: "person.john_doe",
  state: "home",
  attributes: {
    editable: true,
    id: "",
    latitude: 58.8553466796875,
    longitude: 17.237117368008736,
    gps_accuracy: 35,
    source: "device_tracker.john_doe_iphone",
    user_id: "",
    device_trackers: ["device_tracker.john_doe_iphone"],
    entity_picture: "",
    friendly_name: "John",
    icon: "mdi:account",
  },
  context: {
    id: "",
    parent_id: null,
    user_id: null,
  },
  last_changed: now.toISOString(),
  last_updated: now.toISOString(),
} satisfies HassEntity;

export const createPerson = (entity_id: string, overrides: Partial<HassEntity> = {}) => {
  return createEntity(entity_id, defaults, overrides);
};
