import type { EntityRegistryDisplayEntry, EntityRegistryEntry } from "./entity_registry";
/** Display entries have no disabled flag. This entry point is also safe for pure/server-side adapters. */
export function isEntityRegistryEntryDisabled(entry: EntityRegistryDisplayEntry | EntityRegistryEntry | undefined): boolean {
  return !!entry && "disabled_by" in entry && !!entry.disabled_by;
}
