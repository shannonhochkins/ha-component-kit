import { useInternalStore, type InternalStore } from "../../HassConnect/HassContext";
import type { StoreApi, UseBoundStore } from "zustand";

export const DATA_KEYS = [
  "routes",
  "setRoutes",
  "entities",
  "hassUrl",
  "hash",
  "setHash",
  "locales",
  "portalRoot",
  "windowContext",
  "setWindowContext",
  "connectionStatus",
  "connection",
  "ready",
  "auth",
  "config",
  "user",
  "users",
  "globalComponentStyles",
  "setGlobalComponentStyles",
  "entitiesRegistryDisplay",
  "services",
  "areas",
  "devices",
  "floors",
  "services",
  "formatter",
  "helpers",
  "locale",
  "sensorNumericDeviceClasses",
] satisfies (keyof InternalStore)[];

type KeysToPick = (typeof DATA_KEYS)[number];

/* @deprecated Use `HassStore` instead */
export type Store = Pick<InternalStore, KeysToPick>;
/** The data structure of the public store */
export type HassStore = Pick<InternalStore, KeysToPick>;
/** The return value of the `useHass` hook */
export type UseHassHook = UseBoundStore<StoreApi<Store>>;
/** @deprecated Use `UseHassHook` instead */
export type UseStoreHook = UseBoundStore<StoreApi<Store>>;

// things we want to expose for the user
// this is a type only difference, it still contains everything but the goal here is to please typescript users.

/** @deprecated Use `useHass` instead */
export const useStore = useInternalStore as UseStoreHook;
export const useHass = useInternalStore as UseHassHook;
