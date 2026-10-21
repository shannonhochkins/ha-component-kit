import type {
  FloorRegistryEntry,
  AreaRegistryEntry,
  DeviceRegistryEntry,
  EntityRegistryDisplayEntry,
  EntityRegistryEntry,
  HassStore,
  RegistryDataKey,
} from "@hakit/core";
import type { HassService } from "home-assistant-js-websocket";

export function DummyComponentReturn(props: Partial<Pick<HassStore, RegistryDataKey>>) {
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

export function DummyComponentEntitiesRegistryDisplay(props: Partial<EntityRegistryDisplayEntry>) {
  return props;
}

export function DummyComponentEntitiesRegistry(props: Partial<EntityRegistryEntry>) {
  return props;
}
