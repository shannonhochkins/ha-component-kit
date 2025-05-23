import {
  useCallback,
  useMemo,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import type {
  HassEntities,
  HassConfig,
  Auth,
  HaWebSocket,
  MessageBase,
} from "home-assistant-js-websocket";
import { Connection, HassEntity } from "home-assistant-js-websocket";
import type {
  DomainService,
  SnakeOrCamelDomains,
  Route,
  Store,
  CallServiceArgs,
  HassContextProps,
  ServiceResponse,
} from "@hakit/core";
import { isArray, isEmpty } from "lodash";
import { HassContext, updateLocales, locales } from '@hakit/core';
import { entities as ENTITIES } from './mocks/mockEntities';
import fakeApi from './mocks/fake-call-service';
import { create } from "zustand";
import { diff } from "deep-object-diff";
import type { ServiceArgs } from './mocks/fake-call-service/types';
import mockHistory from './mock-history';
import { mockCallApi } from './mocks/fake-call-api';
import reolinkSnapshot from './assets/reolink-snapshot.jpg';
import { logs } from './mocks/mockLogs';
import {dailyForecast, hourlyForecast} from './mocks/mockWeather';
interface HassProviderProps {
  children: (ready: boolean) => ReactNode;
  hassUrl: string;
  throttle?: number;
}

let fakeConfig: HassConfig = {
  "latitude": -33.25779010313883,
  "longitude": 151.4821529388428,
  "elevation": 0,
  "unit_system": {
      "length": "km",
      "accumulated_precipitation": "mm",
      "mass": "g",
      "pressure": "Pa",
      "temperature": "°C",
      "volume": "L",
      "wind_speed": "m/s"
  },
  "location_name": "Fake Home",
  "time_zone": "Australia/Brisbane",
  "components": [],
  "config_dir": "/config",
  "allowlist_external_dirs": [],
  "allowlist_external_urls": [],
  "radius": 1,
  "version": "2023.8.2",
  "config_source": "storage",
  "safe_mode": false,
  "recovery_mode": false,
  "state": "RUNNING",
  "external_url": null,
  "internal_url": null,
  "currency": "AUD",
  "country": "AU",
  "language": "en"
};

const fakeAuth = {
  data: {
    hassUrl: "",
    clientId: null,
    expires: 0,
    refresh_token: "",
    access_token: "",
    expires_in: 0
  },
  wsUrl: "",
  accessToken: "",
  expired: false,
  refreshAccessToken: function (): Promise<void> {
    throw new Error("Function not implemented.");
  },
  revoke: function (): Promise<void> {
    throw new Error("Function not implemented.");
  }
} satisfies Auth;

class MockWebSocket {
  addEventListener() {}
  removeEventListener() {}
  send() {}
  close() {}
}

let renderTemplatePrevious = 'on';

class MockConnection extends Connection {
  private _mockListeners: { [event: string]: ((data: unknown) => void)[] };
  private _mockResponses: {
    [type: string]: object | ((message: object) => object) | undefined
  };

  constructor() {
    super(new MockWebSocket() as unknown  as HaWebSocket, {
      setupRetry: 0,
      createSocket: async () => new MockWebSocket() as unknown  as HaWebSocket,
    });
    this._mockListeners = {};
    this._mockResponses = {};
  }

  // hass events
  async subscribeEvents<EventType>(
    eventCallback: (ev: EventType) => void,
    eventType?: string,
  ) {
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
  
  async subscribeMessage<Result>(callback: (result: Result) => void, params?: {
    type: string;
    entity_ids?: string[];
    start_time?: string;
    forecast_type?: string;
    end_time?: string;
  }): Promise<() => Promise<void>> {
    
    if (params && params.type === 'logbook/event_stream' && params.start_time && params.end_time) {
      const isoStartTime = new Date(params.start_time);
      const isoEndTime = new Date(params.end_time);

      const unixStartTime = isoStartTime.getTime() / 1000;
      const unixEndTime = isoEndTime.getTime() / 1000;
      const newEvents = {
        ...logs,
        start_time: unixStartTime,
        end_time: unixEndTime,
        events: logs.events.map(event => ({
          ...event,
          entity_id: params?.entity_ids ? params?.entity_ids[0] : null,
          when: unixStartTime + Math.random() * (unixEndTime - unixStartTime),
        }))
      };
      callback(newEvents as Result);
    } else if (params && params.type === 'weather/subscribe_forecast') {
      if (params.forecast_type === 'daily') {
        callback(dailyForecast as Result);
      }
      if (params.forecast_type === 'hourly') {
        callback(hourlyForecast as Result);
      }
    } else if (params && params.type === 'render_template') {
      if (renderTemplatePrevious === 'on') {
        callback({
          result: 'The entity is on!!'
        } as Result);
      } else {
        callback({
          result: 'The entity is not on!!'
        } as Result);
      }
    } else {
      callback(mockHistory as Result);
    }
    return () => Promise.resolve();
  }
  async sendMessagePromise<Result>(message: MessageBase): Promise<Result> {
    if (message.type === 'get_config') {
      return fakeConfig as Result;
    }
    // a mock for the proxy image for the camera
    if (message.path && message.path.includes('camera_proxy')) {
      return {
        path: `${reolinkSnapshot}?`
      } as Result;
    }
    if (message.path && message.path.includes('config/entity_registry/get')) {
      return '123'as Result;
    }
    return null as Result;
  }
}

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

const useStore = create<Store>((set) => ({
  disconnectCallbacks: [],
  onDisconnect: (cb) => set((state) => ({ disconnectCallbacks: [...state.disconnectCallbacks, cb] })),
  triggerOnDisconnect: () => {
    set((state) => {
      state.disconnectCallbacks.forEach((callback) => callback());
      return { disconnectCallbacks: [] };
    });
  },
  routes: [],
  setRoutes: (routes) => set(() => ({ routes })),
  hash: '',
  setHash: (hash) => set({ hash }),
  entities: ENTITIES,
  // this now matches the actual set Entities which fixed a state rendering issue on the demo page
  setEntities: (newEntities) => set((state) => {
    const entitiesDiffChanged = diff(ignoreForDiffCheck(state.entities), ignoreForDiffCheck(newEntities)) as HassEntities;
    if (!isEmpty(entitiesDiffChanged)) {
      // purposely not making this throttle configurable
      // because lights can animate etc, which doesn't need to reflect in the UI
      // if a user want's to control individual entities this can be done with useEntity by passing a throttle to it's options.
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
      // used to mock out the render_template service
      if (state.entities['light.fake_light_1']) {
        renderTemplatePrevious = state.entities['light.fake_light_1'].state;
      }
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
  locales: null,
  setLocales: (locales) => set({ locales }),
  connection: new MockConnection(),
  setConnection: (connection) => set({ connection }),
  cannotConnect: false,
  setCannotConnect: (cannotConnect) => set({ cannotConnect }),
  ready: false,
  setReady: (ready) => set({ ready }),
  lastUpdated: new Date(),
  setLastUpdated: (lastUpdated) => set({ lastUpdated }),
  auth: fakeAuth,
  setAuth: (auth) => set({ auth }),
  config: fakeConfig,
  user: {
    id: '',
    is_admin: false,
    is_owner: false,
    name: 'Joe Bloggs',
  },
  setUser: (user) => set({ user }),
  setConfig: (config) => {
    set((state) => {
      if (state.connection && 'mockEvent' in state.connection && config) {
        fakeConfig = config;
        // @ts-expect-error - don't know domain
        state.connection.mockEvent('core_config_updated', config);
      }
      state.config = config;
      return state;
    });
  },
  error: null,
  setError: (error) => set({ error }),
  hassUrl: '',
  setHassUrl: (hassUrl) => set({ hassUrl }),
  portalRoot: undefined,
  setPortalRoot: (portalRoot) => set({ portalRoot }),
  windowContext: window,
  setWindowContext: (windowContext) => set({ windowContext }),
  callApi: async (): Promise<unknown> => {
    return {};
  },
  globalComponentStyles: {},
  setGlobalComponentStyles: (globalComponentStyles) => set({ globalComponentStyles }),
}))


function HassProvider({
  children,
}: HassProviderProps) {
  
  const routes = useStore(store => store.routes);
  const setRoutes = useStore(store => store.setRoutes);
  const entities = useStore(store => store.entities);
  const setEntities = useStore(store => store.setEntities);
  const setHash = useStore(store => store.setHash);
  const _hash = useStore(store => store.hash);
  const ready = useStore(store => store.ready);
  const setReady = useStore(store => store.setReady);
  const setLocales = useStore(store => store.setLocales);
  const setConfig = useStore(store => store.setConfig);
  const clock = useRef<NodeJS.Timeout | null>(null);
  const getStates = async () => null;
  const getServices = async () => null;
  const getConfig = async () => fakeConfig;
  const getUser = async () => null;
  const getAllEntities = useMemo(() => () => entities, [entities]);

  const callService = useCallback(
    async <ResponseType extends object, T extends SnakeOrCamelDomains, M extends DomainService<T>, R extends boolean>(
      { domain, service, serviceData, target }: CallServiceArgs<T, M, R>,
    ): Promise<R extends true ? ServiceResponse<ResponseType> : void> => {
      if (typeof target !== 'string' && !isArray(target)) return undefined as R extends true ? never : void;
      const now = new Date().toISOString();
      if (domain in fakeApi) {
        const api = fakeApi[domain as 'scene'] as (params: ServiceArgs<'scene'>) => boolean;
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
      if (typeof target !== 'string') return undefined as R extends true ? never : void;
      const dates = {
        last_changed: now,
        last_updated: now,
      }
      switch(service) {
        case 'turn_on':
        case 'turnOn': {
          const attributes = {
            ...entities[target].attributes,
            ...serviceData || {},
          }
          setEntities({
            ...entities,
            [target]: {
              ...entities[target],
              attributes: {
                ...attributes,
              },
              ...dates,
              state: 'on'
            }
          })
        }
        break;
        case 'turn_off':
        case 'turnOff':
          setEntities({
            ...entities,
            [target]: {
              ...entities[target],
              attributes: {
                ...entities[target].attributes,
                ...serviceData || {},
              },
              ...dates,
              state: 'off'
            }
          });
        break;
        case 'toggle':
          setEntities({
            ...entities,
            [target]: {
              ...entities[target],
              attributes: {
                ...entities[target].attributes,
                ...serviceData || {},
                brightness: entities[target].state === 'on' ? entities[target].attributes.brightness : 0,
              },
              ...dates,
              state: entities[target].state === 'on' ? 'off' : 'on'
            }
          });
        break;
        default:
          setEntities({
            ...entities,
            [target]: {
              ...entities[target],
              ...dates,
            }
          });
        break;
      }
      return undefined as R extends true ? never : void;
    },
    [entities, setEntities]
  );


  useEffect(() => {
    if (clock.current) clearInterval(clock.current);
    clock.current = setInterval(() => {
      const now = new Date();
      const formatted = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      const dates = {
        last_changed: now.toISOString(),
        last_updated: now.toISOString(),
      }
      if (formatted !== entities['sensor.time'].state) {
        setEntities({
          ...entities,
          'sensor.time': {
            ...entities['sensor.time'],
            ...dates,
            state: formatted
          }
        });
      }
    }, 125);
    return () => {
      if (clock.current) clearInterval(clock.current);
    }
  }, [entities, setEntities]);

  const addRoute = useCallback(
    (route: Omit<Route, "active">) => {
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
    },
    [routes, setRoutes],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (location.hash === '') return;
    if (location.hash.replace('#', '') === _hash) return;
    setHash(location.hash)
  }, [setHash, _hash]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    function onHashChange() {
      setRoutes(routes.map(route => {
        if (route.hash === location.hash.replace('#', '')) {
          return {
            ...route,
            active: true,
          }
        }
        return {
          ...route,
          active: false,
        }
      }));
      setHash(location.hash);
    }
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [routes, setHash, setRoutes]);

  const joinHassUrl = useCallback((path: string) => path, []);

  const getRoute = useCallback(
    (hash: string) => {
      const route = routes.find((route) => route.hash === hash);
      return route || null;
    },
    [routes]
  );
  const callApi = useCallback(
    async function <T>(endpoint: string): Promise<{
      data: T;
      status: "success";
    } | {
      data: string;
      status: "error";
    }> {
      return await mockCallApi(endpoint) as {
        data: T;
        status: "success";
      } | {
        data: string;
        status: "error";
      };
    },
    []
  );


  useEffect(() => {
    locales.find(locale => locale.code === 'en')?.fetch().then(_locales => {
      setLocales(_locales);
      updateLocales(_locales);
      setReady(true);
      setConfig(fakeConfig);

    });
  }, [setLocales, setConfig, setReady]);

  return (
    <HassContext.Provider
      value={{
        useStore,
        logout: () => {},
        addRoute,
        getRoute,
        getStates,
        getServices,
        getConfig,
        getUser,
        getAllEntities,
        callService : callService as HassContextProps['callService'],
        callApi,
        joinHassUrl,
      }}
    >
      {children(ready)}
    </HassContext.Provider>
  );
}

export type HassConnectProps = {
  /** Any react node to render when authenticated */
  children: ReactNode;
  /** The url to your home assistant instance, can be local, nabucasa or any hosted url with home-assistant.  */
  hassUrl: string;
  /** Any react node to render when not authenticated */
  fallback?: ReactNode;
};

export const HassConnect = ({
  children,
  hassUrl,
  fallback,
}: HassConnectProps): ReactNode => {
  return (
    <HassProvider hassUrl={hassUrl}>
      {(ready) => (ready ? children : (fallback ?? null))}
    </HassProvider>
  );
};