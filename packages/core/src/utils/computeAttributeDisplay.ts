import { EntityName, EntityRegistryDisplayEntry, FrontendLocaleData, WeatherEntity, computeDomain, localize } from "../";
import { HassConfig, HassEntity } from "home-assistant-js-websocket";
import { formatNumber } from "./number";
import { formatDuration, isDate, isTimestamp, checkValidDate, formatDateTimeWithSeconds, formatDate } from "./date";
import { blankBeforeUnit } from "./blankBeforeUnit";

export const TEMPERATURE_ATTRIBUTES = new Set([
  "temperature",
  "current_temperature",
  "target_temperature",
  "target_temp_temp",
  "target_temp_high",
  "target_temp_low",
  "target_temp_step",
  "min_temp",
  "max_temp",
]);

type Formatter = (value: number) => string;

export const DOMAIN_ATTRIBUTES_FORMATTERS: Record<string, Record<string, Formatter>> = {
  light: {
    brightness: (value) => Math.round((value / 255) * 100).toString(),
  },
  media_player: {
    volume_level: (value) => Math.round(value * 100).toString(),
    media_duration: (value) => formatDuration(value.toString(), "s"),
  },
};

export const DOMAIN_ATTRIBUTES_UNITS = {
  climate: {
    humidity: "%",
    current_humidity: "%",
    target_humidity_low: "%",
    target_humidity_high: "%",
    target_humidity_step: "%",
    min_humidity: "%",
    max_humidity: "%",
  },
  cover: {
    current_position: "%",
    current_tilt_position: "%",
  },
  fan: {
    percentage: "%",
  },
  humidifier: {
    humidity: "%",
    current_humidity: "%",
    min_humidity: "%",
    max_humidity: "%",
  },
  light: {
    color_temp: "mired",
    max_mireds: "mired",
    min_mireds: "mired",
    color_temp_kelvin: "K",
    min_color_temp_kelvin: "K",
    max_color_temp_kelvin: "K",
    brightness: "%",
  },
  sun: {
    azimuth: "°",
    elevation: "°",
  },
  vacuum: {
    battery_level: "%",
  },
  valve: {
    current_position: "%",
  },
  sensor: {
    battery_level: "%",
  },
  media_player: {
    volume_level: "%",
  },
} as const satisfies Record<string, Record<string, string>>;

export const getWeatherUnit = (config: HassConfig, stateObj: WeatherEntity, measure: string): string => {
  const lengthUnit = config.unit_system.length || "";
  switch (measure) {
    case "visibility":
      return stateObj.attributes.visibility_unit || lengthUnit;
    case "precipitation":
      return stateObj.attributes.precipitation_unit || (lengthUnit === "km" ? "mm" : "in");
    case "pressure":
      return stateObj.attributes.pressure_unit || (lengthUnit === "km" ? "hPa" : "inHg");
    case "temperature":
    case "templow":
      return stateObj.attributes.temperature_unit || config.unit_system.temperature;
    case "wind_speed":
      return stateObj.attributes.wind_speed_unit || `${lengthUnit}/h`;
    case "humidity":
    case "precipitation_probability":
      return "%";
    default: {
      const unitSystem = config.unit_system;
      if (measure in unitSystem) {
        return unitSystem[measure as keyof HassConfig["unit_system"]];
      }
      return "";
    }
  }
};
/**
 * Compute a human‑friendly display string for a SPECIFIC ATTRIBUTE of an entity.
 *
 * Differences vs `computeStateDisplayFromEntityAttributes`:
 * - Operates on a single attribute key/value (not the primary entity state) and can be called recursively for arrays.
 * - Applies attribute/domain specific conversions (e.g. light.brightness 0‑255 → 0‑100 %, media_player.volume_level → %).
 * - Inserts appropriate units using domain maps (`DOMAIN_ATTRIBUTES_UNITS`), weather‑aware unit resolution & temperature unit system.
 * - Handles duration/device_class conversions for domain attributes (e.g. media_duration seconds → HH:MM:SS).
 * - Localizes spacing before units via `blankBeforeUnit` for languages needing a non‑breaking space or locale‑specific separator.
 * - Formats numeric values with `formatNumber`, respects precision & currency for monetary representations.
 * - Detects date / timestamp strings and formats them (timestamp → date + time with seconds; date only → long date).
 * - Serializes nested objects to JSON and flattens arrays to a comma‑separated list, formatting each item individually.
 * - Returns localized "unknown" when value is nullish.
 *
 * Example Usage:
 * ```ts
 * // Light brightness attribute (128 → "50 %")
 * computeAttributeValueDisplay(lightEntity, locale, config, entities, 'brightness', 128);
 *
 * // Weather temperature attribute
 * computeAttributeValueDisplay(weatherEntity, locale, config, entities, 'temperature', 23);
 * // => "23 °C" (unit depends on config.unit_system.temperature)
 *
 * // Timestamp string attribute
 * computeAttributeValueDisplay(entity, locale, config, entities, 'last_seen', '2025-11-12T08:30:00Z');
 * // => localized date & time with seconds
 *
 * // Date string attribute (no time)
 * computeAttributeValueDisplay(entity, locale, config, entities, 'date_only', '2025-11-12');
 * // => "Nov 12, 2025" (example)
 *
 * // Array of simple values
 * computeAttributeValueDisplay(entity, locale, config, entities, 'supported_modes', ['auto','cool','heat']);
 * // => "auto, cool, heat"
 *
 * // Object value
 * computeAttributeValueDisplay(entity, locale, config, entities, 'options', { a: 1, b: 2 });
 * // => '{"a":1,"b":2}'
 * ```
 */
export const computeAttributeValueDisplay = (
  entity: HassEntity,
  locale: FrontendLocaleData,
  config: HassConfig,
  entities: Record<string, EntityRegistryDisplayEntry>,
  attribute: string,
  value?: unknown,
): string => {
  const attributeValue = value !== undefined ? value : entity.attributes[attribute];

  // Null value, the state is unknown
  if (attributeValue === null || attributeValue === undefined) {
    return localize("unknown");
  }

  // Number value, return formatted number
  if (typeof attributeValue === "number") {
    const domain = computeDomain(entity.entity_id as EntityName);

    const formatter = DOMAIN_ATTRIBUTES_FORMATTERS[domain]?.[attribute];

    const formattedValue = formatter ? formatter(attributeValue) : formatNumber(attributeValue);

    const key = domain as keyof typeof DOMAIN_ATTRIBUTES_UNITS;
    let unit = DOMAIN_ATTRIBUTES_UNITS[key]?.[attribute as keyof (typeof DOMAIN_ATTRIBUTES_UNITS)[typeof key]] as string | undefined;

    if (domain === "weather") {
      unit = getWeatherUnit(config, entity as WeatherEntity, attribute);
    } else if (TEMPERATURE_ATTRIBUTES.has(attribute)) {
      unit = config.unit_system.temperature;
    }

    if (unit) {
      return `${formattedValue}${blankBeforeUnit(unit, locale)}${unit}`;
    }

    return formattedValue;
  }

  // Special handling in case this is a string with an known format
  if (typeof attributeValue === "string") {
    // Date handling
    if (isDate(attributeValue, true)) {
      // Timestamp handling
      if (isTimestamp(attributeValue)) {
        const date = new Date(attributeValue);
        if (checkValidDate(date)) {
          return formatDateTimeWithSeconds(date, locale, config);
        }
      }

      // Value was not a timestamp, so only do date formatting
      const date = new Date(attributeValue);
      if (checkValidDate(date)) {
        return formatDate(date, config, locale);
      }
    }
  }

  // Values are objects, render object
  if (
    (Array.isArray(attributeValue) && attributeValue.some((val) => val instanceof Object)) ||
    (!Array.isArray(attributeValue) && attributeValue instanceof Object)
  ) {
    return JSON.stringify(attributeValue);
  }
  // If this is an array, try to determine the display value for each item
  if (Array.isArray(attributeValue)) {
    return attributeValue.map((item) => computeAttributeValueDisplay(entity, locale, config, entities, attribute, item)).join(", ");
  }

  return localize(attributeValue);
};
