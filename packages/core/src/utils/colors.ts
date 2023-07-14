import { HassEntity } from "home-assistant-js-websocket";
import { hs2rgb, rgb2hex } from "./colors/convert-color";
import {
  rgbw2rgb,
  rgbww2rgb,
  temperature2rgb,
} from "./colors/convert-light-color";
import { stateColorBrightness } from "./colors/index";

function toRGB(entity: HassEntity): [number, number, number] | null {
  if (entity.attributes) {
    if ("hs_color" in entity.attributes) {
      return hs2rgb([
        entity.attributes.hs_color[0],
        entity.attributes.hs_color[1] / 100,
      ]);
    }
    if ("color_temp_kelvin" in entity.attributes) {
      return temperature2rgb(entity.attributes.color_temp_kelvin);
    }
    if ("rgb_color" in entity.attributes) {
      return entity.attributes.rgb_color;
    }
    if ("rgbw_color" in entity.attributes) {
      return rgbw2rgb(entity.attributes.rgbw_color);
    }
    if ("rgbww_color" in entity.attributes) {
      return rgbww2rgb(
        entity.attributes.rgbww_color,
        entity.attributes.min_color_temp_kelvin,
        entity.attributes.max_color_temp_kelvin
      );
    }
  }

  return null;
}

export function getCssColorValue(entity: HassEntity) {
  const color = toRGB(entity);
  const hexColor = color ? rgb2hex(color) : "var(--ha-primary-active)";
  const rgbColor = color
    ? `rgba(${color.join(", ")})`
    : "var(--ha-primary-inactive)";
  const rgbaColor = color
    ? `rgba(${[...color, 0.35].join(", ")})`
    : "var(--ha-primary-active)";
  const brightness = stateColorBrightness(entity);
  return {
    hexColor,
    rgbColor,
    rgbaColor,
    brightness,
  };
}
