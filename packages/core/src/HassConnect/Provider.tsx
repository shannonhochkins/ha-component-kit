import React, { createContext, useEffect, useCallback, useRef } from "react";
// types
import type {
  Connection,
  HassEntities,
  HassEntity,
  HassConfig,
  HassUser,
  HassServices,
  getAuthOptions as AuthOptions,
  Auth,
  UnsubscribeFunc,
} from "home-assistant-js-websocket";
import { type CSSInterpolation } from "@emotion/serialize";
// methods
import {
  getAuth,
  createConnection,
  subscribeEntities,
  callService as _callService,
  getStates as _getStates,
  getServices as _getServices,
  getConfig as _getConfig,
  getUser as _getUser,
  ERR_HASS_HOST_REQUIRED,
  ERR_CANNOT_CONNECT,
  ERR_INVALID_AUTH,
  ERR_INVALID_HTTPS_TO_HTTP,
} from "home-assistant-js-websocket";
import { isArray, snakeCase, isEmpty } from "lodash";
import { ServiceData, SnakeOrCamelDomains, DomainService, Target } from "@typings";
import { saveTokens, loadTokens, clearTokens } from "./token-storage";
import { diff } from "deep-object-diff";
import { create } from "zustand";
import { useDebouncedCallback } from "use-debounce";

export interface CallServiceArgs<T extends SnakeOrCamelDomains, M extends DomainService<T>> {
  domain: T;
  service: M;
  serviceData?: ServiceData<T, M>;
  target?: Target;
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
  | "familyCard";
export interface Store {
  entities: HassEntities;
  setEntities: (entities: HassEntities) => void;
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
  /** The last time the context object was updated */
  lastUpdated: Date;
  setLastUpdated: (lastUpdated: Date) => void;
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
  /** the home assistant configuration */
  config: HassConfig | null;
  setConfig: (config: HassConfig | null) => void;
  /** the hassUrl provided to the HassConnect component */
  hassUrl: string | null;
  /** set the hassUrl */
  setHassUrl: (hassUrl: string | null) => void;
  /** getter for breakpoints, if using @hakit/components, the breakpoints are stored here to retrieve in different locations */
  breakpoints: Record<"xxs" | "xs" | "sm" | "md" | "lg" | "xlg", number>;
  /** setter for breakpoints, if using @hakit/components, the breakpoints are stored here to retrieve in different locations */
  setBreakpoints: (breakpoints: Record<"xxs" | "xs" | "sm" | "md" | "lg", number>) => void;
  /** a way to provide or overwrite default styles for any particular component */
  setGlobalComponentStyles: (styles: Partial<Record<SupportedComponentOverrides, CSSInterpolation>>) => void;
  globalComponentStyles: Partial<Record<SupportedComponentOverrides, CSSInterpolation>>;
}

const useStore = create<Store>((set) => ({
  routes: [],
  setRoutes: (routes) => set(() => ({ routes })),
  entities: {},
  setHassUrl: (hassUrl) => set({ hassUrl }),
  hassUrl: null,
  hash: "",
  setHash: (hash) => set({ hash }),
  setEntities: (newEntities) =>
    set((state) => {
      const entitiesDiffChanged = diff(ignoreForDiffCheck(state.entities), ignoreForDiffCheck(newEntities)) as HassEntities;
      if (!isEmpty(entitiesDiffChanged)) {
        // purposely not making this throttle configurable
        // because lights can animate etc, which doesn't need to reflect in the UI
        // simply throttle updates every 50ms
        const updatedEntities = Object.keys(entitiesDiffChanged).reduce<HassEntities>(
          (acc, entityId) => ({
            ...acc,
            [entityId]: newEntities[entityId],
          }),
          {},
        );
        // update the stateEntities with the newEntities with the keys that have changed
        Object.keys(updatedEntities).forEach((entityId) => {
          state.entities[entityId] = {
            ...state.entities[entityId],
            ...newEntities[entityId],
          };
        });
        if (!state.ready) {
          return {
            ready: true,
            lastUpdated: new Date(),
            entities: state.entities,
          };
        }
        return {
          lastUpdated: new Date(),
          entities: state.entities,
        };
      }
      return state;
    }),
  connection: null,
  setConnection: (connection) => set({ connection }),
  cannotConnect: false,
  setCannotConnect: (cannotConnect) => set({ cannotConnect }),
  ready: false,
  setReady: (ready) => set({ ready }),
  lastUpdated: new Date(),
  setLastUpdated: (lastUpdated) => set({ lastUpdated }),
  auth: null,
  setAuth: (auth) => set({ auth }),
  config: null,
  setConfig: (config) => set({ config }),
  error: null,
  setError: (error) => set({ error }),
  breakpoints: {
    xxs: 0,
    xs: 0,
    sm: 0,
    md: 0,
    lg: 0,
    xlg: 0,
  },
  setBreakpoints: (breakpoints) =>
    set({
      breakpoints: {
        ...breakpoints,
        xlg: breakpoints.lg + 1,
      },
    }),
  globalComponentStyles: {},
  setGlobalComponentStyles: (styles) => set(() => ({ globalComponentStyles: styles })),
}));

export interface HassContextProps {
  useStore: typeof useStore;
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
  callService: <T extends SnakeOrCamelDomains, M extends DomainService<T>>(args: CallServiceArgs<T, M>) => void;
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
}

export const HassContext = createContext<HassContextProps>({} as HassContextProps);

export interface HassProviderProps {
  /** components to render once authenticated, this accepts a child function which will pass if it is ready or not */
  children: (ready: boolean) => React.ReactNode;
  /** the home assistant url */
  hassUrl: string;
}

function translateErr(err: number | string | Error | unknown): string {
  const message =
    err === ERR_CANNOT_CONNECT
      ? "Unable to connect"
      : err === ERR_HASS_HOST_REQUIRED
        ? "Please enter a Home Assistant URL."
        : err === ERR_INVALID_HTTPS_TO_HTTP
          ? `Cannot connect to Home Assistant instances over "http://".`
          : null;
  if (message !== null) return message;
  return (
    (
      err as {
        error: string;
      }
    )?.error ||
    (err as Error)?.message ||
    `Unknown Error (${err})`
  );
}
type ConnectionResponse =
  | {
      type: "success";
      connection: Connection;
      auth: Auth;
    }
  | {
      type: "error";
      error: string;
    }
  | {
      type: "failed";
      cannotConnect: true;
    };

const tryConnection = async (init: "auth-callback" | "user-request" | "saved-tokens", hassUrl: string): Promise<ConnectionResponse> => {
  const options: AuthOptions = {
    saveTokens,
    loadTokens: () => Promise.resolve(loadTokens(hassUrl)),
  };

  if (hassUrl && init === "user-request") {
    options.hassUrl = hassUrl;
  }
  let auth: Auth;

  try {
    auth = await getAuth(options);
  } catch (err: unknown) {
    if (
      (
        err as {
          error: string;
        }
      )?.error === "invalid_grant"
    ) {
      // the refresh token is incorrect and most likely from another browser / instance
      clearTokens();
      return tryConnection(init, hassUrl);
    }
    if (init === "saved-tokens" && err === ERR_CANNOT_CONNECT) {
      return {
        type: "failed",
        cannotConnect: true,
      };
    }
    return {
      type: "error",
      error: translateErr(err),
    };
  } finally {
    // Clear url if we have a auth callback in url.
    if (location && location.search.includes("auth_callback=1")) {
      history.replaceState(null, "", location.pathname);
    }
  }
  let connection: Connection;
  try {
    // create the connection to the websockets
    connection = await createConnection({ auth });
  } catch (err) {
    // In case of saved tokens, silently solve problems.
    if (init === "saved-tokens") {
      if (err === ERR_CANNOT_CONNECT) {
        return {
          type: "failed",
          cannotConnect: true,
        };
      } else if (err === ERR_INVALID_AUTH) {
        saveTokens(null);
      }
    }
    return {
      type: "error",
      error: translateErr(err),
    };
  }
  return {
    type: "success",
    connection,
    auth,
  };
};
const IGNORE_KEYS_FOR_DIFF = ["last_changed", "last_updated", "context"];
const ignoreForDiffCheck = (
  obj: HassEntities,
  keys: string[] = IGNORE_KEYS_FOR_DIFF,
): {
  [key: string]: Omit<HassEntity, "last_changed" | "last_updated" | "context">;
} => {
  return Object.fromEntries(
    Object.entries(obj).map(([entityId, entityData]) => [
      entityId,
      Object.fromEntries(Object.entries(entityData).filter(([key]) => !keys.includes(key))),
    ]),
  ) as {
    [key: string]: Omit<HassEntity, "last_changed" | "last_updated" | "context">;
  };
};

export function HassProvider({ children, hassUrl }: HassProviderProps) {
  const entityUnsubscribe = useRef<UnsubscribeFunc | null>(null);
  const authenticated = useRef(false);
  const fetchedConfig = useRef(false);
  const setHash = useStore((store) => store.setHash);
  const _hash = useStore((store) => store.hash);
  const routes = useStore((store) => store.routes);
  const setRoutes = useStore((store) => store.setRoutes);
  const connection = useStore((store) => store.connection);
  const setConnection = useStore((store) => store.setConnection);
  const _connectionRef = useRef<Connection | null>(null);
  const entities = useStore((store) => store.entities);
  const setEntities = useStore((store) => store.setEntities);
  const error = useStore((store) => store.error);
  const setError = useStore((store) => store.setError);
  const cannotConnect = useStore((store) => store.cannotConnect);
  const setCannotConnect = useStore((store) => store.setCannotConnect);
  const setAuth = useStore((store) => store.setAuth);
  const ready = useStore((store) => store.ready);
  const setReady = useStore((store) => store.setReady);
  const config = useStore((store) => store.config);
  const setConfig = useStore((store) => store.setConfig);
  const setHassUrl = useStore((store) => store.setHassUrl);

  const reset = useCallback(() => {
    // when the hassUrl changes, reset some properties and re-authenticate
    setAuth(null);
    _connectionRef.current = null;
    setConnection(null);
    setEntities({});
    setConfig(null);
    setError(null);
    setCannotConnect(false);
    setReady(false);
    setRoutes([]);
    authenticated.current = false;
    if (entityUnsubscribe.current) {
      entityUnsubscribe.current();
      entityUnsubscribe.current = null;
    }
  }, [setAuth, setCannotConnect, setConfig, setConnection, setEntities, setError, setReady, setRoutes]);

  const logout = useCallback(async () => {
    try {
      reset();
      clearTokens();
      if (location) location.reload();
    } catch (err: unknown) {
      setError("Unable to log out!");
    }
  }, [reset, setError]);

  const handleConnect = useCallback(async () => {
    let connectionResponse: ConnectionResponse;
    // this will trigger on first mount
    if (location && location.search.indexOf("auth_callback=1") !== -1) {
      connectionResponse = await tryConnection("auth-callback", hassUrl);
    } else if (loadTokens(hassUrl)) {
      connectionResponse = await tryConnection("saved-tokens", hassUrl);
    } else {
      const value = hassUrl || "";

      if (value === "") {
        setError("Please enter a Home Assistant URL.");
        authenticated.current = false;
        return;
      }
      if (value.indexOf("://") === -1) {
        setError("Please enter your full URL, including the protocol part (https://).");
        authenticated.current = false;
        return;
      }

      try {
        new URL(value);
      } catch (err: unknown) {
        setError("Invalid URL");
        authenticated.current = false;
        return;
      }

      connectionResponse = await tryConnection("user-request", value);
    }
    if (connectionResponse.type === "error") {
      setError(connectionResponse.error);
    } else if (connectionResponse.type === "failed") {
      setCannotConnect(true);
    } else if (connectionResponse.type === "success") {
      // store a reference to the authentication object
      setAuth(connectionResponse.auth);
      // store the connection to pass to the provider
      setConnection(connectionResponse.connection);
      _connectionRef.current = connectionResponse.connection;
      return;
    }
    authenticated.current = false;
  }, [hassUrl, setError, setAuth, setConnection, setCannotConnect]);

  useEffect(() => {
    setHassUrl(hassUrl);
  }, [hassUrl, setHassUrl]);

  const getStates = useCallback(async () => (connection === null ? null : await _getStates(connection)), [connection]);
  const getServices = useCallback(async () => (connection === null ? null : await _getServices(connection)), [connection]);
  const getConfig = useCallback(async () => (connection === null ? null : await _getConfig(connection)), [connection]);
  const getUser = useCallback(async () => (connection === null ? null : await _getUser(connection)), [connection]);

  const joinHassUrl = useCallback(
    (path: string) => {
      return new URL(path, connection?.options.auth?.data.hassUrl).toString();
    },
    [connection],
  );

  async function callApi<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<
    | {
        data: T;
        status: "success";
      }
    | {
        data: string;
        status: "error";
      }
  > {
    try {
      const response = await fetch(`${hassUrl}/api${endpoint}`, {
        method: "GET",
        ...(options ?? {}),
        headers: {
          Authorization: "Bearer " + connection?.options.auth?.accessToken,
          "Content-type": "application/json;charset=UTF-8",
          ...(options?.headers ?? {}),
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        return {
          status: "success",
          data,
        };
      }
      return {
        status: "error",
        data: response.statusText,
      };
    } catch (e) {
      return {
        status: "error",
        data: `API Request failed for endpoint "${endpoint}", follow instructions here: https://shannonhochkins.github.io/ha-component-kit/?path=/docs/hooks-usehass-callapi--docs.`,
      };
    }
  }

  useEffect(() => {
    if (config === null && !fetchedConfig.current && connection !== null) {
      fetchedConfig.current = true;
      getConfig()
        .then((config) => {
          setConfig(config);
        })
        .catch((e) => {
          fetchedConfig.current = false;
          setError(`Error retrieving configuration from Home Assistant: ${e?.message ?? e}`);
        });
    }
  }, [config, connection, getConfig, setConfig, setError]);

  useEffect(() => {
    if (location.hash === "") return;
    if (location.hash.replace("#", "") === _hash) return;
    setHash(location.hash);
  }, [setHash, _hash]);

  useEffect(() => {
    function onHashChange() {
      setRoutes(
        routes.map((route) => {
          if (route.hash === location.hash.replace("#", "")) {
            return {
              ...route,
              active: true,
            };
          }
          return {
            ...route,
            active: false,
          };
        }),
      );
      setHash(location.hash);
    }
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [routes, setHash, setRoutes]);

  const addRoute = useCallback(
    (route: Omit<Route, "active">) => {
      const exists = routes.find((_route) => _route.hash === route.hash) !== undefined;
      if (!exists && typeof window !== "undefined") {
        // if the current has value is the same as the hash, we're active
        const hashWithoutPound = window.location.hash.replace("#", "");
        const active = hashWithoutPound !== "" && hashWithoutPound === route.hash;
        setRoutes([
          ...routes,
          {
            ...route,
            active,
          },
        ]);
      }
    },
    [routes, setRoutes],
  );

  const getRoute = useCallback(
    (hash: string) => {
      const route = routes.find((route) => route.hash === hash);
      return route || null;
    },
    [routes],
  );

  const getAllEntities = useCallback(() => entities, [entities]);

  const callService = useCallback(
    async <T extends SnakeOrCamelDomains, M extends DomainService<T>>({
      domain,
      service,
      serviceData,
      target: _target,
    }: CallServiceArgs<T, M>) => {
      const target =
        typeof _target === "string" || isArray(_target)
          ? {
              entity_id: _target,
            }
          : _target;
      if (typeof service !== "string") {
        throw new Error("service must be a string");
      }
      if (connection && ready) {
        try {
          return await _callService(
            connection,
            snakeCase(domain),
            snakeCase(service),
            // purposely cast here as we know it's correct
            serviceData as object,
            target,
          );
        } catch (e) {
          // TODO - raise error to client here
        }
      }
      return false;
    },
    [connection, ready],
  );

  useEffect(() => {
    if (connection && entityUnsubscribe.current === null) {
      entityUnsubscribe.current = subscribeEntities(connection, ($entities) => {
        setEntities($entities);
      });
    }
  }, [connection, setEntities]);

  useEffect(() => {
    return () => {
      authenticated.current = false;
      if (entityUnsubscribe.current) {
        entityUnsubscribe.current();
        entityUnsubscribe.current = null;
      }
    };
  }, []);

  const debounceConnect = useDebouncedCallback(async () => {
    if (_connectionRef.current && !connection) {
      setConnection(_connectionRef.current);
      authenticated.current = true;
      return;
    }
    if (!_connectionRef.current && connection) {
      _connectionRef.current = connection;
      authenticated.current = true;
      return;
    }
    if (authenticated.current) return;
    authenticated.current = true;
    await handleConnect();
  }, 100);

  useEffect(() => {
    // authenticate with ha
    debounceConnect();
  }, [debounceConnect]);

  if (cannotConnect) {
    return (
      <p>
        Unable to connect to ${loadTokens(hassUrl)!.hassUrl}, refresh the page and try again, or <a onClick={logout}>Logout</a>.
      </p>
    );
  }
  return (
    <HassContext.Provider
      value={{
        useStore,
        logout,
        addRoute,
        getRoute,
        getStates,
        getServices,
        getConfig,
        getUser,
        callApi,
        getAllEntities,
        callService,
        joinHassUrl,
      }}
    >
      {error === null ? children(ready) : error}
    </HassContext.Provider>
  );
}
