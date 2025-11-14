import { AreaRegistryEntry, EntityRegistryDisplayEntry, useHass, useStore } from "@core";
import { useMemo } from "react";
import type { DeviceRegistryEntry } from "@utils/subscribe/devices";
import type { HassEntity } from "home-assistant-js-websocket";
import type { FloorRegistryEntry } from "@utils/subscribe/floors";

/**
 * Enriched area shape returned by `useAreas`.
 * Extends the raw registry entry with resolved picture URL, linked floor,
 * concrete lists of devices & entities.
 */
export interface Area extends AreaRegistryEntry {
  /** Resolved (absolute) picture URL or null */
  picture: string | null;
  /** Devices (non-service type) whose area_id matches this area */
  devices: DeviceRegistryEntry[];
  /** Entities (state objects) whose area_id matches this area */
  entities: HassEntity[];
  /** Associated floor (null if none assigned) */
  floor: FloorRegistryEntry | null;
}

export function useAreas(): Area[] {
  const { joinHassUrl } = useHass();
  // const _entities = useStore((state) => state.entities);
  const areas = useStore((state) => state.areas);
  const devices = useStore((state) => state.devices);
  const floors = useStore((state) => state.floors);
  const entitiesRegistryDisplay = useStore((state) => state.entitiesRegistryDisplay);
  const entities = useStore((state) => state.entities);

  return useMemo(() => {
    const _areas = Object.values(areas);
    return processAreas({
      areas: _areas,
      devices,
      entitiesRegistryDisplay,
      floors,
      joinHassUrl,
      hassEntities: entities,
    });
  }, [areas, devices, joinHassUrl, entitiesRegistryDisplay, floors, entities]);
}
interface ProcessAreasParams {
  areas: AreaRegistryEntry[];
  devices: Record<string, DeviceRegistryEntry>;
  entitiesRegistryDisplay: Record<string, EntityRegistryDisplayEntry>;
  floors: Record<string, FloorRegistryEntry>;
  joinHassUrl: (path: string) => string;
  hassEntities: Record<string, HassEntity>;
}

function processAreas({ areas, devices, entitiesRegistryDisplay, floors, joinHassUrl, hassEntities }: ProcessAreasParams): Area[] {
  const processArea = (area: AreaRegistryEntry): Area => {
    const devicesInArea: DeviceRegistryEntry[] = [];
    for (const device of Object.values(devices)) {
      if (device.area_id === area.area_id) {
        if (device.entry_type !== "service") {
          devicesInArea.push(device);
        }
      }
    }

    // Collect entities that belong to this area either directly (entity.area_id) or
    // indirectly via the device assignment (entity.area_id unset but device.area_id matches).
    const entitiesInAreaSet = new Set<string>();
    const entitiesInArea: HassEntity[] = [];
    for (const entity of Object.values(entitiesRegistryDisplay)) {
      const directMatch = entity.area_id === area.area_id;
      const inheritedMatch = !entity.area_id && entity.device_id && devices[entity.device_id]?.area_id === area.area_id;
      if (directMatch || inheritedMatch) {
        const hassEntity = hassEntities[entity.entity_id];
        if (hassEntity && !entitiesInAreaSet.has(entity.entity_id)) {
          entitiesInAreaSet.add(entity.entity_id);
          entitiesInArea.push(hassEntity);
        } else if (!hassEntity) {
          // Registry entry exists but we have no current state object; skip silently.
          // (Could log if needed: console.debug(`Missing state for ${entity.entity_id}`))
        }
      }
    }

    return {
      ...area,
      picture: area.picture ? joinHassUrl(area.picture) : null,
      devices: devicesInArea,
      entities: entitiesInArea,
      floor: area.floor_id ? floors[area.floor_id] || null : null,
    };
  };

  return areas.map(processArea);
}
