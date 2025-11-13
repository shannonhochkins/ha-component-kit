import {
  isUnavailableState,
  UNAVAILABLE,
  OFF,
  computeDomain,
  EntityName,
  DeviceRegistryEntry,
  AreaRegistryEntry,
  FloorRegistryEntry,
  localize,
  stripPrefixFromEntityName,
  fallbackDeviceName,
} from "../";
import { HassEntities, HassEntity } from "home-assistant-js-websocket";
import { EntityRegistryDisplayEntry, EntityRegistryEntry, ExtEntityRegistryEntry } from "./entity_registry";

export type EntityNameItem =
  | {
      type: "entity" | "device" | "area" | "floor";
    }
  | {
      type: "text";
      text: string;
    };

export const DEFAULT_ENTITY_NAME = [{ type: "device" }, { type: "entity" }] satisfies EntityNameItem[];

const DEFAULT_SEPARATOR = " ";

export interface EntityContext {
  entity: EntityRegistryDisplayEntry | null;
  device: DeviceRegistryEntry | null;
  area: AreaRegistryEntry | null;
  floor: FloorRegistryEntry | null;
}

export interface EntityNameOptions {
  separator?: string;
}

// we just hardcode the light domain here so types work
/**
 * Determine whether a given entity state should be considered "active" for UI color/state purposes.
 *
 * Domain specific rules override a generic interpretation of activity. For many domains "off" or
 * an unavailable state implies inactive; however certain domains (e.g. alert, group, plant) have
 * custom semantics. This largely mirrors Home Assistant frontend logic for dynamic badge coloring.
 *
 * @param entity The Home Assistant entity state object.
 * @returns true if the entity is deemed active; false otherwise.
 */
export function stateActive(entity: HassEntity): boolean {
  const domain = computeDomain(entity.entity_id as EntityName);
  const compareState = entity.state;

  if (["button", "event", "input_button", "scene"].includes(domain)) {
    return compareState !== UNAVAILABLE;
  }

  if (isUnavailableState(compareState)) {
    return false;
  }

  // The "off" check is relevant for most domains, but there are exceptions
  // such as "alert" where "off" is still a somewhat active state and
  // therefore gets a custom color and "idle" is instead the state that
  // matches what most other domains consider inactive.
  if (compareState === OFF && domain !== "alert") {
    return false;
  }

  // Custom cases
  switch (domain) {
    case "alarm_control_panel":
      return compareState !== "disarmed";
    case "alert":
      // "on" and "off" are active, as "off" just means alert was acknowledged but is still active
      return compareState !== "idle";
    case "cover":
      return compareState !== "closed";
    case "device_tracker":
    case "person":
      return compareState !== "not_home";
    case "lawn_mower":
      return ["mowing", "error"].includes(compareState);
    case "lock":
      return compareState !== "locked";
    case "media_player":
      return compareState !== "standby";
    case "vacuum":
      return !["idle", "docked", "paused"].includes(compareState);
    case "plant":
      return compareState === "problem";
    case "group":
      return ["on", "home", "open", "locked", "problem"].includes(compareState);
    case "timer":
      return compareState === "active";
    case "camera":
      return compareState === "streaming";
  }

  return true;
}

/** Compute the object ID of a state. */
/**
 * Compute the object id portion of an entity id (text after the domain prefix).
 *
 * Example: `light.kitchen_ceiling` -> `kitchen_ceiling`.
 *
 * @param entityId Full entity id including domain.
 * @returns Object id portion (substring after first dot).
 */
export const computeObjectId = (entityId: string): string => entityId.substr(entityId.indexOf(".") + 1);

/**
 * Derive a human readable state name from entity attributes.
 * Falls back to object id with underscores replaced if no friendly_name is present or undefined.
 *
 * @param entityId Full entity id.
 * @param attributes Entity attributes bag.
 * @returns Friendly name or formatted object id; empty string if friendly_name explicitly blank.
 */
export const computeStateNameFromEntityAttributes = (entityId: string, attributes: HassEntity["attributes"]): string =>
  attributes?.friendly_name === undefined ? computeObjectId(entityId).replace(/_/g, " ") : attributes.friendly_name || "";

/**
 * Convenience wrapper to compute display name directly from a HassEntity state object.
 *
 * @param stateObj HassEntity state object.
 * @returns Human readable name.
 */
export const computeStateName = (stateObj: HassEntity): string =>
  computeStateNameFromEntityAttributes(stateObj.entity_id, stateObj.attributes);

/**
 * Resolve contextual registry objects (entity, device, area, floor) for a given live state object.
 * Safely handles missing registry entries by returning nulls.
 *
 * @param stateObj Live HassEntity state object.
 * @param entities Display registry entries keyed by entity_id.
 * @param devices Device registry entries keyed by device_id.
 * @param areas Area registry entries keyed by area_id.
 * @param floors Floor registry entries keyed by floor_id.
 * @returns An EntityContext containing resolved registry references or null placeholders.
 */
export const getEntityContext = (
  stateObj: HassEntity,
  entities: Record<string, EntityRegistryDisplayEntry>,
  devices: Record<string, DeviceRegistryEntry>,
  areas: Record<string, AreaRegistryEntry>,
  floors: Record<string, FloorRegistryEntry>,
): EntityContext => {
  const entry = entities[stateObj.entity_id] as EntityRegistryDisplayEntry | undefined;

  if (!entry) {
    return {
      entity: null,
      device: null,
      area: null,
      floor: null,
    };
  }
  return getEntityEntryContext(entry, entities, devices, areas, floors);
};

/**
 * Resolve contextual registry objects given a registry entry (entity/device/area/floor relationships).
 *
 * It prefers the entity's explicit area assignment falling back to its device's area, then derives floor
 * from the area if present.
 *
 * @param entry Any supported registry entry shape (display/regular/extended).
 * @param entities Display registry lookup keyed by entity_id.
 * @param devices Device registry lookup keyed by device_id.
 * @param areas Area registry lookup keyed by area_id.
 * @param floors Floor registry lookup keyed by floor_id.
 * @returns EntityContext object.
 */
export const getEntityEntryContext = (
  entry: EntityRegistryDisplayEntry | EntityRegistryEntry | ExtEntityRegistryEntry,
  entities: Record<string, EntityRegistryDisplayEntry>,
  devices: Record<string, DeviceRegistryEntry>,
  areas: Record<string, AreaRegistryEntry>,
  floors: Record<string, FloorRegistryEntry>,
): EntityContext => {
  const entity = entities[entry.entity_id];
  const deviceId = entry?.device_id;
  const device = deviceId ? devices[deviceId] : undefined;
  const areaId = entry?.area_id || device?.area_id;
  const area = areaId ? areas[areaId] : undefined;
  const floorId = area?.floor_id;
  const floor = floorId ? floors[floorId] : undefined;

  return {
    entity: entity,
    device: device || null,
    area: area || null,
    floor: floor || null,
  };
};

/**
 * Compute a device name for presentation, falling back to synthesized name when absent.
 * Uses `computeDeviceName`, then optional fallback naming heuristics (`fallbackDeviceName`), then a localized
 * "unnamed_device" token.
 *
 * @param device Device registry entry.
 * @param hassEntities Full HA entity state map for fallback heuristics.
 * @param entities Optional collection used when computing a fallback name.
 * @returns Display/device name string.
 */
export const computeDeviceNameDisplay = (
  device: DeviceRegistryEntry,
  hassEntities: HassEntities,
  entities?: EntityRegistryEntry[] | EntityRegistryDisplayEntry[] | string[],
) => computeDeviceName(device) || (entities && fallbackDeviceName(hassEntities, entities)) || localize("unnamed_device");

/**
 * Extract the explicit or user overridden device name (trimmed).
 *
 * @param device Device registry entry.
 * @returns Name string or undefined if not set.
 */
export const computeDeviceName = (device: DeviceRegistryEntry): string | undefined => (device.name_by_user || device.name)?.trim();

/**
 * Compute the uncluttered entity name relative to its device.
 * Falls back to friendly state name if not found in entity registry.
 *
 * @param stateObj Live entity state.
 * @param entities Registry display entries.
 * @param devices Device registry entries.
 * @returns Derived entity name or undefined.
 */
export const computeEntityName = (
  stateObj: HassEntity,
  entities: Record<string, EntityRegistryDisplayEntry>,
  devices: Record<string, DeviceRegistryEntry>,
): string | undefined => {
  const entry = entities[stateObj.entity_id] as EntityRegistryDisplayEntry | undefined;

  if (!entry) {
    // Fall back to state name if not in the entity registry (friendly name)
    return computeStateName(stateObj);
  }
  return computeEntityEntryName(entry, devices);
};

/**
 * Compute the entity's relative name based on registry entry and device. Removes redundant device prefix,
 * supports fallback to state name when provided.
 *
 * @param entry Registry entry shape.
 * @param devices Device registry lookup.
 * @param fallbackStateObj Optional state object to derive name when registry name absent.
 * @returns Relative entity name or undefined if redundant with device name.
 */
export const computeEntityEntryName = (
  entry: EntityRegistryDisplayEntry | EntityRegistryEntry,
  devices: Record<string, DeviceRegistryEntry>,
  fallbackStateObj?: HassEntity,
): string | undefined => {
  const name = entry.name || ("original_name" in entry && entry.original_name != null ? String(entry.original_name) : undefined);

  const device = entry.device_id ? devices[entry.device_id] : undefined;

  if (!device) {
    if (name) {
      return name;
    }
    if (fallbackStateObj) {
      return computeStateName(fallbackStateObj);
    }
    return undefined;
  }

  const deviceName = computeDeviceName(device);

  // If the device name is the same as the entity name, consider empty entity name
  if (deviceName === name) {
    return undefined;
  }

  // Remove the device name from the entity name if it starts with it
  if (deviceName && name) {
    return stripPrefixFromEntityName(name, deviceName) || name;
  }

  return name;
};

/**
 * Retrieve a trimmed floor name.
 * @param floor Floor registry entry.
 * @returns Trimmed name string.
 */
export const computeFloorName = (floor: FloorRegistryEntry): string => floor.name?.trim();

/**
 * Retrieve a trimmed area name.
 * @param area Area registry entry.
 * @returns Trimmed name or undefined.
 */
export const computeAreaName = (area: AreaRegistryEntry): string | undefined => area.name?.trim();

/**
 * Build an ordered list of entity related names based on a descriptor array.
 * Supports types: entity, device, area, floor, and static text.
 *
 * @param stateObj Live entity state.
 * @param name Descriptor array (or items) defining which names to include.
 * @param entities Registry entries lookup.
 * @param devices Device registry lookup.
 * @param areas Area registry lookup.
 * @param floors Floor registry lookup.
 * @returns Array of names (string or undefined) preserving descriptor order.
 */
export const computeEntityNameList = (
  stateObj: HassEntity,
  name: EntityNameItem[],
  entities: Record<string, EntityRegistryDisplayEntry>,
  devices: Record<string, DeviceRegistryEntry>,
  areas: Record<string, AreaRegistryEntry>,
  floors: Record<string, FloorRegistryEntry>,
): (string | undefined)[] => {
  const { device, area, floor } = getEntityContext(stateObj, entities, devices, areas, floors);

  const names = name.map((item) => {
    switch (item.type) {
      case "entity":
        return computeEntityName(stateObj, entities, devices);
      case "device":
        return device ? computeDeviceName(device) : undefined;
      case "area":
        return area ? computeAreaName(area) : undefined;
      case "floor":
        return floor ? computeFloorName(floor) : undefined;
      case "text":
        return item.text;
      default:
        return "";
    }
  });

  return names;
};

/**
 * Determine if the entity name is effectively the device name (redundant) and thus should use the device name
 * directly in displays.
 *
 * @param stateObj Live entity state.
 * @param entities Registry display entries.
 * @param devices Device registry entries.
 * @returns true if entity name should be replaced by device name; false otherwise.
 */
export const entityUseDeviceName = (
  stateObj: HassEntity,
  entities: Record<string, EntityRegistryDisplayEntry>,
  devices: Record<string, DeviceRegistryEntry>,
): boolean => !computeEntityName(stateObj, entities, devices);

/**
 * Produce a final display name string for an entity combining multiple name parts.
 * Applies replacement of entity descriptor with device descriptor when entity name is redundant; supports
 * separators and pure text-only sequences.
 *
 * @param stateObj Live entity state.
 * @param name Single or array of name descriptors (defaults to device + entity).
 * @param entities Registry display entries.
 * @param devices Device registry entries.
 * @param areas Area registry entries.
 * @param floors Floor registry entries.
 * @param options Optional separator override.
 * @returns Concatenated display name string.
 */
export const computeEntityNameDisplay = (
  stateObj: HassEntity,
  name: EntityNameItem | EntityNameItem[] | undefined,
  entities: Record<string, EntityRegistryDisplayEntry>,
  devices: Record<string, DeviceRegistryEntry>,
  areas: Record<string, AreaRegistryEntry>,
  floors: Record<string, FloorRegistryEntry>,
  options?: EntityNameOptions,
) => {
  let items = Array.isArray(name) ? name : name ? [name] : DEFAULT_ENTITY_NAME;

  const separator = options?.separator ?? DEFAULT_SEPARATOR;

  // If all items are text, just join them
  if (items.every((n) => n.type === "text")) {
    return items.map((item) => item.text).join(separator);
  }

  const useDeviceName = entityUseDeviceName(stateObj, entities, devices);

  // If entity uses device name, and device is not already included, replace it with device name
  if (useDeviceName) {
    const hasDevice = items.some((n) => n.type === "device");
    if (!hasDevice) {
      items = items.map((n) => (n.type === "entity" ? { type: "device" } : n));
    }
  }

  const names = computeEntityNameList(stateObj, items, entities, devices, areas, floors);

  // If after processing there is only one name, return that
  if (names.length === 1) {
    return names[0] || "";
  }

  return names.filter((n) => n).join(separator);
};
