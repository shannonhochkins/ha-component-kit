import { Connection, createCollection } from "home-assistant-js-websocket";
import { Store } from "home-assistant-js-websocket/dist/store.js";
import { debounce } from "lodash";

export interface AreaRegistryEntry {
  /** the id of the area */
  area_id: string;
  /** the name of the area */
  name: string;
  /** the picture of the area */
  picture: string | null;
  /** alias names */
  aliases: string[];
}

const fetchAreaRegistry = (conn: Connection) =>
  conn.sendMessagePromise<AreaRegistryEntry[]>({
    type: "config/area_registry/list",
  });
const subscribeAreaRegistryUpdates = (conn: Connection, store: Store<AreaRegistryEntry[]>) =>
  conn.subscribeEvents(
    debounce(() => fetchAreaRegistry(conn).then((areas: AreaRegistryEntry[]) => store.setState(areas, true)), 500, {
      leading: true,
    }),
    "area_registry_updated",
  );

export const subscribeAreaRegistry = (conn: Connection, onChange: (areas: AreaRegistryEntry[]) => void) =>
  createCollection<AreaRegistryEntry[]>("_areaRegistry", fetchAreaRegistry, subscribeAreaRegistryUpdates, conn, onChange);
