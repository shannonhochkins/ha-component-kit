import type { VacuumMode } from "@hakit/core";

export type VacuumData<T> = {
  [key in VacuumMode]: T;
};

export const colors: VacuumData<string[]> = {
  start: ["#fff", "#f9f9f9"],
  pause: ["#dae8eb", "#cd5401"],
  stop: ["#cfac48", "#cd5401"],
  clean_spot: ["#dae8eb", "#2c8e98"],
  locate: ["#848484", "#383838"],
  return_to_base: ["#fff", "#f9f9f9"],
};

export const activeColors: VacuumData<string> = {
  start: "var(--ha-primary-active)",
  pause: "var(--ha-primary-active)",
  stop: "#cd5401",
  clean_spot: "#2c8e98",
  locate: "#848484",
  return_to_base: "var(--ha-primary-active)",
};

export const icons: VacuumData<string> = {
  start: "mdi:play",
  pause: "mdi:pause",
  stop: "mdi:stop",
  clean_spot: "mdi:target-variant",
  locate: "mdi:map-marker",
  return_to_base: "mdi:home-map-marker",
};
