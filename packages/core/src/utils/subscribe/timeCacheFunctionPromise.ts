import { Connection, HassEntities } from "home-assistant-js-websocket";

interface CacheResult<T> {
  result: T;
  cacheKey: unknown;
}

const CACHE_OBJECT: Record<string, CacheResult<unknown> | Promise<CacheResult<unknown>> | undefined> = {};

function getCacheObject<T>(cacheKey: string): CacheResult<T> | undefined {
  return CACHE_OBJECT[cacheKey] as CacheResult<T> | undefined;
}

function setCacheObject<T>(cacheKey: string, value: CacheResult<T> | undefined | Promise<CacheResult<T>>): void {
  CACHE_OBJECT[cacheKey] = value;
}

/**
 * Caches a result of a promise for X time. Allows optional extra validation
 * check to invalidate the cache.
 * @param cacheKey the key to store the cache
 * @param cacheTime the time to cache the result
 * @param func the function to fetch the data
 * @param generateCacheKey optional function to generate a cache key based on current hass + cached result. Cache is invalid if generates a different cache key.
 * @param hass Home Assistant object
 * @param args extra arguments to pass to the function to fetch the data
 * @returns
 */
export const timeCachePromiseFunc = async <T>(
  cacheKey: string,
  cacheTime: number,
  func: (connection: Connection) => Promise<T>,
  generateCacheKey: ((hassEntities: HassEntities, lastResult: T) => unknown) | undefined,
  connection: Connection,
  hassEntities: HassEntities,
): Promise<T> => {
  const lastResult: Promise<CacheResult<T>> | CacheResult<T> | undefined = getCacheObject(cacheKey);

  const checkCachedResult = (result: CacheResult<T>): T | Promise<T> => {
    if (!generateCacheKey || generateCacheKey(hassEntities, result.result) === result.cacheKey) {
      return result.result;
    }

    CACHE_OBJECT[cacheKey] = undefined;
    return timeCachePromiseFunc(cacheKey, cacheTime, func, generateCacheKey, connection, hassEntities);
  };

  // If we have a cached result, return it if it's still valid
  if (lastResult) {
    return lastResult instanceof Promise ? lastResult.then(checkCachedResult) : checkCachedResult(lastResult);
  }

  const resultPromise = func(connection);
  setCacheObject<T>(cacheKey, resultPromise as Promise<CacheResult<T>>);

  resultPromise.then(
    // When successful, set timer to clear cache
    (result) => {
      setCacheObject(cacheKey, {
        result,
        cacheKey: generateCacheKey?.(hassEntities, result),
      });
      setTimeout(() => {
        setCacheObject(cacheKey, undefined);
      }, cacheTime);
    },
    // On failure, clear cache right away
    () => {
      setCacheObject(cacheKey, undefined);
    },
  );

  return resultPromise;
};
