import { useHass, useStore } from "@core";
import { useEffect, useState, useMemo } from "react";
import { subscribeAreaRegistry } from "./subscribe/areas";
import { subscribeEntityRegistry } from "./subscribe/entities";
import { subscribeDeviceRegistry } from "./subscribe/devices";
import type { AreaRegistryEntry } from "./subscribe/areas";
import type { EntityRegistryEntry } from "./subscribe/entities";
import type { DeviceRegistryEntry } from "./subscribe/devices";
import type { HassEntity } from "home-assistant-js-websocket";

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
}

export function useAreas(): Area[] {
  const { joinHassUrl } = useHass();
  const [areas, setAreas] = useState<AreaRegistryEntry[]>([]);
  const [devices, setDevices] = useState<DeviceRegistryEntry[]>([]);
  const [entities, setEntities] = useState<EntityRegistryEntry[]>([]);
  const connection = useStore((state) => state.connection);
  const _entities = useStore((state) => state.entities);

  useEffect(() => {
    if (!connection) return;
    const areaUnsub = subscribeAreaRegistry(connection, (areas) => {
      setAreas(areas);
    });
    const entityUnsub = subscribeEntityRegistry(connection, (entities) => {
      setEntities(entities);
    });
    const deviceUnsub = subscribeDeviceRegistry(connection, (devices) => {
      setDevices(devices);
    });
    // Returning a cleanup function that will be called on component unmount
    return () => {
      areaUnsub();
      entityUnsub();
      deviceUnsub();
    };
  }, [connection]);

  return useMemo(() => {
    return areas.map((area) => {
      const matchedEntities: HassEntity[] = [];
      const matchedDevices: DeviceRegistryEntry[] = [];
      const matchedServices: DeviceRegistryEntry[] = [];

      for (const device of devices) {
        if (device.area_id === area.area_id) {
          if (device.entry_type === "service") {
            matchedServices.push(device);
          } else {
            matchedDevices.push(device);
          }
        }
      }
      // ! entities only have an area_id if they are manually assigned to an area and
      // ! not inherited from the parent device (or because they don't have a parent device)
      for (const entity of entities) {
        const _entity = _entities[entity.entity_id];
        if (!_entity) continue;

        const entityIsInArea = entity.area_id === area.area_id;
        if (entityIsInArea) {
          matchedEntities.push(_entity);
        }

        if (!entity.device_id) continue;
        const device = devices.find((d) => d.id === entity.device_id);
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
      };
    });
  }, [areas, devices, joinHassUrl, entities, _entities]);
}
