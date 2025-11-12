import { useHass, useStore } from "@core";
import { useMemo } from "react";
import type { DeviceRegistryEntry } from "@utils/subscribe/devices";
import type { HassEntity } from "home-assistant-js-websocket";
import type { FloorRegistryEntry } from "@utils/subscribe/floors";

export interface Area {
  /** the area id */
  area_id: string;
  /** the name of the area */
  name: string;
  /** the picture of the area */
  picture: string | null;
  /** the devices linked to the area */
  devices: DeviceRegistryEntry[];
  /** the services linked to the area */
  services: DeviceRegistryEntry[];
  /** the entities linked to the area */
  entities: HassEntity[];
  /** the floors linked to the area */
  floors: FloorRegistryEntry[];
}

export function useAreas(): Area[] {
  const { joinHassUrl } = useHass();
  const _entities = useStore((state) => state.entities);
  const areas = useStore((state) => state.areas);
  const devices = useStore((state) => state.devices);
  const floors = useStore((state) => state.floors);
  const entities = useStore((state) => state.entitiesRegistry);

  return useMemo(() => {
    return Object.values(areas).map((area) => {
      const matchedEntities: HassEntity[] = [];
      const matchedDevices: DeviceRegistryEntry[] = [];
      const matchedServices: DeviceRegistryEntry[] = [];
      const matchedFloors: FloorRegistryEntry[] = [];

      const deviceValues = Object.values(devices);

      for (const device of deviceValues) {
        if (device.area_id === area.area_id) {
          if (device.entry_type === "service") {
            matchedServices.push(device);
          } else {
            matchedDevices.push(device);
          }
        }
      }
      const floorMatch = Object.values(floors).find((f) => f.floor_id === area.floor_id);
      if (floorMatch && !matchedFloors.includes(floorMatch)) {
        matchedFloors.push(floorMatch);
      }
      // ! entities only have an area_id if they are manually assigned to an area and
      // ! not inherited from the parent device (or because they don't have a parent device)
      for (const entity of Object.values(entities)) {
        const _entity = _entities[entity.entity_id];
        if (!_entity) continue;

        const entityIsInArea = entity.area_id === area.area_id;
        if (entityIsInArea) {
          matchedEntities.push(_entity);
        }

        if (!entity.device_id) continue;
        const device = deviceValues.find((d) => d.id === entity.device_id);
        if (!device) continue;

        const deviceIsInArea = device.area_id === area.area_id;
        const entityInheritsArea = !entity.area_id;
        if (entityInheritsArea && deviceIsInArea) {
          matchedEntities.push(_entity);
        }
      }
      return {
        ...area,
        picture: area.picture ? joinHassUrl(area.picture) : area.picture,
        devices: matchedDevices,
        services: matchedServices,
        entities: matchedEntities,
        floors: matchedFloors,
      };
    });
  }, [areas, devices, joinHassUrl, entities, _entities, floors]);
}
