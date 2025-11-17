import { Connection, createCollection } from "home-assistant-js-websocket";
import { Store } from "home-assistant-js-websocket/dist/store.js";
import { debounce } from "lodash";
import { EntityRegistryEntry } from "@utils/entity_registry";

const fetchEntityRegistry = (conn: Connection) =>
  conn.sendMessagePromise<EntityRegistryEntry[]>({
    type: "config/entity_registry/list",
  });

const subscribeEntityRegistryUpdates = (conn: Connection, store: Store<EntityRegistryEntry[]>) =>
  conn.subscribeEvents(
    debounce(() => fetchEntityRegistry(conn).then((entities) => store.setState(entities, true)), 500, {
      leading: true,
      trailing: true,
    }),
    "entity_registry_updated",
  );

export const subscribeEntityRegistry = (conn: Connection, onChange: (entities: EntityRegistryEntry[]) => void) =>
  createCollection<EntityRegistryEntry[]>("_entityRegistry", fetchEntityRegistry, subscribeEntityRegistryUpdates, conn, onChange);
