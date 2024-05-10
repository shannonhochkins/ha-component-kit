import { Connection, createCollection } from "home-assistant-js-websocket";
import { Store } from "home-assistant-js-websocket/dist/store.js";
import { debounce } from "lodash";

export interface EntityRegistryEntry {
  id: string;
  entity_id: string;
  name: string | null;
  icon: string | null;
  platform: string;
  config_entry_id: string | null;
  device_id: string | null;
  area_id: string | null;
  disabled_by: "user" | "device" | "integration" | "config_entry" | null;
  hidden_by: Exclude<EntityRegistryEntry["disabled_by"], "config_entry">;
  has_entity_name: boolean;
  original_name?: string;
  unique_id: string;
  translation_key?: string;
}

const fetchEntityRegistry = (conn: Connection) =>
  conn.sendMessagePromise<EntityRegistryEntry[]>({
    type: "config/entity_registry/list",
  });

const subscribeEntityRegistryUpdates = (conn: Connection, store: Store<EntityRegistryEntry[]>) =>
  conn.subscribeEvents(
    debounce(() => fetchEntityRegistry(conn).then((entities) => store.setState(entities, true)), 500, {
      leading: true,
    }),
    "entity_registry_updated",
  );

export const subscribeEntityRegistry = (conn: Connection, onChange: (entities: EntityRegistryEntry[]) => void) =>
  createCollection<EntityRegistryEntry[]>("_entityRegistry", fetchEntityRegistry, subscribeEntityRegistryUpdates, conn, onChange);
