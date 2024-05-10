import { HassEntity } from 'home-assistant-js-websocket';
import { createEntity } from './createEntity';

const now = new Date();

const defaults = {
  entity_id: "weather.entity",
  state: "partlycloudy",
  attributes: {
    temperature: 17.6,
    temperature_unit: "°C",
    humidity: 73,
    cloud_coverage: 27.3,
    pressure: 1023.2,
    pressure_unit: "hPa",
    wind_bearing: 13.8,
    wind_speed: 7.2,
    wind_speed_unit: "km/h",
    visibility_unit: "km",
    precipitation_unit: "mm",
    supported_features: 3,
    attribution:
      "Weather forecast from met.no, delivered by the Norwegian Meteorological Institute.",
    friendly_name: "Forecast <City>",
  },
  context: {
    id: "01H5KA3VDF73YM3K69B9NM38RD",
    parent_id: null,
    user_id: null,
  },
  last_changed: now.toISOString(),
  last_updated: now.toISOString(),
} satisfies HassEntity;

export const createWeather = (entity_id: string, overrides: Partial<HassEntity> = {}) => {
  return createEntity(entity_id, defaults, overrides);
}