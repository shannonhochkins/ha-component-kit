import { HassEntity } from "home-assistant-js-websocket";

export const createEntity = (
  entity_id: string,
  defaults: HassEntity,
  overrides: Partial<HassEntity> = {},
): {
  [entity_id: string]: HassEntity;
} => {
  const attributes = {
    ...defaults.attributes,
    ...overrides.attributes,
  };
  if (typeof overrides.attributes !== "undefined") {
    Object.entries(overrides.attributes).forEach(([key, val]) => {
      if (typeof val === "undefined") {
        delete attributes[key];
      }
    });
  }
  return {
    [entity_id]: {
      ...defaults,
      ...overrides,
      attributes,
      entity_id,
    },
  };
};