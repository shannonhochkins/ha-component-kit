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
} from "home-assistant-js-websocket";
import type {
  ServiceData,
  DomainService,
  SnakeOrCamelDomains,
  Target,
  Route,
  HassContextProps,
  HvacMode,
  HvacAction
} from "@hakit/core";
import { HassContext, useHash, hs2rgb } from '@hakit/core';
import { entities as ENTITIES } from '@mocks/mockEntities';

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

const MODE_TO_HVAC_ACTION: {
  [key in HvacMode]: HvacAction
} = {
  'off': 'off',
  'heat': 'heating',
  'cool': 'cooling',
  'heat_cool': 'preheating',
  'auto': 'idle',
  'dry': 'drying',
  'fan_only': 'fan',
}

const fakeConfig = {
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
} satisfies HassConfig;

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
      if (typeof target !== 'string') return;
      const now = new Date().toISOString();
      const dates = {
        last_changed: now,
        last_updated: now,
      }
      if (domain === 'scene') {
        return setEntities(entities => ({
          ...entities,
          [target]: {
            ...entities[target],
            ...dates,
            state: now
          }
        }));
      }
      if (domain === 'climate') {
        return setEntities(entities => ({
          ...entities,
          [target]: {
            ...entities[target],
            attributes: {
              ...entities[target].attributes,
              ...serviceData || {},
              // @ts-ignore - purposely casting here so i don't have to setup manual types for fake data
              hvac_action: MODE_TO_HVAC_ACTION[serviceData?.hvac_mode] || entities[target].attributes.hvac_action
            },
            ...dates,
            // @ts-ignore - purposely casting here so i don't have to setup manual types for fake data
            state: serviceData?.hvac_mode || entities[target].state
          }
        }));
      }
      switch(service) {
        case 'turn_on':
        case 'turnOn':
          return setEntities(entities => {
            const attributes = {
              ...entities[target].attributes,
              ...serviceData || {},
            }
            if (domain === 'light') {
              // @ts-ignore
              const isSettingTemperature = typeof serviceData?.kelvin === 'number';
              // @ts-ignore
              const isSettingColor = typeof serviceData?.hs_color === 'object';
              if (isSettingTemperature) {
                // @ts-ignore
                delete attributes.hs_color;
                // @ts-ignore
                attributes.color_mode = 'color_temp';
                // @ts-ignore
                attributes.color_temp_kelvin = serviceData?.kelvin;
              }
              if (isSettingColor) {
                // @ts-ignore
                attributes.color_mode = 'hs';
                // @ts-ignore
                attributes.rgb_color = hs2rgb([serviceData?.hs_color[0], serviceData?.hs_color[1] / 100]);
              }
              // @ts-ignore
              const isSettingBrightness = serviceData?.brightness_pct !== undefined;
              if (isSettingBrightness) {
                // @ts-ignore
                attributes.brightness = Math.round(serviceData.brightness_pct / 100 * 255);
              }
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