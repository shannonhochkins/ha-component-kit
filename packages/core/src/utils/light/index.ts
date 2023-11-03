import type { HassEntityWithService, LightColorMode } from "@core";
import { LIGHT_COLOR_MODES } from "../../types/autogenerated-types-by-domain";

const modesSupportingColor: LightColorMode[] = [
  LIGHT_COLOR_MODES.HS,
  LIGHT_COLOR_MODES.XY,
  LIGHT_COLOR_MODES.RGB,
  LIGHT_COLOR_MODES.RGBW,
  LIGHT_COLOR_MODES.RGBWW,
];

const modesSupportingBrightness: LightColorMode[] = [
  ...modesSupportingColor,
  LIGHT_COLOR_MODES.COLOR_TEMP,
  LIGHT_COLOR_MODES.BRIGHTNESS,
  LIGHT_COLOR_MODES.WHITE,
];

export const lightSupportsColorMode = (
  entity: HassEntityWithService<"light">,
  mode: LightColorMode,
) => entity.attributes.supported_color_modes?.includes(mode) || false;

export const lightIsInColorMode = (entity: HassEntityWithService<"light">) =>
  (entity.attributes.color_mode &&
    modesSupportingColor.includes(entity.attributes.color_mode)) ||
  false;

export const lightSupportsColor = (entity: HassEntityWithService<"light">) =>
  entity.attributes.supported_color_modes?.some((mode) =>
    modesSupportingColor.includes(mode),
  ) || false;

export const lightSupportsBrightness = (
  entity: HassEntityWithService<"light">,
) =>
  entity.attributes.supported_color_modes?.some((mode) =>
    modesSupportingBrightness.includes(mode),
  ) || false;

export const getLightCurrentModeRgbColor = (
  entity: HassEntityWithService<"light">,
): number[] | undefined =>
  entity.attributes.color_mode === LIGHT_COLOR_MODES.RGBWW
    ? entity.attributes.rgbww_color
    : entity.attributes.color_mode === LIGHT_COLOR_MODES.RGBW
    ? entity.attributes.rgbw_color
    : entity.attributes.rgb_color;
