import { createContext } from "react";
// types
import type { Connection, HassEntities, HassEntity, HassConfig, HassUser, HassServices, Auth } from "home-assistant-js-websocket";
import { type CSSInterpolation } from "@emotion/serialize";
import { ServiceData, SnakeOrCamelDomains, DomainService, Target, LocaleKeys, ServiceResponse } from "@typings";
import type { UseStoreHook } from "../hooks/useStore";
import { create } from "zustand";
import { type ConnectionStatus } from "./handleSuspendResume";
export interface CallServiceArgs<T extends SnakeOrCamelDomains, M extends DomainService<T>, R extends boolean> {
  domain: T;
  service: M;
  serviceData?: ServiceData<T, M>;
  target?: Target;
  returnResponse?: R;
}

export interface Route {
  hash: string;
  name: string;
  icon: string;
  active: boolean;
}

export type SupportedComponentOverrides =
  | "buttonCard"
  | "modal"
  | "areaCard"
  | "calendarCard"
  | "climateCard"
  | "cameraCard"
  | "entitiesCard"
  | "fabCard"
  | "cardBase"
  | "garbageCollectionCard"
  | "mediaPlayerCard"
  | "pictureCard"
  | "sensorCard"
  | "timeCard"
  | "triggerCard"
  | "weatherCard"
  | "menu"
  | "personCard"
  | "familyCard"
  | "vacuumCard"
  | "alarmCard";
export interface InternalStore {
  entities: HassEntities;
  setEntities: (entities: HassEntities) => void;
  connectionStatus: ConnectionStatus;
  setConnectionStatus: (status: ConnectionStatus) => void;
  /** The connection object from home-assistant-js-websocket */
  connection: Connection | null;
  setConnection: (connection: Connection | null) => void;
  /** any errors caught during core authentication */
  error: null | string;
  setError: (error: string | null) => void;
  /** if there was an issue connecting to HA */
  cannotConnect: boolean;
  setCannotConnect: (cannotConnect: boolean) => void;
  /** This is an internal value, no need to use this */
  ready: boolean;
  setReady: (ready: boolean) => void;
  /** the current hash in the url */
  hash: string;
  /** set the current hash */
  setHash: (hash: string) => void;
  /** returns available routes */
  routes: Route[];
  setRoutes: (routes: Route[]) => void;
  /** the home assistant authentication object */
  auth: Auth | null;
  setAuth: (auth: Auth | null) => void;
  user: HassUser | null;
  setUser: (user: HassUser | null) => void;
  /** the home assistant configuration */
  config: HassConfig | null;
  setConfig: (config: HassConfig | null) => void;
  /** the hassUrl provided to the HassConnect component */
  hassUrl: string | null;
  /** set the hassUrl */
  setHassUrl: (hassUrl: string | null) => void;
  /** a way to provide or overwrite default styles for any particular component */
  setGlobalComponentStyles: (styles: Partial<Record<SupportedComponentOverrides, CSSInterpolation>>) => void;
  globalComponentStyles: Partial<Record<SupportedComponentOverrides, CSSInterpolation>>;
  portalRoot?: HTMLElement;
  setPortalRoot: (portalRoot: HTMLElement) => void;
  locales: Record<LocaleKeys, string> | null;
  setLocales: (locales: Record<LocaleKeys, string>) => void;
  // used by some features to change which window context to use
  setWindowContext: (windowContext: Window) => void;
  windowContext: Window;
  /** internal - callbacks that will fire when the connection disconnects with home assistant */
  disconnectCallbacks: (() => void)[];
  /** use this to trigger certain functionality when the web socket connection disconnects */
  onDisconnect?: (cb: () => void) => void;
  /** internal function which will trigger when the connection disconnects */
  triggerOnDisconnect: () => void;
}

// ignore some keys that we don't actually care about when comparing entities
const shallowEqual = (entity: HassEntity, other: HassEntity): boolean => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { last_changed, last_updated, context, ...restEntity } = entity;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { last_changed: c1, last_updated: c2, context: c3, ...restOther } = other;

  return JSON.stringify(restEntity) === JSON.stringify(restOther);
};

export const useInternalStore = create<InternalStore>((set) => ({
  routes: [],
  setRoutes: (routes) => set(() => ({ routes })),
  entities: {},
  setHassUrl: (hassUrl) => set({ hassUrl }),
  hassUrl: null,
  hash: "",
  locales: null,
  setLocales: (locales) => set({ locales }),
  setHash: (hash) => set({ hash }),
  setPortalRoot: (portalRoot) => set({ portalRoot }),
  windowContext: window,
  setWindowContext: (windowContext) => set({ windowContext }),
  setEntities: (newEntities) =>
    set((state) => {
      let changed = false;
      const next = { ...state.entities };
      for (const [id, newEnt] of Object.entries(newEntities)) {
        const oldEnt = state.entities[id];

        // ---- fast path: first time we ever see this ID ----
        if (!oldEnt) {
          next[id] = newEnt;
          changed = true;
          continue;
        }

        if (!shallowEqual(oldEnt, newEnt)) {
          next[id] = newEnt; // replace only if meaningful props differ
          changed = true;
        }
      }
      return changed ? { entities: next, lastUpdated: Date.now(), ready: true } : state;
    }),
  connectionStatus: "pending",
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  connection: null,
  setConnection: (connection) => set({ connection }),
  cannotConnect: false,
  setCannotConnect: (cannotConnect) => set({ cannotConnect }),
  ready: false,
  setReady: (ready) => set({ ready }),
  auth: null,
  setAuth: (auth) => set({ auth }),
  config: null,
  setConfig: (config) => set({ config }),
  user: null,
  setUser: (user) => set({ user }),
  error: null,
  setError: (error) => set({ error }),
  globalComponentStyles: {},
  setGlobalComponentStyles: (styles) => set(() => ({ globalComponentStyles: styles })),
  disconnectCallbacks: [],
  onDisconnect: (cb) => set((state) => ({ disconnectCallbacks: [...state.disconnectCallbacks, cb] })),
  triggerOnDisconnect: () =>
    set((state) => {
      state.disconnectCallbacks.forEach((cb) => cb());
      return { disconnectCallbacks: [] };
    }),
}));

export interface HassContextProps {
  /** @deprecated - import "useStore" directly from @hakit/core */
  useStore: UseStoreHook;
  /** logout of HA */
  logout: () => void;
  /** will retrieve all the HassEntities states */
  getStates: () => Promise<HassEntity[] | null>;
  /** will retrieve all the HassServices */
  getServices: () => Promise<HassServices | null>;
  /** will retrieve HassConfig */
  getConfig: () => Promise<HassConfig | null>;
  /** will retrieve HassUser */
  getUser: () => Promise<HassUser | null>;
  /** function to call a service through web sockets */
  callService: {
    <ResponseType extends object, T extends SnakeOrCamelDomains, M extends DomainService<T>>(
      args: CallServiceArgs<T, M, true>,
    ): Promise<ServiceResponse<ResponseType>>;

    /** Overload for when `returnResponse` is false */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    <_ResponseType extends object, T extends SnakeOrCamelDomains, M extends DomainService<T>>(args: CallServiceArgs<T, M, false>): void;

    /** Overload for when `returnResponse` is omitted (defaults to false) */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    <_ResponseType extends object, T extends SnakeOrCamelDomains, M extends DomainService<T>>(
      args: Omit<CallServiceArgs<T, M, false>, "returnResponse">,
    ): void;
  };
  /** add a new route to the provider */
  addRoute(route: Omit<Route, "active">): void;
  /** retrieve a route by name */
  getRoute(hash: string): Route | null;
  /** will retrieve all HassEntities from the context */
  getAllEntities: () => HassEntities;
  /** join a path to the hassUrl */
  joinHassUrl: (path: string) => string;
  /** call the home assistant api */
  callApi: <T>(
    endpoint: string,
    options?: RequestInit,
  ) => Promise<
    | {
        data: T;
        status: "success";
      }
    | {
        data: string;
        status: "error";
      }
  >;
  /** Will tell the various features like breakpoints, modals and resize events which window to match media on, if serving within an iframe it'll potentially be running in the wrong window */
  windowContext?: Window;
}

export const HassContext = createContext<HassContextProps>({} as HassContextProps);
