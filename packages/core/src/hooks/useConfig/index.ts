import { useMemo } from "react";
import { useStore } from "@core";

export function useConfig() {
  const config = useStore((state) => state.config);

  // Memoize the config to prevent unnecessary re-renders
  return useMemo(() => config, [config]);
}
