import { DomainService } from "@core";
import type { VacuumEntityState } from "@hakit/core";

type VacuumData<T> = {
  [key in VacuumEntityState | DomainService<"vacuum">]: T;
};
export const icons: VacuumData<string> = {
  start: "mdi:play",
  pause: "mdi:pause",
  stop: "mdi:stop",
  on: "mdi:play",
  off: "mdi:stop",
  paused: "mdi:pause",
  returning: "mdi:home-map-marker",
  returnToBase: "mdi:home-map-marker",
  cleanSpot: "mdi:map-marker",
  cleaning: "mdi:play",
  docked: "mdi:home-map-marker",
  idle: "mdi:play",
  error: "mdi:alert",
  unknown: "mdi:alert",
};
