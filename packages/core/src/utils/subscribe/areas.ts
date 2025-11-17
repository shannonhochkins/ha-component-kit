import { EntityRegistryEntry, RegistryEntry } from "@utils/entity_registry";
import { Connection, createCollection } from "home-assistant-js-websocket";
import { Store } from "home-assistant-js-websocket/dist/store.js";
import { debounce } from "lodash";
import { DeviceRegistryEntry } from "./devices";
import { stringCompare } from "@utils/string";

export interface AreaRegistryEntry extends RegistryEntry {
  /** the name of the area */
  name: string;
  /** the picture of the area */
  picture: string | null;
  /** alias names */
  aliases: string[];
  /** the id of the area */
  area_id: string;
  /** the id of the floor the area is on */
  floor_id: string | null;
  /** the id of the humidity sensor for the area */
  humidity_entity_id: string | null;
  /** the icon to use for the area */
  icon: string | null;
  /** labels for the area */
  labels: string[];
  /** the id of the temperature sensor for the area */
  temperature_entity_id: string | null;
}

/**
 * Fetch the full list of area registry entries from Home Assistant.
 * Issues the `config/area_registry/list` websocket command via `sendMessagePromise`.
 *
 * @param conn Active HA websocket connection.
 * @returns Promise resolving to an array of AreaRegistryEntry objects.
 */
const fetchAreaRegistry = (conn: Connection) =>
  conn.sendMessagePromise<AreaRegistryEntry[]>({
    type: "config/area_registry/list",
  });
/**
 * Subscribe to area registry updates and keep a local collection store in sync.
 *
 * Home Assistant emits the `area_registry_updated` event when areas are created, updated or deleted.
 * We debounce subsequent refetches (leading & trailing) to avoid flooding the websocket when many changes happen.
 *
 * @param conn Active HA websocket connection.
 * @param store Reactive collection store maintained by `createCollection`.
 * @returns Unsubscribe function for the events subscription.
 */
const subscribeAreaRegistryUpdates = (conn: Connection, store: Store<AreaRegistryEntry[]>) =>
  conn.subscribeEvents(
    debounce(() => fetchAreaRegistry(conn).then((areas: AreaRegistryEntry[]) => store.setState(areas, true)), 500, {
      leading: true,
      trailing: true,
    }),
    "area_registry_updated",
  );

/**
 * Create a managed collection for the area registry.
 * Automatically fetches initial data and subscribes to updates, invoking `onChange` whenever data changes.
 *
 * @param conn Active HA websocket connection.
 * @param onChange Callback invoked with the latest list of areas when data refreshes.
 * @returns Unsubscribe function for the underlying collection.
 */
export const subscribeAreaRegistry = (conn: Connection, onChange: (areas: AreaRegistryEntry[]) => void) =>
  createCollection<AreaRegistryEntry[]>("_areaRegistry", fetchAreaRegistry, subscribeAreaRegistryUpdates, conn, onChange);

export type AreaEntityLookup = Record<string, EntityRegistryEntry[]>;

export type AreaDeviceLookup = Record<string, DeviceRegistryEntry[]>;

export interface AreaRegistryEntryMutableParams {
  aliases?: string[];
  floor_id?: string | null;
  humidity_entity_id?: string | null;
  icon?: string | null;
  labels?: string[];
  name: string;
  picture?: string | null;
  temperature_entity_id?: string | null;
}

/**
 * Create a new area registry entry.
 *
 * Issues `config/area_registry/create` with provided mutable parameters (name required).
 *
 * @param connection HA websocket connection.
 * @param values Area creation parameters (name mandatory, others optional).
 * @returns Promise resolving to the newly created AreaRegistryEntry.
 */
export const createAreaRegistryEntry = (connection: Connection, values: AreaRegistryEntryMutableParams) =>
  connection.sendMessagePromise<AreaRegistryEntry>({
    type: "config/area_registry/create",
    ...values,
  });

/**
 * Update an existing area registry entry.
 *
 * Issues `config/area_registry/update` with partial update fields.
 *
 * @param connection HA websocket connection.
 * @param areaId Target area's `area_id`.
 * @param updates Partial area fields to change.
 * @returns Promise resolving to the updated AreaRegistryEntry.
 */
export const updateAreaRegistryEntry = (connection: Connection, areaId: string, updates: Partial<AreaRegistryEntryMutableParams>) =>
  connection.sendMessagePromise<AreaRegistryEntry>({
    type: "config/area_registry/update",
    area_id: areaId,
    ...updates,
  });

/**
 * Delete an area from the registry.
 *
 * Issues `config/area_registry/delete`.
 *
 * @param connection HA websocket connection.
 * @param areaId The `area_id` of the area to remove.
 * @returns Promise resolving when the deletion is acknowledged.
 */
export const deleteAreaRegistryEntry = (connection: Connection, areaId: string) =>
  connection.sendMessagePromise({
    type: "config/area_registry/delete",
    area_id: areaId,
  });

/**
 * Build a lookup mapping area_id -> list of entity registry entries directly assigned to that area.
 * Ignores entities without an explicit `area_id` (those may inherit via devices elsewhere).
 *
 * @param entities Full list of entity registry entries.
 * @returns Record area_id -> array of entity entries.
 */
export const getAreaEntityLookup = (entities: EntityRegistryEntry[]): AreaEntityLookup => {
  const areaEntityLookup: AreaEntityLookup = {};
  for (const entity of entities) {
    if (!entity.area_id) {
      continue;
    }
    if (!(entity.area_id in areaEntityLookup)) {
      areaEntityLookup[entity.area_id] = [];
    }
    areaEntityLookup[entity.area_id].push(entity);
  }
  return areaEntityLookup;
};

/**
 * Build a lookup mapping area_id -> list of device registry entries assigned to that area.
 * Devices without an `area_id` are skipped.
 *
 * @param devices Array of device registry entries.
 * @returns Record area_id -> array of device entries.
 */
export const getAreaDeviceLookup = (devices: DeviceRegistryEntry[]): AreaDeviceLookup => {
  const areaDeviceLookup: AreaDeviceLookup = {};
  for (const device of devices) {
    if (!device.area_id) {
      continue;
    }
    if (!(device.area_id in areaDeviceLookup)) {
      areaDeviceLookup[device.area_id] = [];
    }
    areaDeviceLookup[device.area_id].push(device);
  }
  return areaDeviceLookup;
};

/**
 * Produce a comparator function for sorting area ids.
 *
 * If an explicit `order` array is supplied, areas found in that array are sorted by their index
 * and areas not present are pushed after those that are. When both are absent from the order list
 * a locale-aware name comparison (via `stringCompare`) is used.
 *
 * @param entries Lookup of area_id -> AreaRegistryEntry used to resolve names.
 * @param order Optional explicit ordering of area_ids.
 * @returns Comparator function suitable for Array.sort.
 */
export const areaCompare = (entries: Record<string, AreaRegistryEntry>, order?: string[]) => (a: string, b: string) => {
  const indexA = order ? order.indexOf(a) : -1;
  const indexB = order ? order.indexOf(b) : -1;
  if (indexA === -1 && indexB === -1) {
    const nameA = entries?.[a]?.name ?? a;
    const nameB = entries?.[b]?.name ?? b;
    return stringCompare(nameA, nameB);
  }
  if (indexA === -1) {
    return 1;
  }
  if (indexB === -1) {
    return -1;
  }
  return indexA - indexB;
};
