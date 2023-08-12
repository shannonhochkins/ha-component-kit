import type {
  HassEntity,
  HassServiceTarget,
} from "home-assistant-js-websocket";
import type { SupportedServices } from "./supported-services";
import { LIGHT_COLOR_MODES } from "../data/light";
import { DefinedPropertiesByDomain } from "./entity";

export type LightColorMode =
  (typeof LIGHT_COLOR_MODES)[keyof typeof LIGHT_COLOR_MODES];

export type HassEntityCustom = HassEntity & {
  custom: {
    /** the difference in time between the last updated value and now, eg "1 minute ago, 1 day ago etc, 5 days from now" */
    relativeTime: string;
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
type HassEntityHelper<T extends AllDomains> =
  T extends keyof DefinedPropertiesByDomain
    ? DefinedPropertiesByDomain[T]
    : HassEntity;

export type HassEntityWithApi<T extends AllDomains> = HassEntityCustom &
  HassEntityHelper<T> & {
    /** all the services associated with the domain provided, this does not require entity as the first argument */
    api: T extends keyof SupportedServices
      ? SupportedServices<"no-target">[SnakeToCamel<T>]
      : never;
  };

export type ServiceFunctionWithEntity<Data = object> = (
  /** the entity string name from home assistant */
  entity: string,
  /** the data to send to the service */
  data?: Data
) => void;

export type ServiceFunctionWithoutEntity<Data = object> = {
  /** the data to send to the service */
  (data?: Data): void;
};

export type ServiceFunction<
  T extends ServiceFunctionTypes = "target",
  Data = object
> = {
  /** with target, the service method expects a Target value as the first argument */
  target: ServiceFunctionWithEntity<Data>;
  /** without target, the service method does not expect a Target value as the first argument */
  "no-target": ServiceFunctionWithoutEntity<Data>;
}[T];
export type StaticDomains =
  | "sun"
  | "sensor"
  | "stt"
  | "binarySensor"
  | "weather";
export type SnakeOrCamelStaticDomains =
  | CamelToSnake<StaticDomains>
  | SnakeToCamel<StaticDomains>;
/** the key names on the interface object all as camel case */
export type CamelCaseDomains = SnakeToCamel<
  NonSymbolNumberKeys<SupportedServices>
>;
/** the key names on the interface object all as snake case */
export type SnakeCaseDomains = CamelToSnake<CamelCaseDomains>;
/** the key names on the interface object all as snake case or camel case */
export type SnakeOrCamelDomains = SnakeCaseDomains | CamelCaseDomains;

export type AllDomains = SnakeOrCamelStaticDomains | SnakeOrCamelDomains;

/** will extract the domain name from the entity value, eg light.something will return "light" if it extends SnakeOrCamelDomains */
export type ExtractDomain<E> = E extends `${infer D}.${string}`
  ? D extends AllDomains
    ? D
    : never
  : never;
/** Will convert a string to camel case */
export type SnakeToCamel<Key extends string> =
  Key extends `${infer FirstPart}_${infer FirstLetter}${infer LastPart}`
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
export type ServiceData<
  D extends SnakeOrCamelDomains,
  S extends DomainService<D>
> = S extends keyof SupportedServices[SnakeToCamel<D>]
  ? SupportedServices[SnakeToCamel<D>][S] extends ServiceFunction<
      "target",
      infer Params
    >
    ? Params
    : never
  : SnakeToCamel<S> extends keyof SupportedServices[SnakeToCamel<D>]
  ? SupportedServices[SnakeToCamel<D>][SnakeToCamel<S>] extends ServiceFunction<
      "target",
      infer Params
    >
    ? Params
    : never
  : never;
/** simple helper to exclude symbol and number from keyof */
export type NonSymbolNumberKeys<T> = Exclude<keyof T, symbol | number>;
/** Wrapper for HassServiceTarget to also allow string or string[] */
export type Target = HassServiceTarget | string | string[];
/** Available service function types, target includes the target param, no-target doesn't */
export type ServiceFunctionTypes = "target" | "no-target";
/** all the supported services */
export type * from "./supported-services";
export type * from "./entity";
export type * from "./entity/light";
