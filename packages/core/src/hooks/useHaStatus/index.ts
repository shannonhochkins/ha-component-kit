import { useConfig } from "@core";
import { type HassConfig } from "home-assistant-js-websocket";

/**
 * useHaStatus - A custom React hook to get the current status of the Home Assistant instance.
 *
 * This hook uses the `useHass` hook to access the Home Assistant context and retrieves the configuration state from the store.
 *
 * @returns {HassConfig["state"] | "LOADING"} - The current state of the Home Assistant configuration. If the configuration is not available, it returns 'LOADING'.
 *
 * Example usage:
 * ```tsx
 * import { useHaStatus } from '@core';
 *
 * const MyComponent = () => {
 *   const haStatus = useHaStatus();
 *
 *   return <div>Home Assistant Status: {haStatus}</div>;
 * };
 * ```
 */
export function useHaStatus(): HassConfig["state"] | "LOADING" {
  const config = useConfig();
  return config?.state ?? "LOADING";
}
