import { type WeatherEntity, type FilterByDomain, type EntityName, supportsFeatureFromAttributes } from "@core";
import type { Connection, HassEntityBase } from "home-assistant-js-websocket";

export const enum WeatherEntityFeature {
  FORECAST_DAILY = 1,
  FORECAST_HOURLY = 2,
  FORECAST_TWICE_DAILY = 4,
}

type ForecastAttribute = NonNullable<WeatherEntity["attributes"]["forecast"]>[number];

export type ModernForecastType = "hourly" | "daily" | "twice_daily";

export interface ForecastEvent {
  type: ModernForecastType;
  forecast: [ForecastAttribute] | null;
}

export type ForecastType = ModernForecastType | "legacy";

const EIGHT_HOURS = 28800000;
const DAY_IN_MILLISECONDS = 86400000;

const isForecastHourly = (forecast?: ForecastAttribute[]): boolean | undefined => {
  if (forecast && forecast?.length && forecast?.length > 2) {
    const date1 = new Date(forecast[1].datetime);
    const date2 = new Date(forecast[2].datetime);
    const timeDiff = date2.getTime() - date1.getTime();

    return timeDiff < EIGHT_HOURS;
  }

  return undefined;
};

const isForecastTwiceDaily = (forecast?: ForecastAttribute[]): boolean | undefined => {
  if (forecast && forecast?.length && forecast?.length > 2) {
    const date1 = new Date(forecast[1].datetime);
    const date2 = new Date(forecast[2].datetime);
    const timeDiff = date2.getTime() - date1.getTime();

    return timeDiff < DAY_IN_MILLISECONDS;
  }

  return undefined;
};

const getLegacyForecast = (
  weather_attributes?: WeatherEntity["attributes"] | undefined,
):
  | {
      forecast: ForecastAttribute[];
      type: "daily" | "hourly" | "twice_daily";
    }
  | undefined => {
  if (weather_attributes?.forecast && weather_attributes.forecast.length > 2) {
    if (isForecastHourly(weather_attributes.forecast)) {
      return {
        forecast: weather_attributes.forecast,
        type: "hourly",
      };
    }
    if (isForecastTwiceDaily(weather_attributes.forecast)) {
      return {
        forecast: weather_attributes.forecast,
        type: "twice_daily",
      };
    }
    return { forecast: weather_attributes.forecast, type: "daily" };
  }
  return undefined;
};

export const getForecast = (
  weather_attributes: WeatherEntity["attributes"],
  forecast_event: ForecastEvent | null,
  forecast_type?: ForecastType | undefined,
):
  | {
      forecast: ForecastAttribute[];
      type: "daily" | "hourly" | "twice_daily";
    }
  | undefined => {
  if (forecast_type === undefined) {
    if (forecast_event?.type !== undefined && forecast_event?.forecast && forecast_event?.forecast?.length > 2) {
      return { forecast: forecast_event.forecast, type: forecast_event?.type };
    }
    return getLegacyForecast(weather_attributes);
  }

  if (forecast_type === "legacy") {
    return getLegacyForecast(weather_attributes);
  }

  if (forecast_type === forecast_event?.type && forecast_event?.forecast && forecast_event?.forecast?.length > 2) {
    return { forecast: forecast_event.forecast, type: forecast_type };
  }

  return undefined;
};

export const subscribeForecast = (
  connection: Connection,
  entity_id: FilterByDomain<EntityName, "weather">,
  forecast_type: ModernForecastType,
  callback: (forecastevent: ForecastEvent) => void,
) =>
  connection.subscribeMessage<ForecastEvent>(callback, {
    type: "weather/subscribe_forecast",
    forecast_type,
    entity_id,
  });

export const getSupportedForecastTypes = (entity: HassEntityBase): ModernForecastType[] => {
  const supported: ModernForecastType[] = [];
  if (supportsFeatureFromAttributes(entity.attributes, WeatherEntityFeature.FORECAST_DAILY)) {
    supported.push("daily");
  }
  if (supportsFeatureFromAttributes(entity.attributes, WeatherEntityFeature.FORECAST_TWICE_DAILY)) {
    supported.push("twice_daily");
  }
  if (supportsFeatureFromAttributes(entity.attributes, WeatherEntityFeature.FORECAST_HOURLY)) {
    supported.push("hourly");
  }
  return supported;
};

export const getDefaultForecastType = (entity: HassEntityBase) => {
  if (supportsFeatureFromAttributes(entity.attributes, WeatherEntityFeature.FORECAST_DAILY)) {
    return "daily";
  }
  if (supportsFeatureFromAttributes(entity.attributes, WeatherEntityFeature.FORECAST_TWICE_DAILY)) {
    return "twice_daily";
  }
  if (supportsFeatureFromAttributes(entity.attributes, WeatherEntityFeature.FORECAST_HOURLY)) {
    return "hourly";
  }
  return undefined;
};
