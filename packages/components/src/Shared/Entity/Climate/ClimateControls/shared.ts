import type { HvacMode } from "@hakit/core";

export type HvacModeData<T> = {
  [key in HvacMode]: T;
};

export const colors: HvacModeData<string[]> = {
  auto: ["#fff", "#f9f9f9"],
  heat_cool: ["#dae8eb", "#cd5401"],
  heat: ["#cfac48", "#cd5401"],
  cool: ["#dae8eb", "#2c8e98"],
  off: ["#848484", "#383838"],
  fan_only: ["#fff", "#f9f9f9"],
  dry: ["#fff", "#ffc0bd"],
};

export const activeColors: HvacModeData<string> = {
  auto: "var(--ha-300)",
  heat_cool: "var(--ha-300)",
  heat: "#cd5401",
  cool: "#2c8e98",
  off: "var(--ha-900-contrast)",
  fan_only: "var(--ha-300)",
  dry: "#ffc0bd",
};

export const icons: HvacModeData<string> = {
  auto: "mdi:thermometer-auto",
  heat_cool: "mdi:autorenew",
  heat: "mdi:fire",
  cool: "mdi:snowflake",
  off: "mdi:power",
  fan_only: "mdi:fan",
  dry: "mdi:water-percent",
};
