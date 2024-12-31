import { HvacMode, HvacAction } from "@hakit/core";

const HVAC_MODES = ["auto", "heat_cool", "heat", "cool", "dry", "fan_only", "off"] as const;

/** Temperature units. */
export const UNIT_C = "°C";
export const UNIT_F = "°F";

export const CLIMATE_PRESET_NONE = "none";

export const enum ClimateEntityFeature {
  TARGET_TEMPERATURE = 1,
  TARGET_TEMPERATURE_RANGE = 2,
  TARGET_HUMIDITY = 4,
  FAN_MODE = 8,
  PRESET_MODE = 16,
  SWING_MODE = 32,
  AUX_HEAT = 64,
}

const hvacModeOrdering = HVAC_MODES.reduce(
  (order, mode, index) => {
    order[mode] = index;
    return order;
  },
  {} as Record<HvacMode, number>,
);

export const compareClimateHvacModes = (mode1: HvacMode, mode2: HvacMode) => hvacModeOrdering[mode1] - hvacModeOrdering[mode2];

export const CLIMATE_HVAC_ACTION_TO_MODE: Record<HvacAction, HvacMode> = {
  cooling: "cool",
  drying: "dry",
  fan: "fan_only",
  preheating: "heat",
  heating: "heat",
  idle: "off",
  off: "off",
  defrosting: "heat",
};

export const CLIMATE_HVAC_ACTION_ICONS: Record<HvacAction, string> = {
  cooling: "mdi:snowflake",
  drying: "mdi:water-percent",
  fan: "mdi:fan",
  heating: "mdi:fire",
  idle: "mdi:clock-outline",
  off: "mdi:power",
  preheating: "mdi:heat-wave",
  defrosting: "mdi:snowflake-alert",
};

export const CLIMATE_HVAC_MODE_ICONS: Record<HvacMode, string> = {
  cool: "mdi:snowflake",
  dry: "mdi:water-percent",
  fan_only: "mdi:fan",
  auto: "mdi:thermostat-auto",
  heat: "mdi:fire",
  off: "mdi:power",
  heat_cool: "mdi:sun-snowflake-variant",
};

export const computeHvacModeIcon = (mode: HvacMode) => CLIMATE_HVAC_MODE_ICONS[(mode ?? "").toLowerCase() as HvacMode];

export type ClimateBuiltInPresetMode = "eco" | "away" | "boost" | "comfort" | "home" | "sleep" | "activity";

export const CLIMATE_PRESET_MODE_ICONS: Record<ClimateBuiltInPresetMode, string> = {
  away: "mdi:account-arrow-right",
  boost: "mdi:rocket-launch",
  comfort: "mdi:sofa",
  eco: "mdi:leaf",
  home: "mdi:home",
  sleep: "mdi:bed",
  activity: "mdi:motion-sensor",
};

export const computePresetModeIcon = (mode: ClimateBuiltInPresetMode) =>
  (mode ?? "").toLowerCase() in CLIMATE_PRESET_MODE_ICONS
    ? CLIMATE_PRESET_MODE_ICONS[mode.toLowerCase() as ClimateBuiltInPresetMode]
    : "mdi:circle-medium";

export type ClimateBuiltInFanMode = "on" | "off" | "auto" | "low" | "mid" | "medium" | "high" | "middle" | "focus" | "diffuse";

export const CLIMATE_FAN_MODE_ICONS: Record<ClimateBuiltInFanMode, string> = {
  on: "mdi:fan",
  off: "mdi:fan-off",
  auto: "mdi:fan-auto",
  low: "mdi:speedometer-slow",
  medium: "mdi:speedometer-medium",
  mid: "mdi:speedometer-medium",
  high: "mdi:speedometer",
  middle: "mdi:speedometer-medium",
  focus: "mdi:target",
  diffuse: "mdi:weather-windy",
};

export const computeFanModeIcon = (mode: ClimateBuiltInFanMode) =>
  (mode ?? "").toLowerCase() in CLIMATE_FAN_MODE_ICONS
    ? CLIMATE_FAN_MODE_ICONS[mode.toLowerCase() as ClimateBuiltInFanMode]
    : "mdi:circle-medium";

export type ClimateBuiltInSwingMode = "off" | "on" | "vertical" | "horizontal" | "both";

export const CLIMATE_SWING_MODE_ICONS: Record<ClimateBuiltInSwingMode, string> = {
  on: "ha:oscillating",
  off: "ha:oscillating-off",
  vertical: "mdi:arrow-up-down",
  horizontal: "mdi:arrow-left-right",
  both: "mdi:arrow-all",
};

export const computeSwingModeIcon = (mode: ClimateBuiltInSwingMode) =>
  (mode ?? "").toLowerCase() in CLIMATE_SWING_MODE_ICONS
    ? CLIMATE_SWING_MODE_ICONS[mode.toLowerCase() as ClimateBuiltInSwingMode]
    : "mdi:circle-medium";
