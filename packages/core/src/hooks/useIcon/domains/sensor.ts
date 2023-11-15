import type { HassEntity } from "home-assistant-js-websocket";
import { UNIT_C, UNIT_F } from "@core";
import { FIXED_DEVICE_CLASS_ICONS } from "./constants";
import { batteryStateIcon } from "./battery";

export const SENSOR_DEVICE_CLASS_BATTERY = "battery";

export const sensorIcon = (entity?: HassEntity): string | undefined => {
  const dclass = entity?.attributes.device_class;

  if (dclass && dclass in FIXED_DEVICE_CLASS_ICONS) {
    return FIXED_DEVICE_CLASS_ICONS[dclass as keyof typeof FIXED_DEVICE_CLASS_ICONS];
  }

  if (dclass === SENSOR_DEVICE_CLASS_BATTERY) {
    return entity ? batteryStateIcon(entity) : "mdi:battery";
  }

  const unit = entity?.attributes.unit_of_measurement;
  if (unit === UNIT_C || unit === UNIT_F) {
    return "mdi:thermometer";
  }

  return undefined;
};
