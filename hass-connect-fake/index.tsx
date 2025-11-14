import { useCallback, useMemo, useRef, useEffect, type ReactNode } from "react";
import type { HassEntities, HassEntity, HassConfig, Auth, HaWebSocket, MessageBase } from "home-assistant-js-websocket";
import { Connection } from "home-assistant-js-websocket";
import type {
  DomainService,
  SnakeOrCamelDomains,
  Route,
  CallServiceArgs,
  HassContextProps,
  ServiceResponse,
  AuthUser,
  ExtEntityRegistryEntry,
  InternalStore,
  EntityRegistryDisplayEntry,
} from "@hakit/core";
import { isArray } from "lodash";
import { useShallow } from "zustand/shallow";
import { useStore, HassContext, updateLocales, locales, NumberFormat, TimeFormat, DateFormat, FirstWeekday, TimeZone } from "@hakit/core";
import { entities as ENTITIES } from "./mocks/mockEntities";
import fakeApi from "./mocks/fake-call-service";
import type { ServiceArgs } from "./mocks/fake-call-service/types";
import mockHistory from "./mock-history";
import { mockCallApi } from "./mocks/fake-call-api";
import reolinkSnapshot from "./assets/reolink-snapshot.jpg";
import { logs } from "./mocks/mockLogs";
import { dailyForecast, hourlyForecast } from "./mocks/mockWeather";
interface HassProviderProps {
  children: (ready: boolean) => ReactNode;
  hassUrl: string;
  throttle?: number;
}

let fakeConfig: HassConfig = {
  latitude: -33.25779010313883,
  longitude: 151.4821529388428,
  elevation: 0,
  unit_system: {
    length: "km",
    accumulated_precipitation: "mm",
    mass: "g",
    pressure: "Pa",
    temperature: "°C",
    volume: "L",
    wind_speed: "m/s",
  },
  location_name: "Fake Home",
  time_zone: "Australia/Brisbane",
  components: [],
  config_dir: "/config",
  allowlist_external_dirs: [],
  allowlist_external_urls: [],
  radius: 1,
  version: "2023.8.2",
  config_source: "storage",
  safe_mode: false,
  recovery_mode: false,
  state: "RUNNING",
  external_url: null,
  internal_url: null,
  currency: "AUD",
  country: "AU",
  language: "en",
};

const fakeAuth = {
  data: {
    hassUrl: "",
    clientId: null,
    expires: 0,
    refresh_token: "",
    access_token: "",
    expires_in: 0,
  },
  wsUrl: "",
  accessToken: "",
  expired: false,
  refreshAccessToken: function (): Promise<void> {
    throw new Error("Function not implemented.");
  },
  revoke: function (): Promise<void> {
    throw new Error("Function not implemented.");
  },
} satisfies Auth;

class MockWebSocket {
  addEventListener() {}
  removeEventListener() {}
  send() {}
  close() {}
}

let renderTemplatePrevious = "on";

class MockConnection extends Connection {
  private _mockListeners: { [event: string]: ((data: unknown) => void)[] };
  private _mockResponses: {
    [type: string]: object | ((message: object) => object) | undefined;
  };

  constructor() {
    super(new MockWebSocket() as unknown as HaWebSocket, {
      setupRetry: 0,
      createSocket: async () => new MockWebSocket() as unknown as HaWebSocket,
    });
    this._mockListeners = {};
    this._mockResponses = {};
  }

  // hass events
  async subscribeEvents<EventType>(eventCallback: (ev: EventType) => void, eventType?: string) {
    if (!eventType) {
      throw new Error("mock all events not implemented");
    }
    if (!(eventType in this._mockListeners)) {
      this._mockListeners[eventType] = [];
    }

    this._mockListeners[eventType].push(eventCallback as (ev: unknown) => void);
    return () => Promise.resolve();
  }

  mockEvent(event: string, data: object) {
    (this._mockListeners[event] ?? []).forEach((cb) => cb(data));
  }

  mockResponse(type: string, data: object) {
    this._mockResponses[type] = data;
  }

  async subscribeMessage<Result>(
    callback: (result: Result) => void,
    params?: {
      type: string;
      entity_ids?: string[];
      start_time?: string;
      forecast_type?: string;
      end_time?: string;
    },
  ): Promise<() => Promise<void>> {
    if (params && params.type === "logbook/event_stream" && params.start_time && params.end_time) {
      const isoStartTime = new Date(params.start_time);
      const isoEndTime = new Date(params.end_time);

      const unixStartTime = isoStartTime.getTime() / 1000;
      const unixEndTime = isoEndTime.getTime() / 1000;
      const newEvents = {
        ...logs,
        start_time: unixStartTime,
        end_time: unixEndTime,
        events: logs.events.map((event) => ({
          ...event,
          entity_id: params?.entity_ids ? params?.entity_ids[0] : null,
          when: unixStartTime + Math.random() * (unixEndTime - unixStartTime),
        })),
      };
      callback(newEvents as Result);
    } else if (params && params.type === "weather/subscribe_forecast") {
      if (params.forecast_type === "daily") {
        callback(dailyForecast as Result);
      }
      if (params.forecast_type === "hourly") {
        callback(hourlyForecast as Result);
      }
    } else if (params && params.type === "render_template") {
      if (renderTemplatePrevious === "on") {
        callback({
          result: "The entity is on!!",
        } as Result);
      } else {
        callback({
          result: "The entity is not on!!",
        } as Result);
      }
    } else {
      callback(mockHistory as Result);
    }
    return () => Promise.resolve();
  }
  async sendMessagePromise<Result>(message: MessageBase): Promise<Result> {
    if (message.type === "get_config") {
      return fakeConfig as Result;
    }
    // a mock for the proxy image for the camera
    if (message.path && message.path.includes("camera_proxy")) {
      return {
        path: `${reolinkSnapshot}?`,
      } as Result;
    }
    if (message.type === "config/entity_registry/get") {
      const extDevice: ExtEntityRegistryEntry = {
        entity_id: message.entity_id,
        capabilities: {},
        original_icon: "mdi:camera",
        device_class: "camera",
        original_device_class: "camera",
        aliases: ["Fake Camera"],
        options: {},
        categories: {},
        id: "01H4JAXGF1RTA2MJGGPGAGM7VD",
        name: "Fake Camera",
        icon: "",
        platform: "",
        config_entry_id: "",
        device_id: "",
        area_id: "",
        disabled_by: null,
        hidden_by: null,
        has_entity_name: true,
        original_name: "",
        unique_id: "",
        translation_key: "",
        config_subentry_id: null,
        labels: [],
        entity_category: null,
        created_at: 0,
        modified_at: 0,
      };
      return extDevice as Result;
    }
    if (message.type === "config/auth/list") {
      const users: AuthUser[] = [
        {
          id: "123",
          name: "Joe Bloggs",
          is_active: true,
          is_owner: true,
          system_generated: false,
          credentials: [],
          group_ids: [],
        },
        {
          id: "456",
          name: "Jane Doe",
          is_active: true,
          is_owner: false,
          system_generated: false,
          credentials: [],
          group_ids: [],
        },
      ];
      return users as Result;
    }
    return null as Result;
  }
}

const originalStore = useStore.getState() as InternalStore;
// build a registry display map for every entity so hooks like useAreas/useFloors can
// resolve direct + inherited area relationships. We intentionally mix:
//  - direct area assignments
//  - indirect (via device only, area_id null)
//  - fully unassigned (no area on entity or device)
// This allows demos to showcase the synthetic "Unassigned" floor bucket and
// inheritance logic (entity.area_id || device.area_id).
const entitiesEntries = Object.entries(ENTITIES) as [string, HassEntity][];
const entitiesRegistryDisplay = entitiesEntries.reduce<Record<string, EntityRegistryDisplayEntry>>(
  (acc, [entityId, entity], index) => {
    // decide mapping pattern based on index for variety (include miscellaneous unassigned-floor area_5)
    const mod = index % 8;
    let device_id: string;
    let area_id: string | null = null;
    switch (mod) {
      case 0:
        device_id = "device_camera1";
        area_id = "area_1"; // direct assignment
        break;
      case 1:
        device_id = "device_light1";
        area_id = "area_2"; // direct assignment
        break;
      case 2:
        device_id = "device_tv1"; // inherits area_3 via device
        // area_id stays null
        break;
      case 3:
        device_id = "device_office1"; // inherits area_4 via device
        break;
      case 4:
        device_id = "device_unassigned1"; // completely unassigned
        break;
      case 5:
        device_id = "device_tv1";
        area_id = "area_3"; // direct assignment on top of device mapping
        break;
      case 6:
        device_id = "device_office1";
        area_id = "area_4"; // direct assignment
        break;
      case 7:
      default:
        device_id = "device_misc1"; // inherits area_5 (no floor)
        // area_id stays null so inheritance logic shows under Unassigned floor
        break;
    }
    acc[entityId] = {
      entity_id: entityId,
      platform: "mock",
      name: entity?.attributes?.friendly_name ?? entityId,
      device_id,
      icon: entity?.attributes?.icon ?? "",
      area_id: area_id ?? undefined, // undefined when not directly assigned
      has_entity_name: true,
      translation_key: "",
      labels: [],
      entity_category: undefined,
    };
    return acc;
  },
  {},
);

useStore.setState({
  hash: "",
  routes: [],
  entities: ENTITIES,
  config: fakeConfig,
  locale: {
    language: "en",
    number_format: NumberFormat.language,
    time_format: TimeFormat.language,
    date_format: DateFormat.language,
    time_zone: TimeZone.local,
    first_weekday: FirstWeekday.language,
  },
  floors: {
    floor_1: {
      floor_id: "floor_1",
      name: "Downstairs",
      level: 0,
      icon: null,
      aliases: [],
      created_at: 0,
      modified_at: 0,
    },
    floor_2: {
      floor_id: "floor_2",
      name: "Upstairs",
      level: 1,
      icon: null,
      aliases: [],
      created_at: 0,
      modified_at: 0,
    },
  },
  devices: {
    device_camera1: {
      config_entries: [],
      connections: [],
      id: "device_camera1",
      config_entries_subentries: {},
      identifiers: [],
      manufacturer: null,
      model: null,
      model_id: null,
      name: "Reolink Camera",
      labels: [],
      sw_version: null,
      hw_version: null,
      serial_number: null,
      via_device_id: null,
      area_id: "area_1",
      name_by_user: null,
      entry_type: null,
      disabled_by: null,
      configuration_url: null,
      primary_config_entry: null,
      created_at: 0,
      modified_at: 0,
    },
    device_light1: {
      config_entries: [],
      connections: [],
      id: "device_light1",
      config_entries_subentries: {},
      identifiers: [],
      manufacturer: null,
      model: null,
      model_id: null,
      name: "Dining Light",
      labels: [],
      sw_version: null,
      hw_version: null,
      serial_number: null,
      via_device_id: null,
      area_id: "area_2",
      name_by_user: null,
      entry_type: null,
      disabled_by: null,
      configuration_url: null,
      primary_config_entry: null,
      created_at: 0,
      modified_at: 0,
    },
    device_tv1: {
      config_entries: [],
      connections: [],
      id: "device_tv1",
      config_entries_subentries: {},
      identifiers: [],
      manufacturer: null,
      model: null,
      model_id: null,
      name: "Bedroom TV",
      labels: [],
      sw_version: null,
      hw_version: null,
      serial_number: null,
      via_device_id: null,
      area_id: "area_3",
      name_by_user: null,
      entry_type: null,
      disabled_by: null,
      configuration_url: null,
      primary_config_entry: null,
      created_at: 0,
      modified_at: 0,
    },
    device_office1: {
      config_entries: [],
      connections: [],
      id: "device_office1",
      config_entries_subentries: {},
      identifiers: [],
      manufacturer: null,
      model: null,
      model_id: null,
      name: "Office Multi Sensor",
      labels: [],
      sw_version: null,
      hw_version: null,
      serial_number: null,
      via_device_id: null,
      area_id: "area_4",
      name_by_user: null,
      entry_type: null,
      disabled_by: null,
      configuration_url: null,
      primary_config_entry: null,
      created_at: 0,
      modified_at: 0,
    },
    device_unassigned1: {
      config_entries: [],
      connections: [],
      id: "device_unassigned1",
      config_entries_subentries: {},
      identifiers: [],
      manufacturer: null,
      model: null,
      model_id: null,
      name: "Loose Device",
      labels: [],
      sw_version: null,
      hw_version: null,
      serial_number: null,
      via_device_id: null,
      area_id: null,
      name_by_user: null,
      entry_type: null,
      disabled_by: null,
      configuration_url: null,
      primary_config_entry: null,
      created_at: 0,
      modified_at: 0,
    },
    device_misc1: {
      config_entries: [],
      connections: [],
      id: "device_misc1",
      config_entries_subentries: {},
      identifiers: [],
      manufacturer: null,
      model: null,
      model_id: null,
      name: "Misc Sensor",
      labels: [],
      sw_version: null,
      hw_version: null,
      serial_number: null,
      via_device_id: null,
      area_id: "area_5",
      name_by_user: null,
      entry_type: null,
      disabled_by: null,
      configuration_url: null,
      primary_config_entry: null,
      created_at: 0,
      modified_at: 0,
    },
  },
  areas: {
    area_1: {
      area_id: "area_1",
      name: "Living Room",
      picture: `https://picsum.photos/200/300?t=${Math.random()}`,
      floor_id: "floor_1",
      created_at: 0,
      modified_at: 0,
      aliases: [],
      humidity_entity_id: null,
      icon: null,
      labels: [],
      temperature_entity_id: null,
    },
    area_2: {
      area_id: "area_2",
      name: "Kitchen",
      picture: `https://picsum.photos/200/300?t=${Math.random()}`,
      floor_id: "floor_1",
      created_at: 0,
      modified_at: 0,
      aliases: [],
      humidity_entity_id: null,
      icon: null,
      labels: [],
      temperature_entity_id: null,
    },
    area_3: {
      area_id: "area_3",
      name: "Bedroom",
      picture: `https://picsum.photos/200/300?t=${Math.random()}`,
      floor_id: "floor_2",
      created_at: 0,
      modified_at: 0,
      aliases: [],
      humidity_entity_id: null,
      icon: null,
      labels: [],
      temperature_entity_id: null,
    },
    area_4: {
      area_id: "area_4",
      name: "Office",
      picture: `https://picsum.photos/200/300?t=${Math.random()}`,
      floor_id: "floor_2",
      created_at: 0,
      modified_at: 0,
      aliases: [],
      humidity_entity_id: null,
      icon: null,
      labels: [],
      temperature_entity_id: null,
    },
    area_5: {
      area_id: "area_5",
      name: "Misc Storage",
      picture: `https://picsum.photos/200/300?t=${Math.random()}`,
      floor_id: null, // triggers synthetic Unassigned floor in useFloors
      created_at: 0,
      modified_at: 0,
      aliases: [],
      humidity_entity_id: null,
      icon: null,
      labels: [],
      temperature_entity_id: null,
    },
  },
  entitiesRegistryDisplay,
  connection: new MockConnection(),
  auth: fakeAuth,
  user: {
    id: "",
    is_admin: false,
    is_owner: false,
    name: "Joe Bloggs",
    credentials: [],
    mfa_modules: [],
  },
  // @ts-expect-error - intentional error, this method is available, but not typed
  setConfig: (config) => {
    const state = useStore.getState();
    if (state.connection && "mockEvent" in state.connection && config) {
      fakeConfig = config;
      // @ts-expect-error - this is fine, it exists on the mock connection, just not on the real Connection type
      state.connection.mockEvent("core_config_updated", config);
    }
    state.config = config;
    return state;
  },
  setEntities: (newEntities: HassEntities) => {
    // used to mock out the render_template service
    if (newEntities["light.fake_light_1"]) {
      renderTemplatePrevious = newEntities["light.fake_light_1"].state;
    }
    return originalStore.setEntities(newEntities);
  },
});

const getAllEntities = () => useStore.getState().entities;

function HassProvider({ children }: HassProviderProps) {
  const { hash: _hash, ready } = useStore(
    useShallow((s) => ({
      hash: s.hash,
      ready: s.ready, // ready is set internally in the store when we have entities (setEntities does this)
    })),
  );
  const clock = useRef<NodeJS.Timeout | null>(null);

  const callService = useCallback(
    async <ResponseType extends object, T extends SnakeOrCamelDomains, M extends DomainService<T>, R extends boolean>({
      domain,
      service,
      serviceData,
      target,
    }: CallServiceArgs<T, M, R>): Promise<R extends true ? ServiceResponse<ResponseType> : void> => {
      if (typeof target !== "string" && !isArray(target)) return undefined as R extends true ? never : void;
      const now = new Date().toISOString();
      // Okay to cast here, we know the store is an InternalStore
      const { entities, setEntities } = useStore.getState() as InternalStore;
      if (domain in fakeApi) {
        const api = fakeApi[domain as "scene"] as (params: ServiceArgs<"scene">) => boolean;
        const skip = api({
          setEntities(cb: (entities: HassEntities) => HassEntities) {
            setEntities(cb(entities));
          },
          now,
          target,
          // @ts-expect-error - don't know domain
          service,
          // @ts-expect-error - don't know domain
          serviceData,
        });
        if (!skip) return undefined as R extends true ? never : void;
      }
      if (typeof target !== "string") return undefined as R extends true ? never : void;
      const dates = {
        last_changed: now,
        last_updated: now,
      };
      switch (service) {
        case "turn_on":
        case "turnOn":
          {
            const attributes = {
              ...entities[target].attributes,
              ...(serviceData || {}),
            };
            setEntities({
              ...entities,
              [target]: {
                ...entities[target],
                attributes: {
                  ...attributes,
                },
                ...dates,
                state: "on",
              },
            });
          }
          break;
        case "turn_off":
        case "turnOff":
          setEntities({
            ...entities,
            [target]: {
              ...entities[target],
              attributes: {
                ...entities[target].attributes,
                ...(serviceData || {}),
              },
              ...dates,
              state: "off",
            },
          });
          break;
        case "toggle":
          setEntities({
            ...entities,
            [target]: {
              ...entities[target],
              attributes: {
                ...entities[target].attributes,
                ...(serviceData || {}),
              },
              ...dates,
              state: entities[target].state === "on" ? "off" : "on",
            },
          });
          break;
        default:
          setEntities({
            ...entities,
            [target]: {
              ...entities[target],
              ...dates,
            },
          });
          break;
      }
      return undefined as R extends true ? never : void;
    },
    [],
  );

  useEffect(() => {
    // we intentionally cast here, the actual value is an InternalStore, we just have it typed as a UseStoreHook to avoid consumers
    const { setEntities } = useStore.getState() as InternalStore;
    if (clock.current) clearInterval(clock.current);
    clock.current = setInterval(() => {
      const now = new Date();
      const formatted = now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" });
      const dates = {
        last_changed: now.toISOString(),
        last_updated: now.toISOString(),
      };
      const entities = useStore.getState().entities;
      if (formatted !== entities["sensor.time"].state) {
        setEntities({
          ...entities,
          "sensor.time": {
            ...entities["sensor.time"],
            ...dates,
            state: formatted,
          },
        });
      }
    }, 125);
    return () => {
      if (clock.current) clearInterval(clock.current);
    };
  }, []);

  const addRoute = useCallback((route: Omit<Route, "active">) => {
    const { setRoutes, routes } = useStore.getState();
    const exists = routes.find((_route) => _route.hash === route.hash) !== undefined;
    if (!exists) {
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
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const { setHash } = useStore.getState();
    if (location.hash === "") return;
    if (location.hash.replace("#", "") === _hash) return;
    setHash(location.hash);
  }, [_hash]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    function onHashChange() {
      const { setRoutes, setHash, routes } = useStore.getState();
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

  const joinHassUrl = useCallback((path: string) => path, []);

  const getRoute = useCallback((hash: string) => {
    const routes = useStore.getState().routes;
    const route = routes.find((route) => route.hash === hash);
    return route || null;
  }, []);
  const callApi = useCallback(async function <T>(endpoint: string): Promise<
    | {
        data: T;
        status: "success";
      }
    | {
        data: string;
        status: "error";
      }
  > {
    return (await mockCallApi(endpoint)) as
      | {
          data: T;
          status: "success";
        }
      | {
          data: string;
          status: "error";
        };
  }, []);

  useEffect(() => {
    // we intentionally cast here, the actual value is an InternalStore, we just have it typed as a UseStoreHook to avoid consumers
    // using values we don't want them to use.
    const { setLocales, setReady, setConfig } = useStore.getState() as InternalStore;
    locales
      .find((locale) => locale.code === "en")
      ?.fetch()
      .then((_locales) => {
        setLocales(_locales);
        updateLocales(_locales);
        setReady(true);
        setConfig(fakeConfig);
      });
  }, []);

  const contextValue = useMemo<HassContextProps>(
    () => ({
      useStore,
      logout: () => {},
      addRoute,
      getRoute,
      callApi,
      getAllEntities,
      callService: callService as HassContextProps["callService"],
      joinHassUrl,
    }),
    [addRoute, getRoute, callApi, callService, joinHassUrl],
  );

  return <HassContext.Provider value={contextValue}>{children(ready)}</HassContext.Provider>;
}

export type HassConnectProps = {
  /** Any react node to render when authenticated */
  children: ReactNode;
  /** The url to your home assistant instance, can be local, nabucasa or any hosted url with home-assistant.  */
  hassUrl: string;
  /** Any react node to render when not authenticated */
  fallback?: ReactNode;
  /** dummy object so types align */
  wrapperProps?: React.ComponentPropsWithoutRef<"div">;
  loading?: ReactNode;
};

export const HassConnect = ({ children, hassUrl, fallback }: HassConnectProps): ReactNode => {
  return <HassProvider hassUrl={hassUrl}>{(ready) => (ready ? children : (fallback ?? null))}</HassProvider>;
};
