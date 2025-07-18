import { useMemo } from "react";
import { HassEntityWithService, ON, lightSupportsColorMode, getLightCurrentModeRgbColor, rgb2hs, LIGHT_COLOR_MODES } from "@core";

export type UseLightColorReturn = {
  /** The adjusted brightness color, adjusted to a percentage scale, this will change based on the entity state/attribute values */
  brightnessAdjusted: number | undefined;
  /** The white color component of the light. */
  white: number | undefined;
  /** The cool white color component of the light. */
  coolWhite: number | undefined;
  /** The warm white color component of the light. */
  warmWhite: number | undefined;
  /** The brightness of the light's color component. */
  colorBrightness: number | undefined;
  /** The hue and saturation values of the light's color component. */
  hs: [number, number] | undefined;
};

export const useLightColor = (entity: HassEntityWithService<"light">): UseLightColorReturn => {
  const brightnessAdjusted = useMemo<number | undefined>(() => {
    if (entity.state === ON) {
      if (
        entity.attributes.color_mode === LIGHT_COLOR_MODES.RGB &&
        entity.attributes.rgb_color &&
        !lightSupportsColorMode(entity, LIGHT_COLOR_MODES.RGBWW) &&
        !lightSupportsColorMode(entity, LIGHT_COLOR_MODES.RGBW)
      ) {
        const maxVal = Math.max(...entity.attributes.rgb_color);

        if (maxVal < 255) {
          return maxVal;
        }
      }
      return undefined;
    }
    return undefined;
  }, [entity]);

  const white = useMemo(() => {
    const value =
      entity.state !== ON
        ? undefined
        : entity.attributes.color_mode === LIGHT_COLOR_MODES.RGBW && entity.attributes.rgbw_color
          ? Math.round((entity.attributes.rgbw_color[3] * 100) / 255)
          : undefined;
    return value != null ? (value * 255) / 100 : undefined;
  }, [entity]);
  const coolWhite = useMemo(() => {
    const value =
      entity.state !== ON
        ? undefined
        : entity.attributes.color_mode === LIGHT_COLOR_MODES.RGBWW && entity.attributes.rgbww_color
          ? Math.round((entity.attributes.rgbww_color[3] * 100) / 255)
          : undefined;
    return value != null ? (value * 255) / 100 : undefined;
  }, [entity]);
  const warmWhite = useMemo(() => {
    const value =
      entity.state !== ON
        ? undefined
        : entity.attributes.color_mode === LIGHT_COLOR_MODES.RGBWW && entity.attributes.rgbww_color
          ? Math.round((entity.attributes.rgbww_color[4] * 100) / 255)
          : undefined;
    return value != null ? (value * 255) / 100 : undefined;
  }, [entity]);
  const currentRgbColor = getLightCurrentModeRgbColor(entity);
  const colorBrightness = useMemo(() => {
    const value =
      entity.state !== ON ? undefined : currentRgbColor ? Math.round((Math.max(...currentRgbColor.slice(0, 3)) * 100) / 255) : undefined;
    return value != null ? (value * 255) / 100 : undefined;
  }, [entity, currentRgbColor]);
  const hs = useMemo(() => {
    return entity.state !== ON ? undefined : currentRgbColor ? rgb2hs(currentRgbColor.slice(0, 3) as [number, number, number]) : undefined;
  }, [entity, currentRgbColor]);

  return {
    brightnessAdjusted,
    white,
    coolWhite,
    warmWhite,
    colorBrightness,
    hs,
  };
};
