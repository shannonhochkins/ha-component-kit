import { RegistryEntry } from "@utils/entity_registry";
import { Connection, createCollection } from "home-assistant-js-websocket";
import { Store } from "home-assistant-js-websocket/dist/store.js";
import { debounce } from "lodash";

export interface FloorRegistryEntry extends RegistryEntry {
  floor_id: string;
  name: string;
  level: number | null;
  icon: string | null;
  aliases: string[];
}

const fetchFloorRegistry = (conn: Connection) =>
  conn.sendMessagePromise<FloorRegistryEntry[]>({
    type: "config/floor_registry/list",
  });

const subscribeFloorRegistryUpdates = (conn: Connection, store: Store<FloorRegistryEntry[]>) =>
  conn.subscribeEvents(
    debounce(() => fetchFloorRegistry(conn).then((areas: FloorRegistryEntry[]) => store.setState(areas, true)), 500, {
      leading: true,
      trailing: true,
    }),
    "floor_registry_updated",
  );

export const subscribeFloorRegistry = (conn: Connection, onChange: (floors: FloorRegistryEntry[]) => void) =>
  createCollection<FloorRegistryEntry[]>("_floorRegistry", fetchFloorRegistry, subscribeFloorRegistryUpdates, conn, onChange);
