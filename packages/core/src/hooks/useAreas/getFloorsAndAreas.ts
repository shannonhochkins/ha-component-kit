import {
  computeDomain,
  computeAreaName,
  computeFloorName,
  type DeviceRegistryEntry,
  type AreaRegistryEntry,
  type FloorRegistryEntry,
  type EntityListInfoCommon,
  stringCompare,
  useStore,
  EntityName,
  type EntityRegistryDisplayEntry,
  useHass,
} from "@core";
import { type HassEntity } from "home-assistant-js-websocket";

export interface UseAreasReturn extends EntityListInfoCommon {
  type: "floor" | "area";
  floor?: FloorRegistryEntry;
  area?: AreaRegistryEntry;
}

type DeviceEntityDisplayLookup = Record<string, EntityRegistryDisplayEntry[]>;

const getDeviceEntityDisplayLookup = (entities: EntityRegistryDisplayEntry[]): DeviceEntityDisplayLookup => {
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

type FloorAreaLookup = Record<string, AreaRegistryEntry[]>;

const floorCompare = (entries?: Record<string, FloorRegistryEntry>, order?: string[]) => (a: string, b: string) => {
  const indexA = order ? order.indexOf(a) : -1;
  const indexB = order ? order.indexOf(b) : -1;
  if (indexA === -1 && indexB === -1) {
    const floorA = entries?.[a];
    const floorB = entries?.[b];
    if (floorA && floorB && floorA.level !== floorB.level) {
      return (floorB.level ?? -9999) - (floorA.level ?? -9999);
    }
    const nameA = floorA?.name ?? a;
    const nameB = floorB?.name ?? b;
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

export const getFloorAreaLookup = (areas: AreaRegistryEntry[]): FloorAreaLookup => {
  const floorAreaLookup: FloorAreaLookup = {};
  for (const area of areas) {
    if (!area.floor_id) {
      continue;
    }
    if (!(area.floor_id in floorAreaLookup)) {
      floorAreaLookup[area.floor_id] = [];
    }
    floorAreaLookup[area.floor_id].push(area);
  }
  return floorAreaLookup;
};

export const useAreas = (
  includeDomains?: string[],
  excludeDomains?: string[],
  includeDeviceClasses?: string[],
  deviceFilter?: (device: DeviceRegistryEntry) => boolean,
  entityFilter?: (entityId: HassEntity) => boolean,
  excludeAreas?: string[],
  excludeFloors?: string[],
): UseAreasReturn[] => {
  const { joinHassUrl } = useHass();
  const _entities = useStore((store) => store.entities);
  const _entitiesRegistryDisplay = useStore((store) => store.entitiesRegistryDisplay);
  const _devices = useStore((store) => store.devices);
  const _areas = useStore((store) => store.areas);
  const _floors = useStore((store) => store.floors);
  const floors = Object.values(_floors);
  const areas = Object.values(_areas);
  const devices = Object.values(_devices);
  const entities = Object.values(_entitiesRegistryDisplay);

  let deviceEntityLookup: DeviceEntityDisplayLookup = {};
  let inputDevices: DeviceRegistryEntry[] | undefined;
  let inputEntities: EntityRegistryDisplayEntry[] | undefined;

  if (includeDomains || excludeDomains || includeDeviceClasses || deviceFilter || entityFilter) {
    deviceEntityLookup = getDeviceEntityDisplayLookup(entities);
    inputDevices = devices;
    inputEntities = entities.filter((entity) => entity.area_id);

    if (includeDomains) {
      inputDevices = inputDevices!.filter((device) => {
        const devEntities = deviceEntityLookup[device.id];
        if (!devEntities || !devEntities.length) {
          return false;
        }
        return deviceEntityLookup[device.id].some((entity) => includeDomains.includes(computeDomain(entity.entity_id as EntityName)));
      });
      inputEntities = inputEntities!.filter((entity) => includeDomains.includes(computeDomain(entity.entity_id as EntityName)));
    }

    if (excludeDomains) {
      inputDevices = inputDevices!.filter((device) => {
        const devEntities = deviceEntityLookup[device.id];
        if (!devEntities || !devEntities.length) {
          return true;
        }
        return entities.every((entity) => !excludeDomains.includes(computeDomain(entity.entity_id as EntityName)));
      });
      inputEntities = inputEntities!.filter((entity) => !excludeDomains.includes(computeDomain(entity.entity_id as EntityName)));
    }

    if (includeDeviceClasses) {
      inputDevices = inputDevices!.filter((device) => {
        const devEntities = deviceEntityLookup[device.id];
        if (!devEntities || !devEntities.length) {
          return false;
        }
        return deviceEntityLookup[device.id].some((entity) => {
          const stateObj = _entities[entity.entity_id];
          if (!stateObj) {
            return false;
          }
          return stateObj.attributes.device_class && includeDeviceClasses.includes(stateObj.attributes.device_class);
        });
      });
      inputEntities = inputEntities!.filter((entity) => {
        const stateObj = _entities[entity.entity_id];
        return stateObj.attributes.device_class && includeDeviceClasses.includes(stateObj.attributes.device_class);
      });
    }

    if (deviceFilter) {
      inputDevices = inputDevices!.filter((device) => deviceFilter!(device));
    }

    if (entityFilter) {
      inputDevices = inputDevices!.filter((device) => {
        const devEntities = deviceEntityLookup[device.id];
        if (!devEntities || !devEntities.length) {
          return false;
        }
        return deviceEntityLookup[device.id].some((entity) => {
          const stateObj = _entities[entity.entity_id];
          if (!stateObj) {
            return false;
          }
          return entityFilter(stateObj);
        });
      });
      inputEntities = inputEntities!.filter((entity) => {
        const stateObj = _entities[entity.entity_id];
        if (!stateObj) {
          return false;
        }
        return entityFilter!(stateObj);
      });
    }
  }

  let outputAreas = areas.map((area) => ({
    ...area,
    picture: area.picture ? joinHassUrl(area.picture) : area.picture,
  }));

  let areaIds: string[] | undefined;

  if (inputDevices) {
    areaIds = inputDevices.filter((device) => device.area_id).map((device) => device.area_id!);
  }

  if (inputEntities) {
    areaIds = (areaIds ?? []).concat(inputEntities.filter((entity) => entity.area_id).map((entity) => entity.area_id!));
  }

  if (areaIds) {
    outputAreas = outputAreas.filter((area) => areaIds!.includes(area.area_id));
  }

  if (excludeAreas) {
    outputAreas = outputAreas.filter((area) => !excludeAreas!.includes(area.area_id));
  }

  if (excludeFloors) {
    outputAreas = outputAreas.filter((area) => !area.floor_id || !excludeFloors!.includes(area.floor_id));
  }

  const floorAreaLookup = getFloorAreaLookup(outputAreas);
  const unassignedAreas = Object.values(outputAreas).filter((area) => !area.floor_id || !floorAreaLookup[area.floor_id]);

  const compare = floorCompare(_floors);
  // @ts-expect-error - fix later
  const floorAreaEntries: [FloorRegistryEntry | undefined, AreaRegistryEntry[]][] = Object.entries(floorAreaLookup)
    .map(([floorId, floorAreas]) => {
      const floor = floors.find((fl) => fl.floor_id === floorId)!;
      return [floor, floorAreas] as const;
    })
    .sort(([floorA], [floorB]) => compare(floorA.floor_id, floorB.floor_id));

  const items: UseAreasReturn[] = [];

  floorAreaEntries.forEach(([floor, floorAreas]) => {
    if (floor) {
      const floorName = computeFloorName(floor);

      const areaSearchLabels = floorAreas
        .map((area) => {
          const areaName = computeAreaName(area) || area.area_id;
          return [area.area_id, areaName, ...area.aliases];
        })
        .flat();

      items.push({
        id: ["floor", floor.floor_id].join("______"),
        type: "floor",
        primary: floorName,
        floor: floor,
        icon: floor.icon || undefined,
        search_labels: [floor.floor_id, floorName, ...floor.aliases, ...areaSearchLabels],
      });
    }
    items.push(
      ...floorAreas.map((area) => {
        const areaName = computeAreaName(area) || area.area_id;
        return {
          id: ["area", area.area_id].join("______"),
          type: "area" as const,
          primary: areaName,
          area: area,
          icon: area.icon || undefined,
          search_labels: [area.area_id, areaName, ...area.aliases],
        };
      }),
    );
  });

  items.push(
    ...unassignedAreas.map((area) => {
      const areaName = computeAreaName(area) || area.area_id;
      return {
        id: ["area", area.area_id].join("______"),
        type: "area" as const,
        primary: areaName,
        area: area,
        icon: area.icon || undefined,
        search_labels: [area.area_id, areaName, ...area.aliases],
      };
    }),
  );

  return items;
};
