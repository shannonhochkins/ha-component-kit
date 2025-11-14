import { useStore, Store } from "@core";

/**
 * The allowable registry data keys that can be retrieved via the hook.
 */
export type RegistryDataKey = "entitiesRegistryDisplay" | "services" | "areas" | "devices" | "floors";

/**
 * React hook to access registry-like data slices from the internal store with proper typing.
 * It automatically returns the correctly inferred type based on the `type` provided.
 *
 * Example:
 * const devices = useRegistryData('devices'); // devices: Record<string, DeviceRegistryEntry>
 * const areas = useRegistryData('areas'); // areas: Record<string, AreaRegistryEntry>
 */
export function useRegistryData<K extends RegistryDataKey>(type: K): Store[K] {
  return useStore((state) => state[type]);
}
