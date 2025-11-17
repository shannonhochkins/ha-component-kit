import { useMemo, useEffect, useState, useCallback } from "react";
import styled from "@emotion/styled";
import {
  ControlSlider,
  Tooltip,
  Column,
  FabCard,
  ColorTempPicker,
  ColorPicker,
  useBreakpoint,
  fallback,
  ColumnProps,
  ControlToggle,
  Menu,
} from "@components";
import {
  useEntity,
  LIGHT_COLOR_MODES,
  OFF,
  ON,
  isUnavailableState,
  useLightBrightness,
  lightSupportsBrightness,
  lightSupportsColorMode,
  lightSupportsColor,
  localize,
  toReadableString,
  lightSupportsFavoriteColors,
  computeDefaultFavoriteColors,
  temperature2rgb,
  getLightCurrentModeRgbColor,
  luminosity,
  rgbww2rgb,
  rgbw2rgb,
  hs2rgb,
  type LightColor,
  useHass,
  DOMAIN_ATTRIBUTES_UNITS,
  isOffState,
} from "@hakit/core";
import type { EntityName, FilterByDomain, LightEntityAttributes, ServiceData } from "@hakit/core";
import colorWheel from "./color_wheel.png";
import { ErrorBoundary } from "react-error-boundary";

const SWATCH_SIZE = 40;

const ButtonBar = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 56px;
  border-radius: 28px;
  background-color: rgba(120, 120, 120, 0.1);
  box-sizing: border-box;
  width: auto;
  padding: 4px;
  gap: 4px;
  margin-top: 24px;
`;

const Separator = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  width: 1px;
  height: 40px;
`;

type MainControl = "brightness" | "color_temp" | "color";

const FabCardColor = styled(FabCard)`
  position: relative;
  .icon {
    background-color: transparent;
    transition: background var(--ha-transition-duration) var(--ha-easing);
  }
  &:after {
    content: "";
    position: absolute;
    inset: 0px;
    border-radius: 50%;
    border: 0px;
    background-image: url(${colorWheel});
    background-size: 101%;
    transition: var(--ha-transition-duration) var(--ha-easing);
    transition-property: inset, border;
    pointer-events: none;
  }
  ${(props) =>
    props.active &&
    `
    .icon {
      background-color: white;
      transition: background var(--ha-transition-duration) var(--ha-easing);
    }
    &:after {
      inset: 2px;
      border: 2px solid var(--ha-S200);
    }
  `}
  svg {
    display: none;
  }
`;

const FabCardTemp = styled(FabCard)`
  position: relative;
  .icon {
    background-color: transparent;
    transition: background var(--ha-transition-duration) var(--ha-easing);
  }
  &:after {
    content: "";
    position: absolute;
    inset: 0px;
    border-radius: 50%;
    border: 0px;
    pointer-events: none;
    background: linear-gradient(0deg, rgb(166, 209, 255) 0%, rgb(255, 255, 255) 50%, rgb(255, 160, 0) 100%);
    transition: var(--ha-transition-duration) var(--ha-easing);
    transition-property: inset, border;
  }
  ${(props) =>
    props.active &&
    `
    .icon {
      background-color: white;
    }
    &:after {
      inset: 2px;
      border: 2px solid var(--ha-S200);
    }
  `}
  svg {
    display: none;
  }
`;

type Extended = React.HTMLAttributes<HTMLDivElement> & ColumnProps;
export interface LightControlsProps extends Extended {
  entity: FilterByDomain<EntityName, "light">;
  onStateChange?: (state: string) => void;
  /** Show the favorite colors section (defaults to true) */
  showFavoriteColors?: boolean;
  /** Provide custom favorite colors instead of computed defaults */
  favoriteColors?: LightColor[];
}

function InternalLightControls({
  entity: _entity,
  onStateChange,
  style,
  showFavoriteColors = true,
  favoriteColors,
  ...rest
}: LightControlsProps) {
  const [control, setControl] = useState<MainControl>("brightness");
  const entity = useEntity(_entity);
  const brightnessValue = useLightBrightness(entity);
  const device = useBreakpoint();
  const isUnavailable = isUnavailableState(entity.state);
  const formatter = useHass((state) => state.formatter);
  const titleValue = useMemo(() => {
    if (entity.state === OFF) {
      return localize("off");
    }
    if (entity.state === ON) {
      return `${brightnessValue}${DOMAIN_ATTRIBUTES_UNITS.light.brightness}`;
    }
    return localize("unavailable");
  }, [brightnessValue, entity.state]);

  useEffect(() => {
    if (onStateChange) {
      onStateChange(titleValue);
    }
  }, [titleValue, onStateChange]);

  // Effects restored per user request.

  const supportsColorTemp = lightSupportsColorMode(entity, LIGHT_COLOR_MODES.COLOR_TEMP);
  const supportsColor = lightSupportsColor(entity);
  const supportsBrightness = lightSupportsBrightness(entity);
  const supportsWhite = lightSupportsColorMode(entity, LIGHT_COLOR_MODES.WHITE);
  const hasEffects = !!(entity?.attributes?.effect_list && entity.attributes.effect_list.length > 0);

  const supportsFavorites = lightSupportsFavoriteColors(entity);
  const computedFavorites = useMemo(() => {
    if (!supportsFavorites) return [] as LightColor[];
    return favoriteColors && favoriteColors.length > 0 ? favoriteColors : computeDefaultFavoriteColors(entity);
  }, [supportsFavorites, favoriteColors, entity]);

  const currentRgb = getLightCurrentModeRgbColor(entity);
  const currentKelvin = entity.attributes.color_temp_kelvin;

  const isFavoriteActive = useCallback(
    (fav: LightColor) => {
      if ("color_temp_kelvin" in fav) {
        return (fav as { color_temp_kelvin: number }).color_temp_kelvin === currentKelvin;
      }
      if ("rgb_color" in fav && currentRgb) {
        const rgb = (fav as { rgb_color: [number, number, number] }).rgb_color;
        return rgb.every((v, i) => v === currentRgb[i]);
      }
      return false;
    },
    [currentKelvin, currentRgb],
  );

  const handleFavoriteClick = useCallback(
    (fav: LightColor) => {
      // Mirror HA: spread favorite object keys directly into service data without using 'any'
      const serviceData: ServiceData<"light", "turnOn"> = {};
      if ("hs_color" in fav) serviceData.hs_color = fav.hs_color;
      if ("color_temp_kelvin" in fav) serviceData.color_temp_kelvin = fav.color_temp_kelvin;
      if ("rgb_color" in fav) serviceData.rgb_color = fav.rgb_color;
      if ("rgbw_color" in fav) serviceData.rgbw_color = fav.rgbw_color;
      if ("rgbww_color" in fav) serviceData.rgbww_color = fav.rgbww_color;
      entity.service.turnOn({ serviceData });
    },
    [entity.service],
  );

  const _handleEffectChange = useCallback(
    (value?: string) => {
      entity.service.turnOn({
        serviceData: {
          effect: value,
        },
      });
    },
    [entity.service],
  );

  return (
    <Column
      fullHeight
      fullWidth
      wrap="nowrap"
      justifyContent={device.xxs ? "flex-start" : "center"}
      style={{
        padding: device.xxs ? "1rem" : "0",
        ...style,
      }}
      {...rest}
    >
      <Column>
        {/* Mirrors HA: if no brightness support, show a simple toggle first */}
        {!supportsBrightness && (
          <ControlToggle
            disabled={isUnavailable}
            reversed
            checked={entity.state === ON}
            onChange={() => {
              entity.service.toggle();
            }}
          />
        )}
        {(supportsColorTemp || supportsColor || supportsBrightness) && (
          <>
            {supportsBrightness && control === "brightness" && (
              <ControlSlider
                sliderColor={entity.state === ON ? entity.custom.color : undefined}
                min={1}
                max={100}
                thickness={device.xxs ? 90 : 100}
                clampValueToBaseline={!isOffState(entity.state)}
                borderRadius={24}
                value={brightnessValue}
                disabled={isUnavailable}
                onChange={(value) => {
                  if (onStateChange) onStateChange(`${Math.round(value)}%`);
                }}
                onChangeApplied={(value) => {
                  entity.service.turnOn({
                    serviceData: { brightness_pct: value },
                  });
                  if (onStateChange) onStateChange(`${Math.round(value)}%`);
                }}
              />
            )}
            {supportsColor && control === "color" && <ColorPicker entity={_entity} />}
            {supportsColorTemp && control === "color_temp" && (
              <ColorTempPicker
                entity={_entity}
                disabled={isUnavailable || entity.state === OFF}
                onChange={(kelvin) => {
                  if (kelvin === null) {
                    if (onStateChange) onStateChange(`${titleValue}`);
                  } else {
                    if (onStateChange) onStateChange(`${kelvin}K`);
                  }
                }}
                onChangeApplied={() => {
                  if (onStateChange) onStateChange(`${titleValue}`);
                }}
              />
            )}
          </>
        )}
      </Column>

      {(supportsColorTemp || supportsColor || supportsBrightness) && (
        <ButtonBar>
          {/* Power button only when brightness supported (HA pattern) */}
          {supportsBrightness && (
            <Tooltip title={entity.state === OFF ? localize("turn_on") : localize("turn_off")}>
              <FabCard
                icon="mdi:power"
                onClick={() => {
                  entity.service.toggle();
                }}
              />
            </Tooltip>
          )}
          {/* Show brightness toggle button only if there are other modes to switch to */}
          {(supportsColor || supportsColorTemp) && supportsBrightness && <Separator />}
          {(supportsColor || supportsColorTemp) && supportsBrightness && (
            <Tooltip title={localize("color_brightness")}>
              <FabCard
                key={`${_entity}-brightness`}
                icon="mdi:brightness-6"
                active={control === "brightness"}
                onClick={() => setControl("brightness")}
              />
            </Tooltip>
          )}
          {supportsColor && (
            <Tooltip title={localize("color")}>
              <FabCardColor key={`${_entity}-color`} active={control === "color"} onClick={() => setControl("color")} />
            </Tooltip>
          )}
          {supportsColorTemp && (
            <Tooltip title={localize("color_temperature")}>
              <FabCardTemp key={`${_entity}-color-temp`} active={control === "color_temp"} onClick={() => setControl("color_temp")} />
            </Tooltip>
          )}
          {supportsWhite && (
            <>
              <Separator />
              <Tooltip title={localize("set_white") /* placeholder key */}>
                <FabCard
                  key={`${_entity}-white`}
                  icon="mdi:file-word-box"
                  onClick={() => {
                    entity.service.turnOn({ serviceData: { white: true } });
                  }}
                />
              </Tooltip>
            </>
          )}
          {/* Effects menu (mirrors HA effect selection placement after controls) */}
          {hasEffects && entity.attributes.effect_list && (
            <Menu
              placement="top"
              items={entity.attributes.effect_list.map((effect) => {
                return {
                  active: entity.attributes.effect === effect,
                  label: toReadableString(effect),
                  onClick: () => {
                    _handleEffectChange(effect);
                  },
                };
              })}
            >
              <Tooltip title={localize("effect")}>
                <FabCard key={`${_entity}-effects`} icon="mdi:stars" />
              </Tooltip>
            </Menu>
          )}
        </ButtonBar>
      )}
      {showFavoriteColors && supportsFavorites && computedFavorites.length > 0 && (
        <FavoritesWrapper>
          {/* TODO: allow user persistence & editing of custom favorite colors */}
          {computedFavorites.map((fav, idx) => {
            const [r, g, b] = getRgbColor(entity.attributes, fav);
            const bg = `rgb(${r}, ${g}, ${b})`;
            const active = isFavoriteActive(fav);
            const lum = luminosity([r, g, b]);
            const contrastColor = lum > 0.8 ? "rgb(33,33,33)" : "white";

            // Helper: clamp & round before hex conversion so decimals don't produce invalid hex like "fe.1c..."
            const rgbToHex = (vals: [number, number, number]) =>
              "#" +
              vals
                .map((v) => Math.min(255, Math.max(0, Math.round(v))))
                .map((v) => v.toString(16).padStart(2, "0"))
                .join("");

            let label: string;
            if ("color_temp_kelvin" in fav) {
              // Only show kelvin label when the light actually supports color temperature; otherwise show hex.
              if (lightSupportsColorMode(entity, LIGHT_COLOR_MODES.COLOR_TEMP)) {
                label = formatter.attributeValue(
                  {
                    ...entity,
                    attributes: {
                      ...entity.attributes,
                      color_temp_kelvin: fav.color_temp_kelvin,
                    },
                  },
                  "color_temp_kelvin",
                ) as string;
              } else {
                label = rgbToHex([r, g, b]);
              }
            } else {
              label = rgbToHex([r, g, b]);
            }
            return (
              <Tooltip key={`fav-${idx}`} title={label}>
                <FavoriteFabCard
                  data-label={label}
                  size={SWATCH_SIZE}
                  icon={active ? "mdi:check-circle-outline" : null}
                  iconProps={{
                    style: {
                      color: contrastColor,
                    },
                  }}
                  noIcon={!active}
                  active={active}
                  style={{
                    backgroundColor: bg,
                    color: contrastColor,
                  }}
                  onClick={() => handleFavoriteClick(fav)}
                />
              </Tooltip>
            );
          })}
        </FavoritesWrapper>
      )}
    </Column>
  );
}

/** A component that will render the controls for a light, this is currently used by the popup for buttons */
export function LightControls(props: LightControlsProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "LightControls" })}>
      <InternalLightControls {...props} />
    </ErrorBoundary>
  );
}

function getRgbColor(entityAttributes: LightEntityAttributes, color: LightColor): [number, number, number] {
  if (color) {
    if ("hs_color" in color) {
      return hs2rgb([color.hs_color[0], color.hs_color[1] / 100]);
    }
    if ("color_temp_kelvin" in color) {
      return temperature2rgb(color.color_temp_kelvin);
    }
    if ("rgb_color" in color) {
      return color.rgb_color;
    }
    if ("rgbw_color" in color) {
      return rgbw2rgb(color.rgbw_color);
    }
    if ("rgbww_color" in color) {
      return rgbww2rgb(color.rgbww_color, entityAttributes.min_color_temp_kelvin, entityAttributes.max_color_temp_kelvin);
    }
  }

  return [255, 255, 255];
}

// Styled components for favorites
const FavoritesWrapper = styled.div`
  /* Keep a consistent swatch size & gap regardless of parent width */
  --favorite-swatch-size: ${SWATCH_SIZE}px;
  --favorite-swatch-gap: 8px;
  margin-top: 16px;
  display: grid;
  width: 100%;
  gap: var(--favorite-swatch-gap);
  /* Fixed-size columns so they don't stretch when there's extra space */
  grid-template-columns: repeat(4, var(--favorite-swatch-size));
  justify-content: center; /* center the 4-column block horizontally */
  align-items: center;
  justify-items: center;
`;

const FavoriteFabCard = styled(FabCard)`
  position: relative;
  box-sizing: border-box;
  width: var(--favorite-swatch-size);
  height: var(--favorite-swatch-size);
  .icon {
    opacity: 0;
  }
  &:hover {
    transform: scale(0.97);
  }
`;
