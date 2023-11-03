import { Connection, createCollection } from "home-assistant-js-websocket";
import { Store } from "home-assistant-js-websocket/dist/store.js";
import { debounce } from "lodash";

export interface DeviceRegistryEntry {
  id: string;
  config_entries: string[];
  connections: Array<[string, string]>;
  identifiers: Array<[string, string]>;
  manufacturer: string | null;
  model: string | null;
  name: string | null;
  sw_version: string | null;
  hw_version: string | null;
  via_device_id: string | null;
  area_id: string | null;
  name_by_user: string | null;
  entry_type: "service" | null;
  disabled_by: "user" | "integration" | "config_entry" | null;
  configuration_url: string | null;
}

const fetchDeviceRegistry = (conn: Connection) =>
  conn.sendMessagePromise<DeviceRegistryEntry[]>({
    type: "config/device_registry/list",
  });

const subscribeDeviceRegistryUpdates = (conn: Connection, store: Store<DeviceRegistryEntry[]>) =>
  conn.subscribeEvents(
    debounce(() => fetchDeviceRegistry(conn).then((devices) => store.setState(devices, true)), 500, {
      leading: true,
    }),
    "device_registry_updated",
  );

export const subscribeDeviceRegistry = (conn: Connection, onChange: (devices: DeviceRegistryEntry[]) => void) =>
  createCollection<DeviceRegistryEntry[]>("_dr", fetchDeviceRegistry, subscribeDeviceRegistryUpdates, conn, onChange);
