import type {
  FloorRegistryEntry,
  AreaRegistryEntry,
  DeviceRegistryEntry,
  EntityRegistryEntry,
  EntityRegistryDisplayEntry,
} from "@hakit/core";
import type { HassServices, HassService } from "home-assistant-js-websocket";

export function DummyComponentReturn(props: {
  floors: Record<string, FloorRegistryEntry>;
  areas: Record<string, AreaRegistryEntry>;
  devices: DeviceRegistryEntry;
  services: HassServices;
  entitiesRegistry: EntityRegistryEntry;
  entitiesRegistryDisplay: EntityRegistryDisplayEntry;
}) {
  return props;
}

export function DummyComponentReturnFloors(props: Partial<FloorRegistryEntry>) {
  return props;
}

export function DummyComponentAreas(props: Partial<AreaRegistryEntry>) {
  return props;
}

export function DummyComponentDevices(props: Partial<DeviceRegistryEntry>) {
  return props;
}

export function DummyComponentServices(props: Partial<HassService>) {
  return props;
}

export function DummyComponentEntitiesRegistry(props: Partial<EntityRegistryEntry>) {
  return props;
}

export function DummyComponentEntitiesRegistryDisplay(props: Partial<EntityRegistryDisplayEntry>) {
  return props;
}
