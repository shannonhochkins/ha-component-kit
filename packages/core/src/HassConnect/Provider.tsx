import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
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
import { isArray, snakeCase } from "lodash";
import { useDebouncedCallback } from "use-debounce";
import {
  ServiceData,
  SnakeOrCamelDomains,
  DomainService,
  Target,
} from "@typings";
import { useHash } from "@core";
import { saveTokens, loadTokens } from "./token-storage";
export interface CallServiceArgs<
  T extends SnakeOrCamelDomains,
  M extends DomainService<T>,
> {
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

export interface HassContextProps {
  /** The connection object from home-assistant-js-websocket */
  connection: Connection | null;
  /** This is an internal function, no need to use this */
  setConnection: (connection: Connection) => void;
  /** will retrieve a HassEntity from the context */
  getEntity: {
    (entity: string): HassEntity;
    (entity: string, returnNullIfNotFound?: boolean): HassEntity | null;
    (entity: string, returnNullIfNotFound?: true): HassEntity | null;
    (entity: string, returnNullIfNotFound?: false): HassEntity;
  };
  /** will retrieve all HassEntities from the context */
  getAllEntities: () => HassEntities;
  /** will call a service for home assistant */
  callService: <T extends SnakeOrCamelDomains, M extends DomainService<T>>(
    args: CallServiceArgs<T, M>,
  ) => void;
  /** will retrieve all the HassEntities states */
  getStates: () => Promise<HassEntity[] | null>;
  /** will retrieve all the HassServices */
  getServices: () => Promise<HassServices | null>;
  /** will retrieve HassConfig */
  getConfig: () => Promise<HassConfig | null>;
  /** will retrieve HassUser */
  getUser: () => Promise<HassUser | null>;
  /** This is an internal value, no need to use this */
  ready: boolean;
  /** The last time the context object was updated */
  lastUpdated: Date;
  /** add a new route to the provider */
  addRoute(route: Route): void;
  useRoute(hash: string): Route | null;
  /** returns available routes */
  routes: Route[];
  /** the home assistant authentication object */
  auth: Auth;
  /** the home assistant configuration */
  config: HassConfig | null;
  /** logout of HA */
  logout: () => void;
}

export const HassContext = createContext<HassContextProps>(
  {} as HassContextProps,
);

export interface HassProviderProps {
  /** components to render once authenticated, this accepts a child function which will pass if it is ready or not */
  children: (ready: boolean) => React.ReactNode;
  /** the home assistant url */
  hassUrl: string;
  /** the throttle controller for updated @default 150 */
  throttle?: number;
  /** should you want to use a locally hosted home assistant instance, enable this flag @default false */
  allowNonSecure?: boolean;
  /** preload home-assistant configuration */
  preloadConfiguration?: boolean;
}

function translateErr(err: number | string | Error | unknown) {
  return err === ERR_CANNOT_CONNECT
    ? "Unable to connect"
    : err === ERR_HASS_HOST_REQUIRED
    ? "Please enter a Home Assistant URL."
    : err === ERR_INVALID_HTTPS_TO_HTTP
    ? `Cannot connect to Home Assistant instances over "http://".`
    : `Unknown error (${err}).`;
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

const tryConnection = async (
  init: "auth-callback" | "user-request" | "saved-tokens",
  hassUrl?: string,
): Promise<ConnectionResponse> => {
  const options: AuthOptions = {
    saveTokens,
    loadTokens: () => Promise.resolve(loadTokens()),
  };

  if (hassUrl) {
    options.hassUrl = hassUrl;
  }
  let auth: Auth;

  try {
    auth = await getAuth(options);
    if (auth.expired) {
      await auth.refreshAccessToken();
    }
  } catch (err: unknown) {
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

export function HassProvider({
  children,
  hassUrl,
  throttle = 150,
  allowNonSecure = false,
  preloadConfiguration = false,
}: HassProviderProps): JSX.Element {
  const [_hash] = useHash();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [ready, setReady] = useState(false);
  const [config, setConfig] = useState<HassConfig | null>(null);
  const [cannotConnect, setCannotConnect] = useState(false);
  const [auth, setAuth] = useState<Auth | null>(null);
  const unsubscribe = useRef<UnsubscribeFunc | null>(null);
  const [_entities, setEntities] = useState<HassEntities>({});
  const [error, setError] = useState<string | null>(null);
  const getStates = useCallback(
    async () => (connection === null ? null : await _getStates(connection)),
    [connection],
  );
  const getServices = useCallback(
    async () => (connection === null ? null : await _getServices(connection)),
    [connection],
  );
  const getConfig = useCallback(
    async () => (connection === null ? null : await _getConfig(connection)),
    [connection],
  );
  const getUser = useCallback(
    async () => (connection === null ? null : await _getUser(connection)),
    [connection],
  );
  const getAllEntities = useCallback(() => _entities, [_entities]);
  const getEntity = (entity: string, returnNullIfNotFound: boolean) => {
    if (entity === "unknown") {
      return null;
    }
    const found = _entities[entity];
    if (!found) {
      if (returnNullIfNotFound || entity === "unknown") return null;
      throw new Error(`Entity ${entity} not found`);
    }
    return found;
  };

  const setEntitiesDebounce = useDebouncedCallback<
    (entities: HassEntities) => void
  >((entities) => {
    setEntities(entities);
    setLastUpdated(new Date());
    if (!ready) setReady(true);
  }, throttle);

  const reset = useCallback(() => {
    // when the hassUrl changes, reset some properties and re-authenticate
    setReady(false);
    setEntities({});
    setConnection(null);
    setAuth(null);
    if (unsubscribe.current) {
      unsubscribe.current();
      unsubscribe.current = null;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      reset();
      saveTokens(null);
      if (location) location.reload();
    } catch (err: unknown) {
      setError("Unable to log out!");
    }
  }, [reset]);

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
        return await _callService(
          connection,
          snakeCase(domain),
          snakeCase(service),
          // purposely cast here as we know it's correct
          serviceData as object,
          target,
        );
      }
      return false;
    },
    [connection, ready],
  );

  const handleConnect = useCallback(async () => {
    let connectionResponse: ConnectionResponse;
    // this will trigger on first mount
    if (location && location.search.indexOf("auth_callback=1") !== -1) {
      connectionResponse = await tryConnection("auth-callback");
    } else if (loadTokens()) {
      connectionResponse = await tryConnection("saved-tokens");
    } else {
      const value = hassUrl || "";

      if (value === "") {
        setError("Please enter a Home Assistant URL.");
        return;
      }
      if (value.indexOf("://") === -1) {
        setError(
          "Please enter your full URL, including the protocol part (https://).",
        );
        return;
      }

      let url: URL;
      try {
        url = new URL(value);
      } catch (err: unknown) {
        setError("Invalid URL");
        return;
      }

      if (
        url.protocol === "http:" &&
        url.hostname !== "localhost" &&
        allowNonSecure === false
      ) {
        setError(translateErr(ERR_INVALID_HTTPS_TO_HTTP));
        return;
      }
      connectionResponse = await tryConnection("user-request", value);
    }
    if (connectionResponse.type === "error") {
      setError(connectionResponse.error);
    } else if (connectionResponse.type === "failed") {
      setCannotConnect(true);
    } else if (connectionResponse.type === "success") {
      // // store a reference to the authentication object
      setAuth(connectionResponse.auth);
      // // store the connection to pass to the provider
      setConnection(connectionResponse.connection);
    }
  }, [hassUrl, allowNonSecure]);

  useEffect(() => {
    handleConnect();
  }, [handleConnect]);

  useEffect(() => {
    // if preloadConfiguration is set to true, load it if we haven't already
    if (preloadConfiguration && config === null) {
      getConfig().then((config) => {
        setConfig(config);
      });
    }
  }, [preloadConfiguration, getConfig, config]);

  useEffect(() => {
    // subscribe to the entities sockets when we have a connection
    // we're already subscribed, so unsubscribe first
    if (unsubscribe.current) {
      unsubscribe.current();
      unsubscribe.current = null;
    }
    // now subscribe to the entities
    if (connection) {
      unsubscribe.current = subscribeEntities(connection, ($entities) => {
        setEntitiesDebounce($entities);
      });
    }
  }, [connection, setEntitiesDebounce]);

  useEffect(() => {
    setRoutes((routes) =>
      routes.map((route) => {
        // if the current has value is the same as the hash, we're active
        const hashWithoutPound = _hash.replace("#", "");
        const active =
          hashWithoutPound !== "" && hashWithoutPound === route.hash;
        return {
          ...route,
          active,
        };
      }),
    );
  }, [_hash]);

  const addRoute = useCallback(
    (route: Omit<Route, "active">) => {
      setRoutes((routes) => {
        const exists =
          routes.find((_route) => _route.hash === route.hash) !== undefined;
        if (!exists) {
          // if the current has value is the same as the hash, we're active
          const hashWithoutPound = _hash.replace("#", "");
          const active =
            hashWithoutPound !== "" && hashWithoutPound === route.hash;
          return [
            ...routes,
            {
              ...route,
              active,
            },
          ];
        }
        return routes;
      });
    },
    [_hash],
  );

  const useRoute = useCallback(
    (hash: string) => {
      const route = routes.find((route) => route.hash === hash);
      return route || null;
    },
    [routes],
  );

  if (cannotConnect) {
    return (
      <p>
        Unable to connect to ${loadTokens()!.hassUrl}, refresh the page and try
        again, or <a onClick={logout}>Logout</a>.
      </p>
    );
  }

  return (
    <HassContext.Provider
      value={{
        connection,
        setConnection,
        // purposely cast here so we have correct types on usage side
        getEntity: getEntity as HassContextProps["getEntity"],
        getAllEntities,
        callService,
        getStates,
        getServices,
        getConfig,
        getUser,
        addRoute,
        useRoute,
        routes,
        ready,
        lastUpdated,
        logout,
        /** simply wont be able to read this value unless authentication is successful, okay to cast here */
        auth: auth as Auth,
        config,
      }}
    >
      {error === null ? children(ready) : error}
    </HassContext.Provider>
  );
}
