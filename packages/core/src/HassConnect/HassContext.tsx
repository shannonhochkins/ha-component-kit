// types
import type { Connection, HassEntities, HassEntity, HassConfig, HassServices, Auth } from "home-assistant-js-websocket";
import { type CSSInterpolation } from "@emotion/serialize";
import { ServiceData, SnakeOrCamelDomains, DomainService, Target, LocaleKeys, ServiceResponse } from "@typings";
import { create } from "zustand";
import { type ConnectionStatus } from "./handleSuspendResume";
import {
  AreaRegistryEntry,
  AuthUser,
  computeAttributeValueDisplay,
  computeStateDisplay,
  DeviceRegistryEntry,
  EntityRegistryDisplayEntry,
  FloorRegistryEntry,
  FrontendLocaleData,
  resolveTimeZone,
  shouldUseAmPm,
} from "@core";
import { createDateFormatters, DateFormatters } from "./createDateFormatters";
import { isArray, snakeCase } from "lodash";
import { callService as _callService } from "home-assistant-js-websocket";
import { callApi } from "./callApi";
import { CurrentUser } from "@utils/subscribe/user";
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

export interface SensorNumericDeviceClasses {
  numeric_device_classes: string[];
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
  sensorNumericDeviceClasses: string[];
  setSensorNumericDeviceClasses: (classes: string[]) => void;
  /** home assistant instance locale data */
  locale: FrontendLocaleData | null;
  setLocale: (locale: FrontendLocaleData | null) => void;
  /** the device registry from home assistant */
  devices: Record<string, DeviceRegistryEntry>;
  setDevices: (devices: Record<string, DeviceRegistryEntry>) => void;
  /** the entity registry display from home assistant */
  entitiesRegistryDisplay: Record<string, EntityRegistryDisplayEntry>;
  setEntitiesRegistryDisplay: (entities: Record<string, EntityRegistryDisplayEntry>) => void;
  /** the area registry from home assistant */
  areas: Record<string, AreaRegistryEntry>;
  setAreas: (areas: Record<string, AreaRegistryEntry>) => void;
  /** the floor registry from home assistant */
  floors: Record<string, FloorRegistryEntry>;
  setFloors: (floors: Record<string, FloorRegistryEntry>) => void;
  /** The entities in the home assistant instance */
  entities: HassEntities;
  setEntities: (entities: HassEntities) => void;
  /** the home assistant services data */
  services: HassServices;
  setServices: (services: HassServices) => void;
  /** the connection status of your home assistant instance */
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
  /** the current authenticated user */
  user: CurrentUser | null;
  setUser: (user: CurrentUser | null) => void;
  /** all users in the home assistant instance */
  users: AuthUser[];
  setUsers: (users: AuthUser[]) => void;
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
  /** convenience helpers to format specific entity attributes, values, dates etc */
  formatter: {
    /** will format the state value automatically based on the entity provided */
    stateValue: (entity: HassEntity) => string;
    /** will format the attribute value automatically based on the entity and attribute provided */
    attributeValue: (entity: HassEntity, attribute: string) => string;
  } & DateFormatters;
  helpers: {
    /** logout of HA */
    logout: () => void;
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
    addRoute: (route: Omit<Route, "active">) => void;
    /** retrieve a route by name */
    getRoute: (hash: string) => Route | null;
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
    /** date time related helper functions */
    dateTime: {
      /** determine if the current locale/timezone should use am/pm time format */
      shouldUseAmPm: () => boolean;
      /** resolve the correct timezone to use based on locale and config */
      getTimeZone: () => string;
    };
  };
}

// ignore some keys that we don't actually care about when comparing entities
const shallowEqual = (entity: HassEntity, other: HassEntity): boolean => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { last_changed, last_updated, context, ...restEntity } = entity;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { last_changed: c1, last_updated: c2, context: c3, ...restOther } = other;

  return JSON.stringify(restEntity) === JSON.stringify(restOther);
};

// Store dedicated to provider-level connection/session bookkeeping (authentication state and active websocket subscriptions)
export interface HassProviderStore {
  /** whether we've successfully initiated an auth/connect attempt for current hassUrl */
  authenticated: boolean;
  /** set authenticated flag */
  setAuthenticated: (value: boolean) => void;
  /** active unsubscribe functions keyed by a descriptive name */
  subscriptions: Record<string, UnsubscribeFunc>;
  /** register (or replace) a subscription; will auto-unsubscribe previous key before storing */
  addSubscription: (key: string, fn: UnsubscribeFunc | null | undefined) => void;
  /** remove a subscription by key and call its unsubscribe */
  removeSubscription: (key: string) => void;
  /** unsubscribe every tracked subscription and clear map */
  unsubscribeAll: () => void;
  /** resets the information on the internal store */
  reset: () => void;
}

// We import the type from home-assistant-js-websocket here to avoid circular imports elsewhere
import type { UnsubscribeFunc } from "home-assistant-js-websocket";
import { clearTokens } from "./token-storage";

export const useInternalStore = create<InternalStore>((set, get) => ({
  sensorNumericDeviceClasses: [],
  setSensorNumericDeviceClasses: (classes: string[]) => set({ sensorNumericDeviceClasses: classes }),
  locale: null,
  setLocale: (locale) => set({ locale }),
  routes: [],
  setRoutes: (routes) => set(() => ({ routes })),
  entities: {},
  devices: {},
  setDevices: (devices) => set(() => ({ devices })),
  entitiesRegistryDisplay: {},
  setEntitiesRegistryDisplay: (entities) => set(() => ({ entitiesRegistryDisplay: entities })),
  areas: {},
  setAreas: (areas) => set(() => ({ areas })),
  floors: {},
  services: {},
  setServices: (services: HassServices) => set(() => ({ services })),
  setFloors: (floors) => set(() => ({ floors })),
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
  users: [],
  setUsers: (users) => set({ users }),
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
  helpers: {
    logout() {
      const { reset } = useHassProviderStore.getState();
      const { setError } = get();
      try {
        reset();
        clearTokens();
        if (location) location.reload();
      } catch (err: unknown) {
        console.error("Error:", err);
        setError("Unable to log out!");
      }
    },
    callService: (<ResponseType extends object, T extends SnakeOrCamelDomains, M extends DomainService<T>>(
      rawArgs: CallServiceArgs<T, M, boolean>,
    ): Promise<ServiceResponse<ResponseType>> | void => {
      const { domain, service, serviceData, target: _target, returnResponse } = rawArgs;
      const { connection, ready } = get();
      const target = typeof _target === "string" || isArray(_target) ? { entity_id: _target } : _target;

      // basic guards
      if (!connection || !ready) {
        if (returnResponse) {
          return Promise.reject(new Error("callService: connection not established or not ready"));
        }
        return; // fire & forget path does nothing when not ready
      }

      try {
        const result = _callService(connection, snakeCase(domain), snakeCase(service), serviceData ?? {}, target, returnResponse);
        return returnResponse ? (result as Promise<ServiceResponse<ResponseType>>) : undefined; // fire & forget
      } catch (e) {
        console.error("Error calling service:", e);
        return returnResponse ? Promise.reject(e) : undefined;
      }
    }) as InternalStore["helpers"]["callService"],
    addRoute(route) {
      const { routes, setRoutes } = get();
      const exists = routes.find((r) => r.hash === route.hash);
      if (!exists) {
        const hashWithoutPound = typeof window !== "undefined" ? window.location.hash.replace("#", "") : "";
        const active = hashWithoutPound !== "" && hashWithoutPound === route.hash;
        setRoutes([...routes, { ...route, active } satisfies Route]);
      }
    },
    getRoute(hash) {
      const { routes } = get();
      return routes.find((r) => r.hash === hash) || null;
    },
    getAllEntities() {
      return get().entities;
    },
    joinHassUrl(path: string) {
      const { connection } = get();
      return connection ? new URL(path, connection.options.auth?.data.hassUrl).toString() : "";
    },
    callApi: callApi,
    dateTime: {
      shouldUseAmPm: () => {
        const { locale } = get();
        if (locale) {
          return shouldUseAmPm(locale);
        }
        return true;
      },
      getTimeZone() {
        const { locale, config } = get();
        if (!config || !locale) {
          return "UTC";
        }
        return resolveTimeZone(locale.time_zone, config.time_zone);
      },
    },
  },
  formatter: {
    stateValue: (entity: HassEntity) => {
      const { config, entitiesRegistryDisplay, locale, sensorNumericDeviceClasses } = get();
      if (!config || !locale) {
        return "";
      }
      return computeStateDisplay(entity, config, entitiesRegistryDisplay, locale, sensorNumericDeviceClasses, entity.state);
    },
    attributeValue: (entity: HassEntity, attribute: string) => {
      const { config, entitiesRegistryDisplay, locale } = get();
      if (!config || !locale) {
        return "";
      }
      return computeAttributeValueDisplay(entity, locale, config, entitiesRegistryDisplay, attribute);
    },
    ...createDateFormatters(),
  },
}));

export const useHassProviderStore = create<HassProviderStore>((set, get) => ({
  authenticated: false,
  setAuthenticated: (value) => set({ authenticated: value }),
  subscriptions: {},
  addSubscription: (key, fn) => {
    if (!fn) return;
    const subs = get().subscriptions;
    // if an existing subscription with this key exists, attempt cleanup first
    if (subs[key]) {
      try {
        subs[key]();
      } catch (e) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(`Failed to unsubscribe previous subscription for key '${key}'`, e);
        }
      }
    }
    set({ subscriptions: { ...subs, [key]: fn } });
  },
  removeSubscription: (key) => {
    const subs = get().subscriptions;
    if (!subs[key]) return;
    try {
      subs[key]!();
    } catch (e) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`Failed to unsubscribe subscription for key '${key}'`, e);
      }
    }
    const next = { ...subs };
    delete next[key];
    set({ subscriptions: next });
  },
  unsubscribeAll: () => {
    const subs = get().subscriptions;
    for (const key of Object.keys(subs)) {
      try {
        subs[key]!();
      } catch (e) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(`Failed during mass unsubscribe for key '${key}'`, e);
        }
      }
    }
    set({ subscriptions: {} });
  },

  reset() {
    const { unsubscribeAll, setAuthenticated } = get();
    const {
      setAuth,
      setUser,
      setCannotConnect,
      setConfig,
      setConnection,
      setEntities,
      setError,
      setReady,
      setRoutes,
      setConnectionStatus,
    } = useInternalStore.getState();
    // when the hassUrl changes, reset some properties and re-authenticate
    setAuth(null);
    setRoutes([]);
    setReady(false);
    setConnection(null);
    setEntities({});
    setConfig(null);
    setError(null);
    setCannotConnect(false);
    setUser(null);
    setConnectionStatus("pending");
    setAuthenticated(false);
    unsubscribeAll();
  },
}));
