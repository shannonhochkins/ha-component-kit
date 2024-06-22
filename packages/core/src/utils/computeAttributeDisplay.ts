import { EntityName, WeatherEntity, computeDomain, localize } from "@core";
import { HassConfig, HassEntities, HassEntity } from "home-assistant-js-websocket";
import { formatNumber } from "./number";
import { formatDuration, isDate, isTimestamp, checkValidDate } from "./date";

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

export const DOMAIN_ATTRIBUTES_FORMATERS: Record<string, Record<string, Formatter>> = {
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

export const computeAttributeValueDisplay = (
  entity: HassEntity,
  config: HassConfig,
  entities: HassEntities,
  attribute: string,
  value?: unknown,
): string => {
  const attributeValue = value !== undefined ? value : entity.attributes[attribute];

  // Null value, the state is unknown
  if (attributeValue === null) {
    return localize("unknown");
  }

  // Number value, return formatted number
  if (typeof attributeValue === "number") {
    const domain = computeDomain(entity.entity_id as EntityName);

    const formatter = DOMAIN_ATTRIBUTES_FORMATERS[domain]?.[attribute];

    const formattedValue = formatter ? formatter(attributeValue) : formatNumber(attributeValue);

    const key = domain as string;
    // @ts-expect-error - it's fine
    let unit = DOMAIN_ATTRIBUTES_UNITS[key]?.[attribute];

    if (domain === "weather") {
      unit = getWeatherUnit(config, entity as WeatherEntity, attribute);
    } else if (TEMPERATURE_ATTRIBUTES.has(attribute)) {
      unit = config.unit_system.temperature;
    }

    if (unit) {
      return `${formattedValue}${unit}`;
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
          return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hourCycle: "h12",
          }).format(date);
        }
      }

      // Value was not a timestamp, so only do date formatting
      const date = new Date(attributeValue);
      if (checkValidDate(date)) {
        return new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(date);
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
    return attributeValue.map((item) => computeAttributeValueDisplay(entity, config, entities, attribute, item)).join(", ");
  }

  return localize(attributeValue);
};
