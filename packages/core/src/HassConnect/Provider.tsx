import { useEffect, useCallback, useRef } from "react";
// types
import type { Connection, HassConfig, getAuthOptions as AuthOptions, Auth, UnsubscribeFunc } from "home-assistant-js-websocket";
// methods
import {
  getAuth,
  createLongLivedTokenAuth,
  createConnection,
  subscribeEntities,
  callService as _callService,
  getStates as _getStates,
  getServices as _getServices,
  getConfig as _getConfig,
  getUser as _getUser,
  ERR_HASS_HOST_REQUIRED,
  ERR_CONNECTION_LOST,
  ERR_CANNOT_CONNECT,
  ERR_INVALID_AUTH,
  ERR_INVALID_HTTPS_TO_HTTP,
} from "home-assistant-js-websocket";
import { isArray, snakeCase } from "lodash";
import { SnakeOrCamelDomains, DomainService, Locales, CallServiceArgs, Route, ServiceResponse } from "@typings";
import { saveTokens, loadTokens, clearTokens } from "./token-storage";
import { useDebouncedCallback } from "use-debounce";
import locales from "../hooks/useLocale/locales";
import { updateLocales } from "../hooks/useLocale";
import { HassContext, type HassContextProps, useStore } from "./HassContext";

export interface HassProviderProps {
  /** components to render once authenticated, this accepts a child function which will pass if it is ready or not */
  children: (ready: boolean) => React.ReactNode;
  /** the home assistant url */
  hassUrl: string;
  /** if you provide a hassToken you will bypass the login screen altogether - @see https://developers.home-assistant.io/docs/auth_api/#long-lived-access-token */
  hassToken?: string;
  /** the language of the UI to use, this will also control the values used within the `localize` function or `useLocale` / `useLocales` hooks, by default this is retrieved from your home assistant instance. */
  locale?: Locales;
  /** location to render portals @default document.body */
  portalRoot?: HTMLElement;
}

function handleError(err: number | string | Error | unknown): string {
  const getMessage = () => {
    switch (err) {
      case ERR_INVALID_AUTH:
        return "ERR_INVALID_AUTH: Invalid authentication.";
      case ERR_CANNOT_CONNECT:
        return "ERR_CANNOT_CONNECT: Unable to connect";
      case ERR_CONNECTION_LOST:
        return "ERR_CONNECTION_LOST: Lost connection to home assistant.";
      case ERR_HASS_HOST_REQUIRED:
        return "ERR_HASS_HOST_REQUIRED: Please enter a Home Assistant URL.";
      case ERR_INVALID_HTTPS_TO_HTTP:
        return 'ERR_INVALID_HTTPS_TO_HTTP: Cannot connect to Home Assistant instances over "http://".';
      default:
        return null;
    }
  };
  const message = getMessage();
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

type ConnectionType = "auth-callback" | "user-request" | "saved-tokens" | "inherited-auth" | "provided-token";

function getInheritedConnection(): typeof window.hassConnection | undefined {
  try {
    return window.top?.hassConnection;
  } catch (e) {
    console.error("Error getting inherited connection", e);
    return undefined;
  }
}

function determineConnectionType(hassUrl: string, hassToken?: string): ConnectionType {
  const isAuthCallback = location && location.search.includes("auth_callback=1");
  const hasHassConnection = getInheritedConnection() !== undefined;
  const providedToken = hassToken !== undefined;
  const savedTokens = loadTokens(hassUrl) !== null;
  
  switch (true) {
    case isAuthCallback:
      return "auth-callback";
    case hasHassConnection:
      return "inherited-auth";
    case providedToken:
      return "provided-token";
    case savedTokens:
      return "saved-tokens";
    default:
      return "user-request";
  }
}

const tryConnection = async (hassUrl: string, hassToken?: string): Promise<ConnectionResponse> => {
  const connectionType = determineConnectionType(hassUrl);

  if (connectionType === 'inherited-auth') {
    const connection = await getInheritedConnection();
    if (connection) {
      return {
        type: "success",
        connection: connection.conn,
        auth: connection.auth,
      };
    }
  }
  if (connectionType === 'provided-token' && hassToken) {
    const auth = await createLongLivedTokenAuth(hassUrl, hassToken);
    const connection = await createConnection({ auth });
    return {
      type: "success",
      connection,
      auth,
    };
  }

  const options: AuthOptions = {
    saveTokens,
    loadTokens: () => Promise.resolve(loadTokens(hassUrl)),
  };

  if (hassUrl && connectionType === "user-request") {
    options.hassUrl = hassUrl;
    if (options.hassUrl === "") {
      return {
        type: "error",
        error: "Please enter a Home Assistant URL.",
      }
    }
    if (options.hassUrl.indexOf("://") === -1) {
      return {
        type: "error",
        error: "Please enter your full URL, including the protocol part (https://).",
      }
    }
    try {
      new URL(options.hassUrl);
    } catch (err: unknown) {
      console.log("Error:", err);
      return {
        type: "error",
        error: "Invalid URL",
      }
    }
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
      return tryConnection(hassUrl, hassToken);
    }
    if (connectionType === "saved-tokens" && err === ERR_CANNOT_CONNECT) {
      return {
        type: "failed",
        cannotConnect: true,
      };
    }
    return {
      type: "error",
      error: handleError(err),
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
    if (connectionType === "saved-tokens") {
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
      error: handleError(err),
    };
  }
  return {
    type: "success",
    connection,
    auth,
  };
};

export function HassProvider({ children, hassUrl, hassToken, locale, portalRoot }: HassProviderProps) {
  const entityUnsubscribe = useRef<UnsubscribeFunc | null>(null);
  const authenticated = useRef(false);
  const fetchedConfig = useRef(false);
  const setHash = useStore((store) => store.setHash);
  const _hash = useStore((store) => store.hash);
  const routes = useStore((store) => store.routes);
  const setRoutes = useStore((store) => store.setRoutes);
  const connection = useStore((store) => store.connection);
  const setConnection = useStore((store) => store.setConnection);
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
  const setPortalRoot = useStore((store) => store.setPortalRoot);
  const setLocales = useStore((store) => store.setLocales);

  useEffect(() => {
    if (portalRoot) setPortalRoot(portalRoot);
  }, [portalRoot, setPortalRoot]);

  const reset = useCallback(() => {
    // when the hassUrl changes, reset some properties and re-authenticate
    setAuth(null);
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
      console.log("Error:", err);
      setError("Unable to log out!");
    }
  }, [reset, setError]);

  const handleConnect = useCallback(async () => {
    // this will trigger on first mount
    const connectionResponse = await tryConnection(hassUrl, hassToken);
    if (connectionResponse.type === "error") {
      authenticated.current = false;
      setError(connectionResponse.error);
    } else if (connectionResponse.type === "failed") {
      authenticated.current = false;
      setCannotConnect(true);
    } else if (connectionResponse.type === "success") {
      // store a reference to the authentication object
      setAuth(connectionResponse.auth);
      // store the connection to pass to the provider
      setConnection(connectionResponse.connection);
      authenticated.current = true;
    }
  }, [hassUrl, hassToken, setError, setAuth, setConnection, setCannotConnect]);

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
      console.log("Error:", e);
      return {
        status: "error",
        data: `API Request failed for endpoint "${endpoint}", follow instructions here: https://shannonhochkins.github.io/ha-component-kit/?path=/docs/hooks-usehass-callapi--docs.`,
      };
    }
  }

  const fetchLocale = useCallback(
    async (config: HassConfig | null): Promise<Record<string, string>> => {
      const match = locales.find(({ code }) => code === (locale ?? config?.language));
      if (!match) {
        throw new Error(
          `Locale "${locale ?? config?.language}" not found, available options are "${locales.map(({ code }) => `${code}`).join(", ")}"`,
        );
      } else {
        return await match.fetch();
      }
    },
    [locale],
  );

  useEffect(() => {
    if (!locale) return;
    // purposely sending null for the config object as we're fetching a different language specified by the user
    fetchLocale(null)
      .then((locales) => {
        updateLocales(locales);
        setLocales(locales);
      })
      .catch((e) => {
        setError(`Error retrieving translations from Home Assistant: ${e?.message ?? e}`);
      });
  }, [locale, fetchLocale, setLocales, setError]);

  useEffect(() => {
    if (config === null && !fetchedConfig.current && connection !== null) {
      fetchedConfig.current = true;
      getConfig()
        .then((config) => {
          fetchLocale(config)
            .then((locales) => {
              // purposely setting config here to delay the rendering process of the application until locales are retrieved
              setConfig(config);
              updateLocales(locales);
              setLocales(locales);
            })
            .catch((e) => {
              setError(`Error retrieving translations from Home Assistant: ${e?.message ?? e}`);
            });
        })
        .catch((e) => {
          fetchedConfig.current = false;
          setError(`Error retrieving configuration from Home Assistant: ${e?.message ?? e}`);
        });
    }
  }, [config, connection, setLocales, fetchLocale, getConfig, setConfig, setError]);

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
          } satisfies Route,
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
    async <ResponseType extends object, T extends SnakeOrCamelDomains, M extends DomainService<T>, R extends boolean>({
      domain,
      service,
      serviceData,
      target: _target,
      returnResponse,
    }: CallServiceArgs<T, M, R>): Promise<R extends true ? ServiceResponse<ResponseType> : void> => {
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
          const result = await _callService(
            connection,
            snakeCase(domain),
            snakeCase(service),
            // purposely cast here as we know it's correct
            serviceData as object,
            target,
            returnResponse,
          );
          if (returnResponse) {
            // Return the result if returnResponse is true
            return result as R extends true ? ServiceResponse<ResponseType> : never;
          }
          // Otherwise, return void
          return undefined as R extends true ? never : void;
        } catch (e) {
          // TODO - raise error to client here
          console.log("Error:", e);
        }
      }
      return undefined as R extends true ? never : void;
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
    try {
      if (authenticated.current) return;
      authenticated.current = true;
      await handleConnect();
    } catch (e) {
      setError(`Unable to connect to Home Assistant, please check the URL: "${(e as Error)?.message ?? e}"`);
    }
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
        // cast here we don't have to redefine all the overloads, might fix later
        callService: callService as HassContextProps["callService"],
        joinHassUrl,
      }}
    >
      {error === null ? children(ready) : error}
    </HassContext.Provider>
  );
}
