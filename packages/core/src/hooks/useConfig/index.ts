import { useEffect, useState, useMemo } from "react";
import { subscribeConfig, type HassConfig } from "home-assistant-js-websocket";
import { useHass } from "@core";

export function useConfig() {
  const { useStore } = useHass();
  const connection = useStore((state) => state.connection);
  const [config, setConfig] = useState<HassConfig | null>(null);

  useEffect(() => {
    if (!connection) return;
    // Subscribe to config updates
    const unsubscribe = subscribeConfig(connection, (newConfig) => {
      setConfig(newConfig);
    });
    // Cleanup function to unsubscribe on unmount
    return () => {
      unsubscribe();
    };
  }, [connection]); // Only re-run if connection changes

  // Memoize the config to prevent unnecessary re-renders
  return useMemo(() => config, [config]);
}
