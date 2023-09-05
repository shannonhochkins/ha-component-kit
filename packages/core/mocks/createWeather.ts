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
    forecast: [
      {
        condition: "partlycloudy",
        datetime: "2023-07-18T02:00:00+00:00",
        wind_bearing: 15,
        temperature: 20.8,
        templow: 12.7,
        wind_speed: 20.9,
        precipitation: 0,
        humidity: 64,
      },
      {
        condition: "sunny",
        datetime: "2023-07-19T02:00:00+00:00",
        wind_bearing: 199.3,
        temperature: 16.2,
        templow: 8.2,
        wind_speed: 34.6,
        precipitation: 0,
        humidity: 32,
      },
      {
        condition: "sunny",
        datetime: "2023-07-20T02:00:00+00:00",
        wind_bearing: 6.7,
        temperature: 18.7,
        templow: 5,
        wind_speed: 22,
        precipitation: 0,
        humidity: 43,
      },
      {
        condition: "partlycloudy",
        datetime: "2023-07-21T02:00:00+00:00",
        wind_bearing: 178.8,
        temperature: 14.4,
        templow: 10.3,
        wind_speed: 19.1,
        precipitation: 2,
        humidity: 71,
      },
      {
        condition: "sunny",
        datetime: "2023-07-22T02:00:00+00:00",
        wind_bearing: 156.6,
        temperature: 15.4,
        templow: 6.2,
        wind_speed: 15.1,
        precipitation: 0,
        humidity: 40,
      },
      {
        condition: "rainy",
        datetime: "2023-07-23T02:00:00+00:00",
        wind_bearing: 217.2,
        temperature: 12.5,
        templow: 6.7,
        wind_speed: 19.8,
        precipitation: 8.7,
        humidity: 88,
      },
    ],
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