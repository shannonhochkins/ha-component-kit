import { HassEntity } from "home-assistant-js-websocket";
import { ON } from "@core";

export const stateColorBrightness = (
  entity: HassEntity | null,
): {
  css: string;
  raw: number;
} => {
  if (entity && entity.attributes && entity.attributes.brightness && !entity.entity_id.startsWith("plant")) {
    // lowest brightness will be around 50% (that's pretty dark)
    const brightness = entity.attributes.brightness;
    const brightnessValue = entity.state === ON ? Math.max(Math.round(((entity.attributes.brightness ?? 0) * 100) / 255), 1) : 0;
    const rounded = Number(Number((brightness + 245) / 5).toFixed(0));
    return {
      raw: brightnessValue,
      css: `brightness(${rounded}%)`,
    };
  }
  return {
    css: `brightness(100%)`,
    raw: 100,
  };
};
