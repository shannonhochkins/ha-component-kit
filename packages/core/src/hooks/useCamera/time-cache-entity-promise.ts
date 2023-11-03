import { Connection } from "home-assistant-js-websocket";

interface ResultCache<T> {
  [entityId: string]: { timestamp: number; promise: Promise<T> } | undefined;
}

const cache: ResultCache<unknown> = {}; // Replace 'unknown' with your data type if known

/**
 * Call a function with result caching per entity.
 * @param cacheKey key to store the cache on hass object
 * @param cacheTime time to cache the results
 * @param func function to fetch the data
 * @param connection Home Assistant connection object
 * @param entityId entity to fetch data for
 * @param args extra arguments to pass to the function to fetch the data
 * @returns
 */
export const timeCacheEntityPromiseFunc = async <T>(
  cacheKey: string,
  cacheTime: number,
  func: (connection: Connection, entityId: string, ...args: unknown[]) => Promise<T>,
  connection: Connection,
  entityId: string,
  ...args: unknown[]
): Promise<T> => {
  const currentTime = Date.now();
  const _cacheKey = `${cacheKey}-${entityId}`;

  // Check if the result is in the cache and still valid
  const cacheEntry = cache[_cacheKey];
  if (cacheEntry && currentTime - cacheEntry.timestamp < cacheTime) {
    return cacheEntry.promise as Promise<T>;
  }

  // Otherwise, fetch the result and update the cache
  const resultPromise = func(connection, entityId, ...args);
  cache[_cacheKey] = { timestamp: currentTime, promise: resultPromise };

  return resultPromise;
};
