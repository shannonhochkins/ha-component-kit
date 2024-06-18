import { HassEntity } from "home-assistant-js-websocket";
import { hs2rgb, rgb2hex } from "./colors/convert-color";
import { rgbw2rgb, rgbww2rgb, temperature2rgb } from "./colors/convert-light-color";
import { stateColorBrightness } from "./colors/index";

function toRGB(entity: HassEntity): [number, number, number] | null {
  if (entity.attributes) {
    if ("hs_color" in entity.attributes && entity.attributes.hs_color !== null) {
      return hs2rgb([entity.attributes.hs_color[0], entity.attributes.hs_color[1] / 100]);
    }
    if ("color_temp_kelvin" in entity.attributes && entity.attributes.color_temp_kelvin !== null) {
      return temperature2rgb(entity.attributes.color_temp_kelvin);
    }
    if ("rgb_color" in entity.attributes && entity.attributes.rgb_color !== null) {
      return entity.attributes.rgb_color;
    }
    if ("rgbw_color" in entity.attributes && entity.attributes.rgbw_color !== null) {
      return rgbw2rgb(entity.attributes.rgbw_color);
    }
    if ("rgbww_color" in entity.attributes && entity.attributes.rgbww_color !== null) {
      return rgbww2rgb(entity.attributes.rgbww_color, entity.attributes.min_color_temp_kelvin, entity.attributes.max_color_temp_kelvin);
    }
  }

  return null;
}

export function getCssColorValue(entity: HassEntity | null) {
  const color = entity ? toRGB(entity) : null;
  // we round the values here so the change in decimal place doesn't trigger
  // the react render cycle
  const roundedColor = color ? color.map((x) => x.toFixed(0)).map(Number) : null;
  // TODO - potentially return null here instead, and let @hakit/components determine
  // the css variables if the value is null
  // If a user is using @hakit/core, and not the ThemeProvider - these variables will do & mean nothing.
  // FIX SHANNON, FIX!
  const hexColor = color ? rgb2hex(color) : "var(--ha-A400)";
  const rgbColor = roundedColor ? `rgba(${roundedColor.join(", ")})` : "var(--ha-S500-contrast)";
  const rgbaColor = roundedColor ? `rgba(${[...roundedColor, 0.35].join(", ")})` : "var(--ha-A200)";
  const { css, raw } = stateColorBrightness(entity);
  return {
    color: color || [33, 33, 33],
    hexColor,
    rgbColor,
    rgbaColor,
    brightness: css,
    brightnessValue: raw,
  };
}
