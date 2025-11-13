import { Connection, HassEntities } from "home-assistant-js-websocket";
import { timeCachePromiseFunc } from "./timeCacheFunctionPromise";

/**
 * Minimal shape describing the source of an entity provided by Home Assistant.
 * Currently includes the integration domain (e.g. `"mqtt"`, `"zwave_js"`).
 */
interface EntitySource {
  /** Integration domain responsible for providing this entity. */
  domain: string;
}

/**
 * Map of entity_id -> source metadata.
 */
export type EntitySources = Record<string, EntitySource>;

/**
 * Fetch entity source metadata from Home Assistant.
 *
 * Issues the `entity/source` websocket command which returns a structure mapping
 * each entity_id to the providing integration domain. This is useful for grouping or
 * surfacing provenance (e.g. show icon/tag for MQTT vs Zigbee).
 *
 * NOTE: The response can grow with number of entities; callers should prefer the cached
 * wrapper below when invoked frequently in UI contexts.
 *
 * @param connection Active HA websocket connection.
 * @returns Promise resolving to the entity sources mapping.
 */
const fetchEntitySources = (connection: Connection): Promise<EntitySources> => connection.sendMessagePromise({ type: "entity/source" });

/**
 * Fetch entity source metadata with short-lived in-memory caching.
 *
 * Caching strategy:
 * - Keyed under the internal cache id `"_entitySources"`.
 * - TTL: 30 seconds; after this the data is considered stale and refetched.
 * - Invalidation heuristic: number of entity states (Object.keys(hass.states).length).
 *   If the count changes between fetches before TTL expiry we assume entity additions/removals and force refresh.
 *
 * This heuristic is intentionally coarse to avoid deep diffs of the state map: additions/removals/change in total count
 * usually correlate with potential integration changes, which might imply different source mapping.
 *
 * Edge Cases & Considerations:
 * - If an integration reload swaps domains without changing entity count, the cache will NOT invalidate early. Such
 *   scenarios are rare; manual cache busting can be added if required.
 * - For extremely large installations consider extending TTL to reduce websocket chatter further; domain provenance
 *   rarely changes often.
 * - If entity states oscillate (rapid add/remove) the cache may invalidate frequently; debouncing at a higher layer
 *   could mitigate performance concerns.
 *
 * @param hassEntities Current HassEntities map used solely for the size heuristic.
 * @param connection Active HA websocket connection.
 * @returns Promise resolving to the (possibly cached) entity sources mapping.
 */
export const fetchEntitySourcesWithCache = (hassEntities: HassEntities, connection: Connection): Promise<EntitySources> =>
  timeCachePromiseFunc(
    "_entitySources", // cache key
    30000, // 30s TTL
    fetchEntitySources, // underlying fetcher
    (hass2) => Object.keys(hass2.states).length, // invalidation heuristic based on entity count
    connection,
    hassEntities,
  );
