import { useSyncExternalStore, useCallback, useEffect, useMemo } from 'react';

type Value = string | null | undefined;

const getLocalStorageItem = (key: string) => {
  return window.localStorage.getItem(key);
};

const setLocalStorageItem = (key: string, value: unknown) => {
  const stringifiedValue = JSON.stringify(value);
  window.localStorage.setItem(key, stringifiedValue);
  dispatchStorageEvent(key, stringifiedValue);
};

const removeLocalStorageItem = (key: string) => {
  window.localStorage.removeItem(key);
  dispatchStorageEvent(key, null);
};

export function dispatchStorageEvent(key: string, newValue: Value) {
  window.dispatchEvent(new StorageEvent('storage', { key, newValue }));
}

const useLocalStorageSubscribe = (callback: (this: Window, ev: StorageEvent) => void) => {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
};

const getLocalStorageServerSnapshot = () => {
  throw Error('useLocalStorage is a client-only hook');
};

export function useLocalStorage<T>(key: string, initialValue?: T): [T, (v: T) => void] {
  const getSnapshot = () => getLocalStorageItem(key);

  const store = useSyncExternalStore(useLocalStorageSubscribe, getSnapshot, getLocalStorageServerSnapshot);

  const setState = useCallback(
    (v: T) => {
      try {
        const nextState = v;

        if (nextState === undefined || nextState === null) {
          removeLocalStorageItem(key);
        } else {
          setLocalStorageItem(key, nextState);
        }
      } catch (e) {
        console.warn(e);
      }
    },
    [key]
  );

  useEffect(() => {
    if (getLocalStorageItem(key) === null && typeof initialValue !== 'undefined') {
      setLocalStorageItem(key, initialValue);
    }
  }, [key, initialValue]);
  const value: T = store !== null ? (JSON.parse(store) as T) : (initialValue as T);

  return useMemo(() => [value, setState], [value, setState]);
}
