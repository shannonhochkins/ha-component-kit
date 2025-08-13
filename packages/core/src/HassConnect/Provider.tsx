import { useEffect, useCallback, useRef, useMemo } from "react";
// types
import type { UnsubscribeFunc } from "home-assistant-js-websocket";
// methods
import {
  subscribeEntities,
  callService as _callService,
  getStates as _getStates,
  getServices as _getServices,
  getConfig as _getConfig,
  getUser as _getUser,
  subscribeConfig,
} from "home-assistant-js-websocket";
import { isArray, snakeCase } from "lodash";
import { SnakeOrCamelDomains, DomainService, Locales, CallServiceArgs, Route, ServiceResponse } from "@typings";
import { loadTokens, clearTokens } from "./token-storage";
import { HassContext, type HassContextProps, useInternalStore } from "./HassContext";
import { useStore } from "../hooks/useStore";
import { useShallow } from "zustand/shallow";
import { handleSuspendResume, type HandleSuspendResumeOptions } from "./handleSuspendResume";
import { callApi } from "./callApi";
import { handleError, tryConnection } from "./tryConnection";

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
  /** options to provide to the handleResume functionality for the HA web socket connection */
  handleResumeOptions?: HandleSuspendResumeOptions;
}

const getAllEntities = () => useInternalStore.getState().entities;
const getConnection = () => useInternalStore.getState().connection;

export function HassProvider({
  children,
  hassUrl,
  hassToken,
  portalRoot,
  windowContext,
  renderError = (children) => children,
  handleResumeOptions,
}: HassProviderProps) {
  const entityUnsubscribe = useRef<UnsubscribeFunc | null>(null);
  const authenticated = useRef(false);
  const configUnsubscribe = useRef<UnsubscribeFunc | null>(null);
  const {
    hash: _hash,
    ready,
    error,
    cannotConnect,
    setError,
  } = useInternalStore(
    useShallow((s) => ({
      hash: s.hash,
      routes: s.routes,
      ready: s.ready, // ready is set internally in the store when we have entities (setEntities does this)
      error: s.error,
      cannotConnect: s.cannotConnect,
      auth: s.auth,
      setError: s.setError,
    })),
  );
  const getStates = useCallback(async () => {
    const connection = getConnection();
    return connection === null ? null : await _getStates(connection);
  }, []);
  const getServices = useCallback(async () => {
    const connection = getConnection();
    return connection === null ? null : await _getServices(connection);
  }, []);
  const getConfig = useCallback(async () => {
    const connection = getConnection();
    return connection === null ? null : await _getConfig(connection);
  }, []);
  const getUser = useCallback(async () => {
    const connection = getConnection();
    return connection === null ? null : await _getUser(connection);
  }, []);

  useEffect(() => {
    const { setPortalRoot } = useInternalStore.getState();
    if (portalRoot) setPortalRoot(portalRoot);
  }, [portalRoot]);

  useEffect(() => {
    const { setWindowContext } = useInternalStore.getState();
    if (windowContext) setWindowContext(windowContext);
  }, [windowContext]);

  const reset = useCallback(() => {
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
    const { setError } = useInternalStore.getState();
    try {
      reset();
      clearTokens();
      if (location) location.reload();
    } catch (err: unknown) {
      console.error("Error:", err);
      setError("Unable to log out!");
    }
  }, [reset]);

  const handleConnect = useCallback(async () => {
    const { setError, setUser, setCannotConnect, setAuth, setConnection, setEntities, setConfig, setConnectionStatus } =
      useInternalStore.getState();

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
      entityUnsubscribe.current = subscribeEntities(connection, ($entities) => {
        setEntities($entities);
      });
      configUnsubscribe.current = subscribeConfig(connection, (newConfig) => {
        setConfig(newConfig);
      });
      _getUser(connection).then((user) => {
        setUser(user);
      });
      const { onStatusChange, ...rest } = handleResumeOptions || {};
      // return the cleanup function
      return handleSuspendResume(connection, {
        suspendWhenHidden: true,
        hiddenDelayMs: 300_000, // 5 minutes
        debug: false,
        onStatusChange: (status) => {
          setConnectionStatus(status);
          onStatusChange?.(status);
        },
        ...rest,
      });
    }
  }, [hassUrl, hassToken, handleResumeOptions]);

  useEffect(() => {
    const { setHassUrl } = useInternalStore.getState();
    setHassUrl(hassUrl);
  }, [hassUrl]);

  const joinHassUrl = useCallback((path: string) => {
    const { connection } = useInternalStore.getState();
    return connection ? new URL(path, connection?.options.auth?.data.hassUrl).toString() : "";
  }, []);

  useEffect(() => {
    const { setHash } = useInternalStore.getState();
    if (location.hash === "") return;
    if (location.hash.replace("#", "") === _hash) return;
    setHash(location.hash);
  }, [_hash]);

  useEffect(() => {
    function onHashChange() {
      const { routes, setRoutes, setHash } = useInternalStore.getState();
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
  }, []);

  const addRoute = useCallback((route: Omit<Route, "active">) => {
    const { routes, setRoutes } = useInternalStore.getState();
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
  }, []);

  const getRoute = useCallback((hash: string) => {
    const routes = useInternalStore.getState().routes;
    const route = routes.find((route) => route.hash === hash);
    return route || null;
  }, []);

  const callService = useCallback(
    async <ResponseType extends object, T extends SnakeOrCamelDomains, M extends DomainService<T>, R extends boolean>({
      domain,
      service,
      serviceData,
      target: _target,
      returnResponse,
    }: CallServiceArgs<T, M, R>): Promise<R extends true ? ServiceResponse<ResponseType> : void> => {
      const { connection, ready } = useInternalStore.getState();
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
    [],
  );

  useEffect(() => {
    // on unmount, reset the store
    return () => {
      reset();
    };
  }, [reset]);

  // then wrap the whole connect routine so it’s stable too
  const connectOnce = useCallback(async () => {
    try {
      if (authenticated.current) reset();
      authenticated.current = true;
      handleResumeOptions?.onStatusChange?.("pending");
      await handleConnect();
    } catch (e) {
      const message = handleError(e);
      setError(`Unable to connect to Home Assistant, please check the URL: "${message}"`);
    }
  }, [reset, handleConnect, setError, handleResumeOptions]);

  // run it once after mount
  useEffect(() => {
    connectOnce();
  }, [connectOnce]);

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
        Unable to connect to {loadTokens(hassUrl)?.hassUrl}, refresh the page and try again, or <a onClick={logout}>Logout</a>.
      </p>,
    );
  }
  return <HassContext.Provider value={contextValue}>{error === null ? children(ready) : renderError(error)}</HassContext.Provider>;
}
