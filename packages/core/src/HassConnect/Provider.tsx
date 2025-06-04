import { useEffect, useCallback, useRef, useMemo } from "react";
// types
import type { Connection, getAuthOptions as AuthOptions, Auth, UnsubscribeFunc } from "home-assistant-js-websocket";
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
  subscribeConfig,
  entitiesColl,
} from "home-assistant-js-websocket";
import { isArray, snakeCase } from "lodash";
import { SnakeOrCamelDomains, DomainService, Locales, CallServiceArgs, Route, ServiceResponse } from "@typings";
import { saveTokens, loadTokens, clearTokens } from "./token-storage";
import { useDebouncedCallback } from "use-debounce";
import { HassContext, type HassContextProps, useStore } from "./HassContext";
import { useShallow } from "zustand/shallow";

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
  /** Will tell the various features like breakpoints, modals and resize events which window to match media on, if serving within an iframe it'll potentially be running in the wrong window */
  windowContext?: Window;
  /** A method to render any error states with a react wrapper of your choosing, useful if you want to change styles */
  renderError?: (children: React.ReactNode) => React.ReactNode;
}

function handleError(err: number | string | Error | unknown, hassToken?: string): string {
  const getMessage = () => {
    switch (err) {
      case ERR_INVALID_AUTH:
        return `ERR_INVALID_AUTH: Invalid authentication. ${hassToken ? 'Check your "Long-Lived Access Token".' : ""}`;
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
  const hasHassConnection = !!getInheritedConnection();
  const providedToken = !!hassToken;
  // when we have a hass connection, we don't need to validate the tokens
  // so removing the tokens if values are different and we have a connection are not needed.
  const savedTokens = !!loadTokens(hassUrl, false);

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
  const connectionType = determineConnectionType(hassUrl, hassToken);

  if (connectionType === "inherited-auth") {
    try {
      // if we've hit this connect type, the connection will be available
      const { auth, conn } = (await getInheritedConnection()) as { conn: Connection; auth: Auth };
      return {
        type: "success",
        connection: conn,
        auth: auth,
      };
    } catch (e) {
      const message = handleError(e, hassToken);
      return {
        type: "error",
        error: message,
      };
    }
  }
  if (connectionType === "provided-token" && hassToken) {
    try {
      const auth = await createLongLivedTokenAuth(hassUrl, hassToken);
      const connection = await createConnection({ auth });
      return {
        type: "success",
        connection,
        auth,
      };
    } catch (e) {
      const message = handleError(e, hassToken);
      return {
        type: "error",
        error: message,
      };
    }
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
      };
    }
    if (options.hassUrl.indexOf("://") === -1) {
      return {
        type: "error",
        error: "Please enter your full URL, including the protocol part (https://).",
      };
    }
    try {
      new URL(options.hassUrl);
    } catch (err: unknown) {
      console.error("Error:", err);
      return {
        type: "error",
        error: "Invalid URL",
      };
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
      error: handleError(err, hassToken),
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
      error: handleError(err, hassToken),
    };
  }
  return {
    type: "success",
    connection,
    auth,
  };
};

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
    const connection = useStore.getState().connection;
    const hassUrl = useStore.getState().hassUrl;
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
    console.error("API Error:", e);
    return {
      status: "error",
      data: `API Request failed for endpoint "${endpoint}", follow instructions here: https://shannonhochkins.github.io/ha-component-kit/?path=/docs/core-hooks-usehass-hass-callapi--docs.`,
    };
  }
}

const getAllEntities = () => useStore.getState().entities;

export function HassProvider({
  children,
  hassUrl,
  hassToken,
  portalRoot,
  windowContext,
  renderError = (children) => children,
}: HassProviderProps) {
  const entityUnsubscribe = useRef<UnsubscribeFunc | null>(null);
  const authenticated = useRef(false);
  const configUnsubscribe = useRef<UnsubscribeFunc | null>(null);
  const {
    hash: _hash,
    routes,
    ready,
    error,
    cannotConnect,
    connection,
    setRoutes,
    setHassUrl,
    setHash,
    setError,
    setPortalRoot,
    setWindowContext,
  } = useStore(
    useShallow((s) => ({
      hash: s.hash,
      routes: s.routes,
      ready: s.ready, // ready is set internally in the store when we have entities (setEntities does this)
      error: s.error,
      cannotConnect: s.cannotConnect,
      auth: s.auth,
      connection: s.connection,
      setHash: s.setHash,
      setRoutes: s.setRoutes,
      setHassUrl: s.setHassUrl,
      setError: s.setError,
      setPortalRoot: s.setPortalRoot,
      setWindowContext: s.setWindowContext,
    })),
  );
  const _connectionRef = useRef<Connection | null>(null);

  const getStates = useCallback(async () => (connection === null ? null : await _getStates(connection)), [connection]);
  const getServices = useCallback(async () => (connection === null ? null : await _getServices(connection)), [connection]);
  const getConfig = useCallback(async () => (connection === null ? null : await _getConfig(connection)), [connection]);
  const getUser = useCallback(async () => (connection === null ? null : await _getUser(connection)), [connection]);

  useEffect(() => {
    if (portalRoot) setPortalRoot(portalRoot);
  }, [portalRoot, setPortalRoot]);

  useEffect(() => {
    if (windowContext) setWindowContext(windowContext);
  }, [windowContext, setWindowContext]);

  const reset = useCallback((partial?: boolean) => {
    const { setAuth, setUser, setCannotConnect, setConfig, setConnection, setEntities, setError, setReady, setRoutes } =
      useStore.getState();
    // when the hassUrl changes, reset some properties and re-authenticate
    // if we're a partial reset, we may have lost the connection, but auth may still be valid
    if (!partial) {
      setAuth(null);
      setRoutes([]);
      setReady(false);
    }
    setConnection(null);
    _connectionRef.current = null;
    setEntities({});
    setConfig(null);
    setError(null);
    setCannotConnect(false);
    setUser(null);
    authenticated.current = false;
    if (configUnsubscribe.current) {
      configUnsubscribe.current();
      configUnsubscribe.current = null;
    }
    if (entityUnsubscribe.current) {
      entityUnsubscribe.current();
      entityUnsubscribe.current = null;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      reset();
      clearTokens();
      if (location) location.reload();
    } catch (err: unknown) {
      console.error("Error:", err);
      setError("Unable to log out!");
    }
  }, [reset, setError]);

  const handleConnect = useCallback(async () => {
    const { setError, setUser, setCannotConnect, setAuth, setConnection, setEntities, setConfig } = useStore.getState();

    // this will trigger on first mount
    const response = await tryConnection(hassUrl, hassToken);
    if (response.type === "error") {
      authenticated.current = false;
      setError(response.error);
    } else if (response.type === "failed") {
      authenticated.current = false;
      setCannotConnect(true);
    } else if (response.type === "success") {
      const { connection, auth } = response;
      // store a reference to the authentication object
      setAuth(auth);
      // store the connection to pass to the provider
      setConnection(connection);
      connection.addEventListener("reconnect-error", () => {
        console.error("WebSocket - Reconnect error.");
      });
      connection.addEventListener("disconnected", () => {
        console.error("WebSocket - Disconnected.");
      });
      function suspendUntil(eventName: "resume" | "visibilitychange") {
        console.warn(`Tab ${eventName === "resume" ? "frozen" : "hidden"}, suspending reconnect attempts.`);

        const resumePromise = new Promise<void>((resolve) => {
          const resumeHandler = () => {
            console.warn(`Tab ${eventName === "resume" ? "resumed" : "visible"} again, resuming reconnect attempts.`);
            document.removeEventListener(eventName, resumeHandler);
            resolve(); // lift the suspension
            try {
              // as suspend can drop messages in the queue, let's just at least
              // refresh the entities so we have the latest state
              const coll = entitiesColl(connection);
              const entities = coll.state;
              setEntities(entities);
            } catch (e) {
              console.error("Error refreshing entities:", e);
            }
          };
          document.addEventListener(eventName, resumeHandler, { once: true });
        });
        // block future retries, this will keep all current messages in a queue until it resumes
        connection.suspendReconnectUntil(resumePromise);
        connection.suspend(); // close current socket
      }

      /* If the tab is switching, lets determine if we should maintain the connection */
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
          suspendUntil("visibilitychange");
        }
      });

      /* ---------- 2. Frozen / resumed tab (Chrome, Edge, Samsung) ---------- */
      document.addEventListener("freeze", () => {
        console.warn("Tab frozen, suspending reconnect attempts until resume event is received.");
        return suspendUntil("resume");
      }); // wait for "resume"
      entityUnsubscribe.current = subscribeEntities(connection, ($entities) => {
        setEntities($entities);
      });
      configUnsubscribe.current = subscribeConfig(connection, (newConfig) => {
        setConfig(newConfig);
      });
      _connectionRef.current = connection;
      _getUser(connection).then((user) => {
        setUser(user);
      });
    }
  }, [hassUrl, hassToken]);

  useEffect(() => {
    setHassUrl(hassUrl);
  }, [hassUrl, setHassUrl]);

  const joinHassUrl = useCallback(
    (path: string) => {
      return connection ? new URL(path, connection?.options.auth?.data.hassUrl).toString() : "";
    },
    [connection],
  );

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
    return () => {
      reset();
    };
  }, [reset]);

  const debounceConnect = useDebouncedCallback(
    async () => {
      try {
        if (authenticated.current) {
          reset();
        }
        authenticated.current = true;
        await handleConnect();
      } catch (e) {
        const message = handleError(e);
        setError(`Unable to connect to Home Assistant, please check the URL: "${message}"`);
      }
    },
    25,
    {
      leading: true,
      trailing: false,
    },
  );

  useEffect(() => {
    // authenticate with ha
    debounceConnect();
  }, [debounceConnect]);

  const contextValue = useMemo<HassContextProps>(
    () => ({
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
      callService: callService as HassContextProps["callService"],
      joinHassUrl,
    }),
    [logout, addRoute, getRoute, getStates, getServices, getConfig, getUser, callService, joinHassUrl],
  );

  if (cannotConnect) {
    return renderError(
      <p>
        Unable to connect to ${loadTokens(hassUrl)!.hassUrl}, refresh the page and try again, or <a onClick={logout}>Logout</a>.
      </p>,
    );
  }
  return <HassContext.Provider value={contextValue}>{error === null ? children(ready) : renderError(error)}</HassContext.Provider>;
}
