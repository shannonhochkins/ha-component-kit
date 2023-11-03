import { HassEntity } from "home-assistant-js-websocket";

export const stateColorBrightness = (
  entity: HassEntity | null,
): {
  css: string;
  raw: number;
} => {
  if (entity && entity.attributes && entity.attributes.brightness && !entity.entity_id.startsWith("plant")) {
    // lowest brightness will be around 50% (that's pretty dark)
    const brightness = entity.attributes.brightness;
    return {
      raw: (brightness + 245) / 5,
      css: `brightness(${(brightness + 245) / 5}%)`,
    };
  }
  return {
    css: `brightness(100%)`,
    raw: 100,
  };
};
