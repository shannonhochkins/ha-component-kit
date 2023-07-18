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
} from "home-assistant-js-websocket";
import type {
  ServiceData,
  DomainService,
  SnakeOrCamelDomains,
  Target,
} from "@hakit/core";
import { HassContext } from '@hakit/core';
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

function HassProvider({
  children,
}: HassProviderProps) {
  const [connection, setConnection] = useState<Connection | null>(null);
  const [lastUpdated] = useState<Date>(new Date());
  const [entities, setEntities] = useState<HassEntities>(ENTITIES);
  const clock = useRef<NodeJS.Timer | null>(null);
  const [ready] = useState(true);
  const getStates = async () => null;
  const getServices = async () => null;
  const getConfig = async () => null;
  const getUser = async () => null;
  const getAllEntities = useMemo(() => () => entities, [entities]);
  const getEntity = useCallback(
    (entity: string) => {
      const found = entities[entity];
      if (!found) throw new Error(`Entity ${entity} not found`);
      return found;
    },
    [entities]
  );

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
              // @ts-expect-error - purposely casting here so i don't have to setup manual types for fake data
              hvac_action: serviceData?.hvac_mode || entities[target].state
            },
            ...dates,
            // @ts-expect-error - purposely casting here so i don't have to setup manual types for fake data
            state: serviceData?.hvac_mode || entities[target].state
          }
        }));
      }
      switch(service) {
        case 'turn_on':
          return setEntities(entities => ({
            ...entities,
            [target]: {
              ...entities[target],
              ...dates,
              state: 'on'
            }
          }));
        case 'turn_off':
          return setEntities(entities => ({
            ...entities,
            [target]: {
              ...entities[target],
              ...dates,
              state: 'on'
            }
          }))
        case 'toggle':
          setEntities(entities => ({
            ...entities,
            [target]: {
              ...entities[target],
              ...dates,
              state: entities[target].state === 'on' ? 'off' : 'on'
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
  })

  return (
    <HassContext.Provider
      value={{
        connection,
        setConnection,
        getEntity,
        getAllEntities,
        callService,
        getStates,
        getServices,
        getConfig,
        getUser,
        ready,
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