import type { HassEntity, HassServiceTarget } from "home-assistant-js-websocket";
import type { DefaultServices } from "./supported-services";
import type { DefinedPropertiesByDomain } from "./entitiesByDomain";
export type { DefinedPropertiesByDomain } from "./entitiesByDomain";
import type { TimelineState, EntityHistoryState } from "../hooks/useHistory/history";

export type { HistoryStreamMessage, TimelineState, HistoryResult, EntityHistoryState } from "../hooks/useHistory/history";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - ignore the next check as this is extendable from the client side.
// eslint-disable-next-line
export interface CustomSupportedServices<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends ServiceFunctionTypes = "target",
> {}
// dodgey hack to determine if the custom supported services are empty or not, if they're empty we use the default services
export type SupportedServices<T extends ServiceFunctionTypes = "target"> = [keyof CustomSupportedServices<T>] extends [never]
  ? DefaultServices<T>
  : CustomSupportedServices<T>;

export type FilterByDomain<
  T,
  Prefix extends AllDomains,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
> = T extends `${Prefix}${infer _Rest}` ? T : never;

export type DefaultEntityName = `${AllDomains}.${string}`;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - ignore the next check as this is extendable from the client side.
// eslint-disable-next-line
export interface CustomEntityNameContainer {}

export type EntityName =
  | ([keyof CustomEntityNameContainer] extends [never]
      ? DefaultEntityName
      : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - ignore the next check as this is extendable from the client side.
        CustomEntityNameContainer["names"])
  | "unknown";

export type HassEntityCustom = HassEntity & {
  custom: {
    /** the difference in time between the last updated value and now, eg "1 minute ago, 1 day ago etc, 5 days from now" */
    relativeTime: string;
    /** the difference in time in milliseconds between now and the time the entity was updated / triggered */
    timeDiff: number;
    /** if the last updated value was considered "now" */
    active: boolean;
    /** the hexColor value if the entity is a light */
    hexColor: string;
    /** brightness css value of the light ranging from 0-100 */
    brightness: string;
    /** the brightness value represented as a number between 0-100 */
    brightnessValue: number;
    /** the rgba color with 35% alpha */
    rgbaColor: string;
    /** the rgb color */
    rgbColor: string;
    /** rgb values represented as an array */
    color: [number, number, number];
  };
};
export type HassEntityHelper<T extends AllDomains> = CamelToSnake<T> extends keyof DefinedPropertiesByDomain
  ? DefinedPropertiesByDomain[CamelToSnake<T>]
  : HassEntity;

export type HassEntityWithService<T extends AllDomains> = HassEntityCustom &
  HassEntityHelper<SnakeToCamel<T>> & {
    history: {
      timeline: TimelineState[];
      entityHistory: EntityHistoryState[];
      coordinates: number[][];
      loading: boolean;
    };
    /** @deprecated - this will be removed in future versions, use service instead, example .api.toggle() becomes .service.toggle() */
    api: SnakeToCamel<T> extends keyof SupportedServices<"no-target"> ? SupportedServices<"no-target">[SnakeToCamel<T>] : never;
    service: SnakeToCamel<T> extends keyof SupportedServices<"no-target"> ? SupportedServices<"no-target">[SnakeToCamel<T>] : never;
  };

export type ServiceFunctionWithEntity<Data = object> = (
  /** the entity target from home assistant, string, string[] or object */
  entity: Target,
  /** the data to send to the service */
  data?: Data,
) => void;

export type ServiceFunctionWithoutEntity<Data = object> = {
  /** the data to send to the service */
  (data?: Data): void;
};

export type ServiceFunction<T extends ServiceFunctionTypes = "target", Data = object> = {
  /** with target, the service method expects a Target value as the first argument */
  target: ServiceFunctionWithEntity<Data>;
  /** without target, the service method does not expect a Target value as the first argument */
  "no-target": ServiceFunctionWithoutEntity<Data>;
}[T];
export type StaticDomains = "sun" | "sensor" | "stt" | "binarySensor" | "weather";
export type SnakeOrCamelStaticDomains = CamelToSnake<StaticDomains> | SnakeToCamel<StaticDomains>;
/** the key names on the interface object all as camel case */
export type CamelCaseDomains = SnakeToCamel<NonSymbolNumberKeys<SupportedServices>>;
/** the key names on the interface object all as snake case */
export type SnakeCaseDomains = CamelToSnake<CamelCaseDomains>;
/** the key names on the interface object all as snake case or camel case */
export type SnakeOrCamelDomains = SnakeCaseDomains | CamelCaseDomains;

export type AllDomains = SnakeOrCamelStaticDomains | SnakeOrCamelDomains;

/** will extract the domain name from the entity value, eg light.something will return "light" if it extends SnakeOrCamelDomains */
export type ExtractDomain<E> = E extends `${infer D}.${string}` ? (D extends AllDomains ? D : never) : never;
/** Will convert a string to camel case */
export type SnakeToCamel<Key extends string> = Key extends `${infer FirstPart}_${infer FirstLetter}${infer LastPart}`
  ? `${FirstPart}${Uppercase<FirstLetter>}${SnakeToCamel<LastPart>}`
  : Key;
/** Will convert a string to snake case */
export type CamelToSnake<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Uppercase<T> ? "_" : ""}${Lowercase<T>}${CamelToSnake<U>}`
  : "";

/** Returns a union of all available services by domain in both snake and camel case */
export type DomainService<D extends SnakeOrCamelDomains> =
  | NonSymbolNumberKeys<SupportedServices[SnakeToCamel<D>]>
  | CamelToSnake<NonSymbolNumberKeys<SupportedServices[SnakeToCamel<D>]>>;

/** returns the supported data to be used with the ServiceFunction */
export type ServiceData<D extends SnakeOrCamelDomains, S extends DomainService<D>> = S extends keyof SupportedServices[SnakeToCamel<D>]
  ? SupportedServices[SnakeToCamel<D>][S] extends ServiceFunction<"target", infer Params>
    ? Params
    : never
  : SnakeToCamel<S> extends keyof SupportedServices[SnakeToCamel<D>]
  ? SupportedServices[SnakeToCamel<D>][SnakeToCamel<S>] extends ServiceFunction<"target", infer Params>
    ? Params
    : never
  : never;
/** simple helper to exclude symbol and number from keyof */
export type NonSymbolNumberKeys<T> = Exclude<keyof T, symbol | number>;
/** Wrapper for HassServiceTarget to also allow string or string[] */
export type Target = HassServiceTarget | string | string[];
/** Available service function types, target includes the target param in the service, no-target doesn't */
export type ServiceFunctionTypes = "target" | "no-target";
/** all the supported services */
export type * from "./supported-services";
export type * from "./entitiesByDomain";
