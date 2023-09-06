import type { VacuumEntityState } from "@hakit/core";

type VacuumData<T> = {
  [key in VacuumEntityState]: T;
};

export const colors: VacuumData<string[]> = {
  on: [],
  off: [],
  cleaning: ["#fff", "#f9f9f9"],
  docked: ["#dae8eb", "#cd5401"],
  idle: ["#cfac48", "#cd5401"],
  paused: ["#dae8eb", "#2c8e98"],
  returning: ["#848484", "#383838"],
  error: ["#fff", "#f9f9f9"],
  unknown: ["#fff", "#f9f9f9"],
};

export const activeColors: VacuumData<string> = {
  on: "var(--ha-primary-active)",
  off: "",
  cleaning: "var(--ha-primary-active)",
  docked: "var(--ha-primary-active)",
  idle: "#cd5401",
  paused: "#2c8e98",
  returning: "#848484",
  error: "var(--ha-primary-active)",
  unknown: "var(--ha-primary-active)",
};

export const icons: VacuumData<string> = {
  on: "mdi:robot-vacuum",
  off: "mdi:robot-vacuum-off",
  cleaning: "mdi:play",
  docked: "mdi:stop",
  idle: "mdi:stop",
  paused: "mdi:pause",
  returning: "mdi:home-map-marker",
  error: "mdi:robot-vacuum-alert",
  unknown: "mdi:crosshairs-question",
};
// these are the available states for the vacuum
// "cleaning" | "docked" | "idle" | "paused" | "returning" | "error" | "unknown" | string;
