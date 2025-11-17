import { useEffect, useCallback } from "react";
import { subscribeEntities, subscribeConfig, subscribeServices } from "home-assistant-js-websocket";
import { Locales } from "@typings";
import { loadTokens } from "./token-storage";
import { InternalStore, useInternalStore, useHassProviderStore } from "./HassContext";
import { useHass } from "../hooks/useHass";
import { useShallow } from "zustand/shallow";
import { handleSuspendResume, type HandleSuspendResumeOptions } from "./handleSuspendResume";
import { handleError, tryConnection } from "./tryConnection";
import {
  subscribeAreaRegistry,
  subscribeEntityRegistryDisplay,
  subscribeDeviceRegistry,
  subscribeFloorRegistry,
  subscribeFrontendUserData,
  getUserLocaleLanguage,
  type SensorNumericDeviceClasses,
} from "@core";
import { subscribeUser, subscribeUsers } from "@utils/subscribe/user";

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

// Track if a connection attempt for the current hassUrl has already started in this page lifecycle.
// Using a ref avoids any need for timers and is Strict Mode safe.
const attemptedUrls = new Set<string>();


export function HassProvider({
  children,
  hassUrl,
  hassToken,
  portalRoot,
  windowContext,
  renderError = (children) => children,
  handleResumeOptions,
}: HassProviderProps) {
  // provider-level state & subscription helpers from dedicated store
  const addSubscription = useHassProviderStore((s) => s.addSubscription);
  const setAuthenticated = useHassProviderStore((s) => s.setAuthenticated);
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

  useEffect(() => {
    const { setPortalRoot } = useInternalStore.getState();
    if (portalRoot) setPortalRoot(portalRoot);
  }, [portalRoot]);

  useEffect(() => {
    const { setWindowContext } = useInternalStore.getState();
    if (windowContext) setWindowContext(windowContext);
  }, [windowContext]);

  const handleConnect = useCallback(async () => {
    const {
      setError,
      setUser,
      setCannotConnect,
      setAuth,
      setConnection,
      setEntities,
      setConfig,
      setConnectionStatus,
      setAreas,
      setDevices,
      setFloors,
      setEntitiesRegistryDisplay,
      setServices,
      setUsers,
      setLocale,
      setSensorNumericDeviceClasses,
    } = useInternalStore.getState();

    // this will trigger on first mount
    const response = await tryConnection(hassUrl, hassToken);
    if (response.type === "error") {
      setAuthenticated(false);
      setError(response.error);
    } else if (response.type === "failed") {
      setAuthenticated(false);
      setCannotConnect(true);
    } else if (response.type === "success") {
      const { connection, auth } = response;
      // store a reference to the authentication object
      setAuth(auth);
      // store the connection to pass to the provider
      setConnection(connection);
      addSubscription(
        "entities",
        subscribeEntities(connection, ($entities) => {
          setEntities($entities);
        }),
      );
      addSubscription(
        "entity_registry_display",
        subscribeEntityRegistryDisplay(connection, (entityReg) => {
          const entitiesRegistryDisplay: InternalStore["entitiesRegistryDisplay"] = {};
          for (const entity of entityReg.entities) {
            entitiesRegistryDisplay[entity.ei] = {
              entity_id: entity.ei,
              device_id: entity.di,
              area_id: entity.ai,
              labels: entity.lb,
              translation_key: entity.tk,
              platform: entity.pl,
              entity_category: entity.ec !== undefined ? entityReg.entity_categories[entity.ec] : undefined,
              has_entity_name: entity.hn,
              name: entity.en,
              icon: entity.ic,
              hidden: entity.hb,
              display_precision: entity.dp,
            };
          }
          setEntitiesRegistryDisplay(entitiesRegistryDisplay);
        }),
      );
      addSubscription(
        "areas",
        subscribeAreaRegistry(connection, (areaReg) => {
          const areas: InternalStore["areas"] = {};
          for (const area of areaReg) {
            areas[area.area_id] = area;
          }
          setAreas(areas);
        }),
      );
      addSubscription(
        "devices",
        subscribeDeviceRegistry(connection, (deviceReg) => {
          const devices: InternalStore["devices"] = {};
          for (const device of deviceReg) {
            devices[device.id] = device;
          }
          setDevices(devices);
        }),
      );
      addSubscription(
        "floors",
        subscribeFloorRegistry(connection, (floorReg) => {
          const floors: InternalStore["floors"] = {};
          for (const floor of floorReg) {
            floors[floor.floor_id] = floor;
          }
          setFloors(floors);
        }),
      );
      addSubscription(
        "config",
        subscribeConfig(connection, (newConfig) => {
          setConfig(newConfig);
        }),
      );

      addSubscription(
        "current_user",
        subscribeUser(connection, (user) => {
          setUser(user);
        }),
      );

      addSubscription(
        "services",
        subscribeServices(connection, (services) => {
          setServices(services);
        }),
      );

      addSubscription(
        "users",
        subscribeUsers(connection, (users) => {
          setUsers(users);
        }),
      );

      addSubscription(
        "language",
        await subscribeFrontendUserData(connection, "language", (data) => {
          if (data.value) {
            const language = getUserLocaleLanguage(data.value);
            setLocale({
              ...data.value,
              language,
            });
          } else {
            setLocale(data.value);
          }
        }),
      );

      connection
        .sendMessagePromise<SensorNumericDeviceClasses>({
          type: "sensor/numeric_device_classes",
        })
        .then((sensorNumericDeviceClasses) => {
          // once we have the device classes, we are ready
          setSensorNumericDeviceClasses(sensorNumericDeviceClasses.numeric_device_classes);
        });

      const { onStatusChange, ...rest } = handleResumeOptions || {};
      // return the cleanup function
      const resumeCleanup = handleSuspendResume(connection, {
        suspendWhenHidden: true,
        hiddenDelayMs: 300_000, // 5 minutes
        debug: false,
        onStatusChange: (status) => {
          setConnectionStatus(status);
          onStatusChange?.(status);
        },
        ...rest,
      });
      addSubscription("resume", resumeCleanup);
    }
  }, [hassUrl, hassToken, handleResumeOptions, addSubscription, setAuthenticated]);

  useEffect(() => {
    const { setHassUrl } = useInternalStore.getState();
    setHassUrl(hassUrl);
  }, [hassUrl]);

  useEffect(() => {
    const { setHash } = useInternalStore.getState();
    if (location.hash === "") return;
    if (location.hash.replace("#", "") === _hash) return;
    setHash(location.hash);
  }, [_hash]);

  useEffect(() => {
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  // Standard unmount cleanup; Strict Mode double-invocation will call this twice but second time state already cleared.
  useEffect(() => () => useHassProviderStore.getState().reset(), []);

  // then wrap the whole connect routine so it’s stable too
  const connectOnce = useCallback(async () => {
    if (attemptedUrls.has(hassUrl)) return;
    attemptedUrls.add(hassUrl);
    try {
      if (useHassProviderStore.getState().authenticated && useInternalStore.getState().hassUrl !== hassUrl) {
        useHassProviderStore.getState().reset();
      }
      setAuthenticated(true);
      handleResumeOptions?.onStatusChange?.("pending");
      await handleConnect();
    } catch (e) {
      const message = handleError(e);
      setError(`Unable to connect to Home Assistant, please check the URL: "${message}"`);
    }
  }, [handleConnect, setError, handleResumeOptions, hassUrl, setAuthenticated]);

  // run it once after mount
  useEffect(() => {
    connectOnce();
  }, [connectOnce]);

  if (cannotConnect) {
    return renderError(
      <p>
        Unable to connect to {loadTokens(hassUrl)?.hassUrl}, refresh the page and try again, or <a onClick={useHass.getState().helpers.logout}>Logout</a>.
      </p>,
    );
  }
  return error === null ? children(ready) : renderError(error);
}

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