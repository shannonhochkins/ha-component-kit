/**
 * Device & entity registry helpers and subscription utilities.
 *
 * This module wraps Home Assistant websocket commands for the device registry and
 * provides a set of lookup builders and higher-level selection/filtering utilities
 * consumed by UI components (e.g. device pickers, area views). It also normalizes
 * naming so that fallbacks (like deriving a device label from one of its entities)
 * are consistently applied.
 *
 * Key exports:
 * - Subscription: `subscribeDeviceRegistry` (debounced event driven updates)
 * - Mutations: `updateDeviceRegistryEntry`, `removeConfigEntryFromDevice`
 * - Lookups: `getDeviceEntityLookup`, `getDeviceEntityDisplayLookup`, `getDeviceIntegrationLookup`
 * - Context resolution: `getDeviceContext`
 * - Filtering & listing: `getDevices` (rich multi-criteria filtering)
 */
import {
  AreaRegistryEntry,
  caseInsensitiveStringCompare,
  computeAreaName,
  computeDeviceNameDisplay,
  computeDomain,
  computeStateName,
  EntityListInfoCommon,
  EntityName,
  EntityRegistryDisplayEntry,
  EntityRegistryEntry,
  FloorRegistryEntry,
  LocaleKeys,
  localize,
  RegistryEntry,
} from "@core";
import { Connection, createCollection, HassEntities, HassEntity } from "home-assistant-js-websocket";
import { Store } from "home-assistant-js-websocket/dist/store.js";
import { debounce } from "lodash";
import { EntitySources } from "./entity_sources";

/**
 * Home Assistant device registry entry (extended shape).
 * Mirrors HA's `config/device_registry/list` response with selected fields.
 */
export interface DeviceRegistryEntry extends RegistryEntry {
  id: string;
  config_entries: string[];
  config_entries_subentries: Record<string, (string | null)[]>;
  connections: [string, string][];
  identifiers: [string, string][];
  manufacturer: string | null;
  model: string | null;
  model_id: string | null;
  name: string | null;
  labels: string[];
  sw_version: string | null;
  hw_version: string | null;
  serial_number: string | null;
  via_device_id: string | null;
  area_id: string | null;
  name_by_user: string | null;
  entry_type: "service" | null;
  disabled_by: "user" | "integration" | "config_entry" | null;
  configuration_url: string | null;
  primary_config_entry: string | null;
}

/**
 * Retrieve the full device registry list from Home Assistant.
 * @param conn Active websocket connection.
 * @returns Promise resolving to the array of device registry entries.
 */
const fetchDeviceRegistry = (conn: Connection) => conn.sendMessagePromise<DeviceRegistryEntry[]>({ type: "config/device_registry/list" });

/**
 * Internal helper to subscribe to device registry update events.
 * Debounces fetches to avoid hammering the websocket when bursts of updates occur.
 * @param conn Active HA connection.
 * @param store Local collection store receiving updated state.
 */
const subscribeDeviceRegistryUpdates = (conn: Connection, store: Store<DeviceRegistryEntry[]>) =>
  conn.subscribeEvents(
    debounce(() => fetchDeviceRegistry(conn).then((devices) => store.setState(devices, true)), 500, { leading: true, trailing: true }),
    "device_registry_updated",
  );

/**
 * Public subscription wrapper providing createCollection semantics.
 * @param conn Active HA connection.
 * @param onChange Callback invoked with the latest device list anytime it changes.
 * @returns Unsubscribe function to stop listening.
 */
export const subscribeDeviceRegistry = (conn: Connection, onChange: (devices: DeviceRegistryEntry[]) => void) =>
  createCollection<DeviceRegistryEntry[]>("_dr", fetchDeviceRegistry, subscribeDeviceRegistryUpdates, conn, onChange);

export type DeviceEntityDisplayLookup = Record<string, EntityRegistryDisplayEntry[]>;

export type DeviceEntityLookup = Record<string, EntityRegistryEntry[]>;

export interface DeviceRegistryEntryMutableParams {
  area_id?: string | null;
  name_by_user?: string | null;
  disabled_by?: string | null;
  labels?: string[];
}

/**
 * Attempt to derive a readable device name from one of its entities' state names.
 * Used when the device has no explicit name.
 * @param hassEntities Current states map.
 * @param entities Entities associated with the device (or raw entity_id strings).
 * @returns First non-empty computed state name or undefined.
 */
export const fallbackDeviceName = (
  hassEntities: HassEntities,
  entities: EntityRegistryEntry[] | EntityRegistryDisplayEntry[] | string[],
) => {
  for (const entity of entities || []) {
    const entityId = typeof entity === "string" ? entity : entity.entity_id;
    const stateObj = hassEntities[entityId];
    if (stateObj) {
      return computeStateName(stateObj);
    }
  }
  return undefined;
};

/**
 * Filter devices by a specific area id.
 * @param devices All devices.
 * @param areaId Target area id.
 */
export const devicesInArea = (devices: DeviceRegistryEntry[], areaId: string) => devices.filter((device) => device.area_id === areaId);

/**
 * Update mutable fields on a device registry entry.
 * @param connection HA connection.
 * @param deviceId Target device id.
 * @param updates Partial of mutable params.
 * @returns Updated device entry.
 */
export const updateDeviceRegistryEntry = (connection: Connection, deviceId: string, updates: Partial<DeviceRegistryEntryMutableParams>) =>
  connection.sendMessagePromise<DeviceRegistryEntry>({ type: "config/device_registry/update", device_id: deviceId, ...updates });

/**
 * Detach a config entry from a device (e.g. removing an integration association).
 * @param connection HA connection.
 * @param deviceId Device id.
 * @param configEntryId Config entry id to remove.
 * @returns Updated device entry.
 */
export const removeConfigEntryFromDevice = (connection: Connection, deviceId: string, configEntryId: string) =>
  connection.sendMessagePromise<DeviceRegistryEntry>({
    type: "config/device_registry/remove_config_entry",
    device_id: deviceId,
    config_entry_id: configEntryId,
  });

/**
 * Sort devices in-place by their name using locale-aware case-insensitive comparison.
 * @param entries Mutable array of device entries.
 * @param language BCP-47 locale tag.
 */
export const sortDeviceRegistryByName = (entries: DeviceRegistryEntry[], language: string) =>
  entries.sort((entry1, entry2) => caseInsensitiveStringCompare(entry1.name || "", entry2.name || "", language));

/**
 * Build a lookup mapping device_id => entities (raw registry entries).
 * @param entities All entity registry entries.
 */
export const getDeviceEntityLookup = (entities: EntityRegistryEntry[]): DeviceEntityLookup => {
  const deviceEntityLookup: DeviceEntityLookup = {};
  for (const entity of entities) {
    if (!entity.device_id) {
      continue;
    }
    if (!(entity.device_id in deviceEntityLookup)) {
      deviceEntityLookup[entity.device_id] = [];
    }
    deviceEntityLookup[entity.device_id].push(entity);
  }
  return deviceEntityLookup;
};

/**
 * Build a lookup mapping device_id => display entities (enriched entries).
 * @param entities Enriched entity display entries.
 */
export const getDeviceEntityDisplayLookup = (entities: EntityRegistryDisplayEntry[]): DeviceEntityDisplayLookup => {
  const deviceEntityLookup: DeviceEntityDisplayLookup = {};
  for (const entity of entities) {
    if (!entity.device_id) {
      continue;
    }
    if (!(entity.device_id in deviceEntityLookup)) {
      deviceEntityLookup[entity.device_id] = [];
    }
    deviceEntityLookup[entity.device_id].push(entity);
  }
  return deviceEntityLookup;
};

export interface ConfigEntry {
  entry_id: string;
  domain: string;
  title: string;
  source: string;
  state: "loaded" | "setup_error" | "migration_error" | "setup_retry" | "not_loaded" | "failed_unload" | "setup_in_progress";
  supports_options: boolean;
  supports_remove_device: boolean;
  supports_unload: boolean;
  supports_reconfigure: boolean;
  supported_subentry_types: Record<string, { supports_reconfigure: boolean }>;
  num_subentries: number;
  pref_disable_new_entities: boolean;
  pref_disable_polling: boolean;
  disabled_by: "user" | null;
  reason: string | null;
  error_reason_translation_key: string | null;
  error_reason_translation_placeholders: Record<string, string> | null;
}

/**
 * Derive a mapping of device_id => set of integration domains.
 * Sources:
 * - Primary: entitySources (entity_id -> domain) for entities bound to the device.
 * - Fallback: config entry domains for devices that have no entities.
 * @param entitySources Source map from `entity/source`.
 * @param entities Entity entries (display or raw) to inspect for device linkage.
 * @param devices Optional list of devices (for fallback when no entities).
 * @param configEntries Optional config entry list for domain fallback.
 */
export const getDeviceIntegrationLookup = (
  entitySources: EntitySources,
  entities: EntityRegistryDisplayEntry[] | EntityRegistryEntry[],
  devices?: DeviceRegistryEntry[],
  configEntries?: ConfigEntry[],
): Record<string, Set<string>> => {
  const deviceIntegrations: Record<string, Set<string>> = {};

  for (const entity of entities) {
    const source = entitySources[entity.entity_id];
    if (!source?.domain || entity.device_id === null) {
      continue;
    }

    deviceIntegrations[entity.device_id!] = deviceIntegrations[entity.device_id!] || new Set<string>();
    deviceIntegrations[entity.device_id!].add(source.domain);
  }
  // Lookup devices that have no entities
  if (devices && configEntries) {
    for (const device of devices) {
      for (const config_entry_id of device.config_entries) {
        const entry = configEntries.find((e) => e.entry_id === config_entry_id);
        if (entry?.domain) {
          deviceIntegrations[device.id] = deviceIntegrations[device.id] || new Set<string>();
          deviceIntegrations[device.id].add(entry.domain);
        }
      }
    }
  }
  return deviceIntegrations;
};

/**
 * Combined context for a device including resolved area and floor.
 */
interface DeviceContext {
  device: DeviceRegistryEntry;
  area: AreaRegistryEntry | null;
  floor: FloorRegistryEntry | null;
}

/**
 * Resolve the area and floor objects for a given device.
 * @param device Device entry.
 * @param areas Lookup of areas by id.
 * @param floors Lookup of floors by id.
 */
export const getDeviceContext = (
  device: DeviceRegistryEntry,
  areas: Record<string, AreaRegistryEntry>,
  floors: Record<string, FloorRegistryEntry>,
): DeviceContext => {
  const areaId = device.area_id;
  const area = areaId ? areas[areaId] : undefined;
  const floorId = area?.floor_id;
  const floor = floorId ? floors[floorId] : undefined;

  return {
    device: device,
    area: area || null,
    floor: floor || null,
  };
};

/**
 * UI-friendly projection of a device suitable for list/search components.
 */
export interface DeviceListItem extends EntityListInfoCommon {
  domain?: string;
  domain_name?: string;
}

/**
 * Build a filtered, decorated list of devices for display/search.
 *
 * Filtering criteria (applied in sequence):
 * - Disabled devices excluded (unless matching `value` id)
 * - includeDomains: keep devices having at least one entity in one of the domains.
 * - excludeDomains: drop devices having any entity in excluded domains.
 * - excludeDevices: explicit id exclusion list.
 * - includeDeviceClasses: keep devices with entities whose state attributes.device_class matches.
 * - entityFilter: arbitrary predicate on entity state objects (logical OR across entities).
 * - deviceFilter: arbitrary predicate on the device (OR forcing inclusion if matches current `value`).
 *
 * Naming logic:
 * - Primary label derived via `computeDeviceNameDisplay` (uses explicit name or entity fallbacks).
 * - Secondary label uses area name when available.
 * - Domain & localized domain name derived from primary config entry (if present).
 *
 * @param hassEntities States map for entity-level filtering/device naming.
 * @param areas Area lookup.
 * @param floors Floor lookup.
 * @param entitiesI Entity display entry lookup keyed by entity_id.
 * @param devicesI Device registry lookup keyed by id.
 * @param configEntryLookup Config entries keyed by entry_id.
 * @param includeDomains Domains that must appear in device's entities to include the device.
 * @param excludeDomains Domains that, if present, exclude the device.
 * @param includeDeviceClasses Device classes that must appear among entities.
 * @param deviceFilter Optional predicate on device entry.
 * @param entityFilter Optional predicate on entity state.
 * @param excludeDevices Explicit list of device ids to omit.
 * @param value Current selected device id (always retained even if disabled or filtered out).
 * @param idPrefix Optional prefix applied to output item ids.
 * @returns Array of `DeviceListItem` ready for rendering/search.
 */
export const getDevices = (
  hassEntities: HassEntities,
  areas: Record<string, AreaRegistryEntry>,
  floors: Record<string, FloorRegistryEntry>,
  entitiesI: Record<string, EntityRegistryDisplayEntry>,
  devicesI: Record<string, DeviceRegistryEntry>,
  configEntryLookup: Record<string, ConfigEntry>,
  includeDomains?: string[],
  excludeDomains?: string[],
  includeDeviceClasses?: string[],
  deviceFilter?: (device: DeviceRegistryEntry) => boolean,
  entityFilter?: (entity: HassEntity) => boolean,
  excludeDevices?: string[],
  value?: string,
  idPrefix = "",
): DeviceListItem[] => {
  const devices = Object.values(devicesI);
  const entities = Object.values(entitiesI);

  let deviceEntityLookup: DeviceEntityDisplayLookup = {};

  if (includeDomains || excludeDomains || includeDeviceClasses || entityFilter) {
    deviceEntityLookup = getDeviceEntityDisplayLookup(entities);
  }

  let inputDevices = devices.filter((device) => device.id === value || !device.disabled_by);

  if (includeDomains) {
    inputDevices = inputDevices.filter((device) => {
      const devEntities = deviceEntityLookup[device.id];
      if (!devEntities || !devEntities.length) {
        return false;
      }
      return deviceEntityLookup[device.id].some((entity) => includeDomains.includes(computeDomain(entity.entity_id as EntityName)));
    });
  }

  if (excludeDomains) {
    inputDevices = inputDevices.filter((device) => {
      const devEntities = deviceEntityLookup[device.id];
      if (!devEntities || !devEntities.length) {
        return true;
      }
      return entities.every((entity) => !excludeDomains.includes(computeDomain(entity.entity_id as EntityName)));
    });
  }

  if (excludeDevices) {
    inputDevices = inputDevices.filter((device) => !excludeDevices!.includes(device.id));
  }

  if (includeDeviceClasses) {
    inputDevices = inputDevices.filter((device) => {
      const devEntities = deviceEntityLookup[device.id];
      if (!devEntities || !devEntities.length) {
        return false;
      }
      return deviceEntityLookup[device.id].some((entity) => {
        const stateObj = hassEntities[entity.entity_id];
        if (!stateObj) {
          return false;
        }
        return stateObj.attributes.device_class && includeDeviceClasses.includes(stateObj.attributes.device_class);
      });
    });
  }

  if (entityFilter) {
    inputDevices = inputDevices.filter((device) => {
      const devEntities = deviceEntityLookup[device.id];
      if (!devEntities || !devEntities.length) {
        return false;
      }
      return devEntities.some((entity) => {
        const stateObj = hassEntities[entity.entity_id];
        if (!stateObj) {
          return false;
        }
        return entityFilter(stateObj);
      });
    });
  }

  if (deviceFilter) {
    inputDevices = inputDevices.filter(
      (device) =>
        // We always want to include the device of the current value
        device.id === value || deviceFilter!(device),
    );
  }

  const outputDevices = inputDevices.map<DeviceListItem>((device) => {
    const deviceName = computeDeviceNameDisplay(device, hassEntities, deviceEntityLookup[device.id]);

    const { area } = getDeviceContext(device, areas, floors);

    const areaName = area ? computeAreaName(area) : undefined;

    const configEntry = device.primary_config_entry ? configEntryLookup?.[device.primary_config_entry] : undefined;

    const domain = configEntry?.domain;
    const domainName = domain
      ? localize(`${domain}.title` as LocaleKeys, {
          fallback: domain,
        })
      : undefined;

    return {
      id: `${idPrefix}${device.id}`,
      label: "",
      primary: deviceName || localize("unnamed_device"),
      secondary: areaName,
      domain: configEntry?.domain,
      domain_name: domainName,
      search_labels: [deviceName, areaName, domain, domainName].filter(Boolean) as string[],
      sorting_label: deviceName || "zzz",
    };
  });

  return outputDevices;
};
