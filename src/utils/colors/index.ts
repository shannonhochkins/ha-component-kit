import { HassEntity } from "home-assistant-js-websocket";

export const stateColorBrightness = (stateObj: HassEntity): string | null => {
  if (
    stateObj.attributes.brightness &&
    !stateObj.entity_id.startsWith("plant")
  ) {
    // lowest brightness will be around 50% (that's pretty dark)
    const brightness = stateObj.attributes.brightness;
    return `brightness(${(brightness + 245) / 5}%)`;
  }
  return null;
};
