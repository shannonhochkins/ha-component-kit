import { useMemo } from "react";
import { useHass } from "@core";

export function useConfig() {
  const config = useHass((state) => state.config);

  // Memoize the config to prevent unnecessary re-renders
  return useMemo(() => config, [config]);
}
