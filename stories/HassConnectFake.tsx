import React, {
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  // types
  Connection,
  HassEntities,
} from "home-assistant-js-websocket";
import {
  ServiceData,
  DomainName,
  DomainService,
  Target,
} from "../src/types/supported-services";
import { HassContext } from '../src/components/HassConnect/Provider';

interface CallServiceArgs<T extends DomainName, M extends DomainService<T>> {
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

const ENTITIES: HassEntities = {
  'light.fake_light': {
    attributes: {
      friendly_name: 'Dining room light'
    },
    state: 'on',
    entity_id: 'light.fake_light',
    last_changed: Date.now().toString(),
    last_updated: Date.now().toString(),
    context: {
      id: '',
      user_id: null,
      parent_id: null,
    }
  },
  'switch.fake_gaming_switch': {
    attributes: {
      friendly_name: 'Gaming Computer'
    },
    state: 'off',
    entity_id: 'switch.fake_gaming_switch',
    last_changed: Date.now().toString(),
    last_updated: Date.now().toString(),
    context: {
      id: '',
      user_id: null,
      parent_id: null,
    }
  },
  'media_player.fake_tv': {
    attributes: {
      friendly_name: 'Living room TV'
    },
    state: 'off',
    entity_id: 'media_player.fake_tv',
    last_changed: Date.now().toString(),
    last_updated: Date.now().toString(),
    context: {
      id: '',
      user_id: null,
      parent_id: null,
    }
  }
}

function HassProvider({
  children,
}: HassProviderProps) {
  const [connection, setConnection] = useState<Connection | null>(null);
  const [lastUpdated] = useState<Date>(new Date());
  const [entities, setEntities] = useState<HassEntities>(ENTITIES)
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
    async <T extends DomainName, M extends DomainService<T>>({
      service,
      target,
    }: CallServiceArgs<T, M>) => {
      if (typeof target !== 'string') return;
      switch(service) {
        case 'turn_on':
          return setEntities({
            ...entities,
            [target]: {
              ...entities[target],
              state: 'on'
            }
          });
        case 'turn_off':
          return setEntities({
            ...entities,
            [target]: {
              ...entities[target],
              state: 'on'
            }
          })
        case 'toggle':
          setEntities({
            ...entities,
            [target]: {
              ...entities[target],
              state: entities[target].state === 'on' ? 'off' : 'on'
            }
          })
      }
    },
    [entities]
  );

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