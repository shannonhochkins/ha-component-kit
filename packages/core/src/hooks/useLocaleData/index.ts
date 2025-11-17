import { useHass } from "@core";

export function useLocaleData() {
  return useHass.getState().locale;
}
