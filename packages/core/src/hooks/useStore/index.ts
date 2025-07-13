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
  "globalComponentStyles",
  "setGlobalComponentStyles",
] satisfies (keyof InternalStore)[];

type KeysToPick = (typeof DATA_KEYS)[number];

export type Store = Pick<InternalStore, KeysToPick>;

export type UseStoreHook = UseBoundStore<StoreApi<Store>>;

// things we want to expose for the user
// this is a type only difference, it still contains everything but the goal here is to please typescript users.
export const useStore = useInternalStore as UseStoreHook;
