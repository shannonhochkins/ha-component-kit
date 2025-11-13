import { useStore } from "@core";

export function useLocaleData() {
  return useStore.getState().locale;
}
