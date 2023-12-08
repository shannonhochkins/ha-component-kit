import { join, map, capitalize, split } from "lodash";

export function toReadableString(str?: string | number) {
  if (!str) {
    return "";
  }
  return join(map(split(`${str}`, "_"), capitalize), " ");
}
