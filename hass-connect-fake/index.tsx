import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import type {
  // types
  Connection,
  HassEntities,
  HassConfig,
  Auth,
} from "home-assistant-js-websocket";
import type {
  ServiceData,
  DomainService,
  SnakeOrCamelDomains,
  Target,
  Route,
  HassContextProps,
} from "@hakit/core";
import { isArray } from "lodash";
import { HassContext, useHash } from '@hakit/core';
import { entities as ENTITIES } from './mocks/mockEntities';
import fakeApi from './mocks/fake-call-service';

interface CallServiceArgs<T extends SnakeOrCamelDomains, M extends DomainService<T>> {
  domain: T;
  service: M;
  serviceData?: ServiceData<T, M>;
  target?: Target;
}

interface HassProviderProps {
  children: (ready: boolean) => React.ReactNode;
  hassUrl: string;
  throttle?: number;
}

const fakeConfig: HassConfig = {
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
  "location_name": "Freesia",
  "time_zone": "Australia/Brisbane",
  "components": [],
  "config_dir": "/config",
  "allowlist_external_dirs": [],
  "allowlist_external_urls": [],
  "version": "2023.8.2",
  "config_source": "storage",
  "safe_mode": false,
  "state": "RUNNING",
  "external_url": null,
  "internal_url": null,
  "currency": "AUD",
  "country": "AU",
  "language": "en"
};

const fakeAuth: Auth = {
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
}

function HassProvider({
  children,
}: HassProviderProps) {
  const [_hash] = useHash();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [lastUpdated] = useState<Date>(new Date());
  const [entities, setEntities] = useState<HassEntities>(ENTITIES);
  const clock = useRef<NodeJS.Timer | null>(null);
  const [ready] = useState(true);
  const getStates = async () => null;
  const getServices = async () => null;
  const getConfig = async () => fakeConfig;
  const getUser = async () => null;
  const getAllEntities = useMemo(() => () => entities, [entities]);
  const getEntity = (entity: string, returnNullIfNotFound: boolean) => {
    const found = entities[entity];
    if (!found) {
      if (returnNullIfNotFound || entity === 'unknown') return null;
      throw new Error(`Entity ${entity} not found`);
    }
    return found;
  }

  const callService = useCallback(
    async <T extends SnakeOrCamelDomains, M extends DomainService<T>>({
      service,
      domain,
      target,
      serviceData
    }: CallServiceArgs<T, M>) => {
      if (typeof target !== 'string' && !isArray(target)) return;
      const now = new Date().toISOString();
      
      if (domain in fakeApi) {
        // @ts-expect-error - unable to retrieve correct type at this level
        const api = fakeApi[domain];
        const skip = api({
          setEntities,
          now,
          target,
          service,
          serviceData,
        });
        if (!skip) return;
      }
      if (typeof target !== 'string') return;
      const dates = {
        last_changed: now,
        last_updated: now,
      }
      switch(service) {
        case 'turn_on':
        case 'turnOn':
          return setEntities(entities => {
            const attributes = {
              ...entities[target].attributes,
              ...serviceData || {},
            }
            return {
              ...entities,
              [target]: {
                ...entities[target],
                attributes: {
                  ...attributes,
                },
                ...dates,
                state: 'on'
              }
            };
          });
        case 'turn_off':
        case 'turnOff':
          return setEntities(entities => ({
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
          }))
        case 'toggle':
          return setEntities(entities => ({
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
          }));
        default:
          return setEntities(entities => ({
            ...entities,
            [target]: {
              ...entities[target],
              ...dates,
            }
          }));
      }
    },
    []
  );

  useEffect(() => {
    clock.current = setInterval(() => {
      const now = new Date();
      const formatted = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      const dates = {
        last_changed: now.toISOString(),
        last_updated: now.toISOString(),
      }
      setEntities(entities => ({
        ...entities,
        ['sensor.time']: {
          ...entities['sensor.time'],
          ...dates,
          state: formatted
        }
      }));
    }, 60000);
  });

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
      })
    );
  }, [_hash]);

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

  const useRoute = useCallback(
    (hash: string) => {
      const route = routes.find((route) => route.hash === hash);
      return route || null;
    },
    [routes]
  );

  return (
    <HassContext.Provider
      value={{
        connection,
        setConnection,
        getEntity: getEntity as HassContextProps["getEntity"],
        getAllEntities,
        callService,
        getStates,
        getServices,
        getConfig,
        getUser,
        addRoute,
        useRoute,
        ready,
        routes,
        lastUpdated,
        auth: fakeAuth,
        config: fakeConfig,
        logout: () => null,
      }}
    >
      {children(ready)}
    </HassContext.Provider>
  );
}


import { ReactNode, ReactElement } from "react";

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
  fallback = null,
}: HassConnectProps): ReactElement => {
  return (
    <HassProvider hassUrl={hassUrl}>
      {(ready) => (ready ? children : fallback)}
    </HassProvider>
  );
};