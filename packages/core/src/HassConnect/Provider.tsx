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
export interface CallServiceArgs<
  T extends SnakeOrCamelDomains,
  M extends DomainService<T>
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
    args: CallServiceArgs<T, M>
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
  /** returns available routes */
  routes: Route[];
}

export const HassContext = createContext<HassContextProps>(
  {} as HassContextProps
);

export interface HassProviderProps {
  children: (ready: boolean) => React.ReactNode;
  hassUrl: string;
  throttle?: number;
}

export function HassProvider({
  children,
  hassUrl,
  throttle = 150,
}: HassProviderProps): JSX.Element {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [ready, setReady] = useState(false);
  const auth = useRef<Auth | null>(null);
  const hasRequestedAuth = useRef(false);
  const unsubscribe = useRef<UnsubscribeFunc | null>(null);
  const [_entities, setEntities] = useState<HassEntities>({});
  const [error, setError] = useState<string | null>(null);
  const getStates = useCallback(
    async () => (connection === null ? null : await _getStates(connection)),
    [connection]
  );
  const getServices = useCallback(
    async () => (connection === null ? null : await _getServices(connection)),
    [connection]
  );
  const getConfig = useCallback(
    async () => (connection === null ? null : await _getConfig(connection)),
    [connection]
  );
  const getUser = useCallback(
    async () => (connection === null ? null : await _getUser(connection)),
    [connection]
  );
  const getAllEntities = useCallback(() => _entities, [_entities]);
  const getEntity = (entity: string, returnNullIfNotFound: boolean) => {
    if (entity === "unknown") {
      return null;
    }
    const found = _entities[entity];
    if (!found) {
      if (returnNullIfNotFound || entity === 'unknown') return null;
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
  const getAuthOptions = useCallback((hassUrl: string): AuthOptions => {
    const { origin: inputOrigin } = new URL(hassUrl);
    return {
      hassUrl: inputOrigin,
      async loadTokens() {
        try {
          const tokens = JSON.parse(localStorage.hassTokens);
          const { origin: tokenOrigin } = new URL(tokens.hassUrl);
          // abort the authentication if the token url doesn't match
          if (inputOrigin !== tokenOrigin) return null;
          return tokens;
        } catch (err) {
          if (err instanceof Error) {
            if (!err.message.includes("is not valid JSON")) {
              setError(err.message);
            }
          }
        }
      },
      saveTokens: (tokens) => {
        localStorage.hassTokens = JSON.stringify(tokens);
      },
    };
  }, []);

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
          target
        );
      }
      return false;
    },
    [connection, ready]
  );

  useEffect(() => {
    // when the hassUrl changes, reset some properties
    setReady(false);
    setEntities({});
    setConnection(null);
    auth.current = null;
    hasRequestedAuth.current = false;
    if (unsubscribe.current) {
      unsubscribe.current();
      unsubscribe.current = null;
    }
  }, [hassUrl]);

  useEffect(() => {
    if (connection === null) return;
  }, [connection, setEntitiesDebounce]);

  const translateErr = (err: number | string | Error | unknown) =>
    err === ERR_CANNOT_CONNECT
      ? "Unable to connect"
      : err === ERR_HASS_HOST_REQUIRED
      ? "Please enter a Home Assistant URL."
      : err === ERR_INVALID_HTTPS_TO_HTTP
      ? `Cannot connect to Home Assistant instances over "http://".`
      : `Unknown error (${err}).`;

  const authenticate = useCallback(async () => {
    if (typeof hassUrl !== "string") return;
    if (error !== null) setError(null);
    try {
      auth.current = await getAuth(getAuthOptions(hassUrl));
      if (auth.current.expired) {
        return auth.current.refreshAccessToken();
      }
    } catch (err) {
      if (err === ERR_HASS_HOST_REQUIRED) {
        auth.current = await getAuth(getAuthOptions(hassUrl));
      } else {
        throw err;
      }
    }
    try {
      // create the connection to the websockets
      const connection = await createConnection({ auth: auth.current });
      // store the connection to pass to the provider
      setConnection(connection);
      // subscribe to the entities sockets
      unsubscribe.current = subscribeEntities(connection, ($entities) => {
        setEntitiesDebounce($entities);
      });
    } catch (e) {
      throw new Error(translateErr(e));
    }
    // if the url contains the auth callback url, replace the url so it doesn't contain it
    if (location.search.includes("auth_callback=1")) {
      history.replaceState(null, "", location.pathname);
    }
    return () => {
      // on unmount, unsubscribe
      if (unsubscribe.current) {
        unsubscribe.current();
        unsubscribe.current = null;
      }
    };
  }, [error, getAuthOptions, hassUrl, setEntitiesDebounce]);

  useEffect(() => {
    if (!ready && !hasRequestedAuth.current) {
      try {
        authenticate();
        hasRequestedAuth.current = true;
      } catch (err) {
        hasRequestedAuth.current = false;
        if (err instanceof Error) {
          setError(err.message);
        }
      }
    }
  }, [authenticate, ready]);

  const addRoute = useCallback((route: Route) => {
    setRoutes((routes) => {
      const exists =
        routes.find((_route) => _route.hash === route.hash) !== undefined;
      if (!exists) {
        return [...routes, route];
      }
      return routes;
    });
  }, []);

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
        routes,
        ready,
        lastUpdated,
      }}
    >
      {error === null ? children(ready) : error}
    </HassContext.Provider>
  );
}
