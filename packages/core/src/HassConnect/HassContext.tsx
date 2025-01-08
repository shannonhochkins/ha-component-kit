import { createContext } from "react";
// types
import type { Connection, HassEntities, HassEntity, HassConfig, HassUser, HassServices, Auth } from "home-assistant-js-websocket";
import { type CSSInterpolation } from "@emotion/serialize";
import { isEmpty } from "lodash";
import { ServiceData, SnakeOrCamelDomains, DomainService, Target, LocaleKeys, ServiceResponse } from "@typings";
import { diff } from "deep-object-diff";
import { create } from "zustand";
export interface CallServiceArgs<T extends SnakeOrCamelDomains, M extends DomainService<T>, R extends boolean> {
  domain: T;
  service: M;
  serviceData?: ServiceData<T, M>;
  target?: Target;
  returnResponse?: R;
}

export interface Route {
  hash: string;
  name: string;
  icon: string;
  active: boolean;
}

export type SupportedComponentOverrides =
  | "buttonCard"
  | "modal"
  | "areaCard"
  | "calendarCard"
  | "climateCard"
  | "cameraCard"
  | "entitiesCard"
  | "fabCard"
  | "cardBase"
  | "garbageCollectionCard"
  | "mediaPlayerCard"
  | "pictureCard"
  | "sensorCard"
  | "timeCard"
  | "triggerCard"
  | "weatherCard"
  | "menu"
  | "personCard"
  | "familyCard"
  | "vacuumCard"
  | "alarmCard";
export interface Store {
  entities: HassEntities;
  setEntities: (entities: HassEntities) => void;
  /** The connection object from home-assistant-js-websocket */
  connection: Connection | null;
  setConnection: (connection: Connection | null) => void;
  /** any errors caught during core authentication */
  error: null | string;
  setError: (error: string | null) => void;
  /** if there was an issue connecting to HA */
  cannotConnect: boolean;
  setCannotConnect: (cannotConnect: boolean) => void;
  /** This is an internal value, no need to use this */
  ready: boolean;
  setReady: (ready: boolean) => void;
  /** The last time the context object was updated */
  lastUpdated: Date;
  setLastUpdated: (lastUpdated: Date) => void;
  /** the current hash in the url */
  hash: string;
  /** set the current hash */
  setHash: (hash: string) => void;
  /** returns available routes */
  routes: Route[];
  setRoutes: (routes: Route[]) => void;
  /** the home assistant authentication object */
  auth: Auth | null;
  setAuth: (auth: Auth | null) => void;
  /** the home assistant configuration */
  config: HassConfig | null;
  setConfig: (config: HassConfig | null) => void;
  /** the hassUrl provided to the HassConnect component */
  hassUrl: string | null;
  /** set the hassUrl */
  setHassUrl: (hassUrl: string | null) => void;
  /** getter for breakpoints, if using @hakit/components, the breakpoints are stored here to retrieve in different locations */
  breakpoints: Record<"xxs" | "xs" | "sm" | "md" | "lg" | "xlg", number>;
  /** setter for breakpoints, if using @hakit/components, the breakpoints are stored here to retrieve in different locations */
  setBreakpoints: (breakpoints: Record<"xxs" | "xs" | "sm" | "md" | "lg", number>) => void;
  /** a way to provide or overwrite default styles for any particular component */
  setGlobalComponentStyles: (styles: Partial<Record<SupportedComponentOverrides, CSSInterpolation>>) => void;
  globalComponentStyles: Partial<Record<SupportedComponentOverrides, CSSInterpolation>>;
  portalRoot?: HTMLElement;
  setPortalRoot: (portalRoot: HTMLElement) => void;
  locales: Record<LocaleKeys, string> | null;
  setLocales: (locales: Record<LocaleKeys, string>) => void;
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

export const useStore = create<Store>((set) => ({
  routes: [],
  setRoutes: (routes) => set(() => ({ routes })),
  entities: {},
  setHassUrl: (hassUrl) => set({ hassUrl }),
  hassUrl: null,
  hash: "",
  locales: null,
  setLocales: (locales) => set({ locales }),
  setHash: (hash) => set({ hash }),
  setPortalRoot: (portalRoot) => set({ portalRoot }),
  setEntities: (newEntities) =>
    set((state) => {
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
  connection: null,
  setConnection: (connection) => set({ connection }),
  cannotConnect: false,
  setCannotConnect: (cannotConnect) => set({ cannotConnect }),
  ready: false,
  setReady: (ready) => set({ ready }),
  lastUpdated: new Date(),
  setLastUpdated: (lastUpdated) => set({ lastUpdated }),
  auth: null,
  setAuth: (auth) => set({ auth }),
  config: null,
  setConfig: (config) => set({ config }),
  error: null,
  setError: (error) => set({ error }),
  breakpoints: {
    xxs: 0,
    xs: 0,
    sm: 0,
    md: 0,
    lg: 0,
    xlg: 0,
  },
  setBreakpoints: (breakpoints) =>
    set({
      breakpoints: {
        ...breakpoints,
        xlg: breakpoints.lg + 1,
      },
    }),
  globalComponentStyles: {},
  setGlobalComponentStyles: (styles) => set(() => ({ globalComponentStyles: styles })),
}));

export interface HassContextProps {
  useStore: typeof useStore;
  /** logout of HA */
  logout: () => void;
  /** will retrieve all the HassEntities states */
  getStates: () => Promise<HassEntity[] | null>;
  /** will retrieve all the HassServices */
  getServices: () => Promise<HassServices | null>;
  /** will retrieve HassConfig */
  getConfig: () => Promise<HassConfig | null>;
  /** will retrieve HassUser */
  getUser: () => Promise<HassUser | null>;
  /** function to call a service through web sockets */
  callService: {
    <ResponseType extends object, T extends SnakeOrCamelDomains, M extends DomainService<T>>(
      args: CallServiceArgs<T, M, true>
    ): Promise<ServiceResponse<ResponseType>>;

    /** Overload for when `returnResponse` is false */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    <ResponseType extends object, T extends SnakeOrCamelDomains, M extends DomainService<T>>(
      args: CallServiceArgs<T, M, false>
    ): void;

    /** Overload for when `returnResponse` is omitted (defaults to false) */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    <ResponseType extends object, T extends SnakeOrCamelDomains, M extends DomainService<T>>(
      args: Omit<CallServiceArgs<T, M, false>, "returnResponse">
    ): void;
  };
  /** add a new route to the provider */
  addRoute(route: Omit<Route, "active">): void;
  /** retrieve a route by name */
  getRoute(hash: string): Route | null;
  /** will retrieve all HassEntities from the context */
  getAllEntities: () => HassEntities;
  /** join a path to the hassUrl */
  joinHassUrl: (path: string) => string;
  /** call the home assistant api */
  callApi: <T>(
    endpoint: string,
    options?: RequestInit,
  ) => Promise<
    | {
        data: T;
        status: "success";
      }
    | {
        data: string;
        status: "error";
      }
  >;
}

export const HassContext = createContext<HassContextProps>({} as HassContextProps);
