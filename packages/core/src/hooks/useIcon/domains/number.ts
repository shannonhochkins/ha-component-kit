import type { HassEntity } from "home-assistant-js-websocket";
import { FIXED_DEVICE_CLASS_ICONS } from "./constants";

export const numberIcon = (entity: HassEntity): string | undefined => {
  const dclass = entity.attributes.device_class;

  if (dclass && dclass in FIXED_DEVICE_CLASS_ICONS) {
    return FIXED_DEVICE_CLASS_ICONS[dclass as keyof typeof FIXED_DEVICE_CLASS_ICONS];
  }

  return undefined;
};
