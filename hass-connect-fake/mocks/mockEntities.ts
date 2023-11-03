import type { HassEntities } from "home-assistant-js-websocket";
import { createLight } from "./createLight";
import { createSwitch } from "./createSwitch";
import { createMediaPlayer } from './createMediaPlayer';
import { createSensor } from './createSensor';
import { createScene } from './createScene';
import { createWeather } from './createWeather';
import { createClimate } from './createClimate';
import { createVacuum } from './createVacuum';
import { createAutomation } from './createAutomation';
import { createCalendar } from './createCalendar';
import { createCamera } from './createCamera';
import { createBinarySensor } from './createBinarySensor';
import { createCover} from './createCover';

export const entities: HassEntities = {
  ...createCover('cover.cover_with_tilt'),
  ...createCover('cover.cover_position_only', {
    attributes: {
      supported_features: 15,
    }
  }),
  ...createCover('cover.cover_no_position', {
    attributes: {
      supported_features: 9,
    }
  }),
  
  ...createCamera('camera.demo_camera'),
  ...createLight('light.unavailable', {
    "state": "unavailable",
    attributes: {
      friendly_name: 'Unavailable light demo',
    }
  }),
  ...createSwitch('switch.record', {
    attributes: {
      icon: "mdi:record-rec",
      friendly_name: "Backyard Record"
    },
    state: 'on'
  }),
  ...createBinarySensor('binary_sensor.vehicle'),
  ...createLight("light.fake_light_1", {
    attributes: {
      friendly_name: "Dining room light",
    },
  }),
  ...createLight("light.fake_light_2", {
    attributes: {
      friendly_name: "Office Down light",
      hs_color: undefined,
      rgb_color: undefined,
      color_mode: "color_temp",
      color_temp_kelvin: 3000,
    },
  }),
  ...createLight("light.fake_light_3", {
    attributes: {
      friendly_name: "Office striplight light",
      icon: "mdi:led-strip-variant",
      hs_color: [131, 100],
      rgb_color: [64, 255, 112],
    },
  }),
  ...createSwitch('switch.fake_switch'),
  ...createSwitch('switch.unavailable', {
    state: "unavailable",
    attributes: {
      friendly_name: "Unavailable switch demo",
    },
  }),
  ...createSwitch('switch.coffee_machine', {
    attributes: {
      friendly_name: "Coffee Machine",
    }
  }),
  ...createMediaPlayer('media_player.fake_tv'),
  ...createMediaPlayer('media_player.fake_speaker', {
    state: "playing",
    attributes: {
      volume_level: 0.54,
      is_volume_muted: false,
      media_content_type: "music",
      media_duration: 219,
      media_position: 1.819,
      media_position_updated_at: "2023-09-11T05:34:34.858634+00:00",
      media_title: "My Way",
      media_artist: "Calvin Harris",
      app_name: "YouTube Music",
      entity_picture: "https://lh3.googleusercontent.com/sLxiYvk82ZBXIYW-g_qh4BDjkApX4gdRvGxeinQIC0HBwte4AKOzS3u2mDPaYjPBw6dD_Of-r0x10egf=w544-h544-l90-rj",
      friendly_name: "Bedroom Speaker",
      supported_features: 152511
    }
  }),
  ...createMediaPlayer('media_player.fake_speaker_2', {
    state: "playing",
    attributes: {
      volume_level: 0.54,
      is_volume_muted: false,
      media_content_type: "music",
      media_duration: 219,
      media_position: 1.819,
      media_position_updated_at: "2023-09-11T05:34:34.858634+00:00",
      media_title: "My Way",
      media_artist: "Calvin Harris",
      app_name: "YouTube Music",
      entity_picture: "https://lh3.googleusercontent.com/sLxiYvk82ZBXIYW-g_qh4BDjkApX4gdRvGxeinQIC0HBwte4AKOzS3u2mDPaYjPBw6dD_Of-r0x10egf=w544-h544-l90-rj",
      friendly_name: "Bedroom Speaker",
      supported_features: 152511
    }
  }),
  ...createScene('scene.good_morning'),
  ...createSensor('sensor.time', {
    attributes: {
      icon: "mdi:clock",
      friendly_name: "Time",
    },
  }),
  ...createSensor('sensor.date', {
    state: "2023-07-19",
    attributes: {
      icon: "mdi:calendar",
      friendly_name: "Date",
    },
  }),
  ...createSensor('sensor.air_conditioner_inside_temperature', {
    state: "21",
    attributes: {
      unit_of_measurement: "°C",
      friendly_name: "Air Conditioner Inside Temperature",
    },
  }),
  ...createSensor('sensor.openweathermap_uv_index', {
    entity_id: "sensor.openweathermap_uv_index",
    state: "6.6",
    attributes: {
        state_class: "measurement",
        unit_of_measurement: "UV index",
        attribution: "Data provided by OpenWeatherMap",
        icon: "mdi:sun-wireless-outline",
        friendly_name: "UV Index"
    },
  }),
  ...createSensor('sensor.openweathermap_wind_speed', {
      entity_id: "sensor.openweathermap_wind_speed",
      state: "15.91",
      attributes: {
          state_class: "measurement",
          unit_of_measurement: "km/h",
          attribution: "Data provided by OpenWeatherMap",
          device_class: "wind_speed",
          friendly_name: "Wind speed"
      },
  }),
  ...createSensor('sensor.openweathermap_humidity', {
    entity_id: "sensor.openweathermap_humidity",
    state: "53",
    attributes: {
        state_class: "measurement",
        unit_of_measurement: "%",
        attribution: "Data provided by OpenWeatherMap",
        device_class: "humidity",
        friendly_name: "Humidity"
    },
  }),
  ...createSensor('sensor.openweathermap_pressure', {
    entity_id: "sensor.openweathermap_pressure",
    state: "1025",
    attributes: {
        state_class: "measurement",
        unit_of_measurement: "hPa",
        attribution: "Data provided by OpenWeatherMap",
        device_class: "pressure",
        friendly_name: "Pressure"
    },
  }),
  ...createSensor('sensor.curtain', {
    state: '12',
    attributes: {
      device_class: 'battery',
      icon: 'mdi:curtains',
      friendly_name: 'Office curtain sensor',
      unit_of_measurement: '%'
    }
  }),
  ...createSensor('sensor.remote', {
    state: '20',
    attributes: {
      icon: 'mdi:remote',
      friendly_name: 'Remote battery',
      device_class: 'battery',
      unit_of_measurement: '%'
    }
  }),
  ...createSensor('sensor.motion_sensor', {
    state: '3',
    attributes: {
      device_class: 'battery',
      friendly_name: 'Motion Sensor',
      icon: "mdi:proximity-sensor-off",
      unit_of_measurement: '%'
    }
  }),
  ...createCalendar("calendar.google_calendar"),
  ...createCalendar("calendar.another_google_calendar"),
  ...createWeather("weather.entity"),
  ...createWeather('weather.openweathermap', {
    "entity_id": "weather.openweathermap",
    "state": "sunny",
    "attributes": {
        "temperature": 20.1,
        "apparent_temperature": 19.5,
        "temperature_unit": "°C",
        "humidity": 53,
        "cloud_coverage": 10,
        "pressure": 1025,
        "pressure_unit": "hPa",
        "wind_bearing": 84,
        "wind_gust_speed": 13.25,
        "wind_speed": 15.91,
        "wind_speed_unit": "km/h",
        "visibility_unit": "km",
        "precipitation_unit": "mm",
        "forecast": [
            {
                "condition": "partlycloudy",
                "precipitation_probability": 0,
                "datetime": "2023-09-24T06:00:00+00:00",
                "wind_bearing": 70,
                "cloud_coverage": 11,
                "temperature": 19.1,
                "pressure": 1025,
                "wind_speed": 16.06,
                "precipitation": 0,
                "humidity": 55
            },
            {
                "condition": "clear-night",
                "precipitation_probability": 0,
                "datetime": "2023-09-24T09:00:00+00:00",
                "wind_bearing": 54,
                "cloud_coverage": 4,
                "temperature": 17.1,
                "pressure": 1025,
                "wind_speed": 18.11,
                "precipitation": 0,
                "humidity": 63
            },
            {
                "condition": "clear-night",
                "precipitation_probability": 0,
                "datetime": "2023-09-24T12:00:00+00:00",
                "wind_bearing": 25,
                "cloud_coverage": 0,
                "temperature": 14.2,
                "pressure": 1026,
                "wind_speed": 13.75,
                "precipitation": 0,
                "humidity": 76
            },
            {
                "condition": "clear-night",
                "precipitation_probability": 0,
                "datetime": "2023-09-24T15:00:00+00:00",
                "wind_bearing": 320,
                "cloud_coverage": 0,
                "temperature": 11.9,
                "pressure": 1024,
                "wind_speed": 7.74,
                "precipitation": 0,
                "humidity": 86
            },
            {
                "condition": "clear-night",
                "precipitation_probability": 0,
                "datetime": "2023-09-24T18:00:00+00:00",
                "wind_bearing": 320,
                "cloud_coverage": 1,
                "temperature": 11.4,
                "pressure": 1024,
                "wind_speed": 5.11,
                "precipitation": 0,
                "humidity": 88
            },
            {
                "condition": "sunny",
                "precipitation_probability": 0,
                "datetime": "2023-09-24T21:00:00+00:00",
                "wind_bearing": 326,
                "cloud_coverage": 2,
                "temperature": 12.8,
                "pressure": 1025,
                "wind_speed": 7.38,
                "precipitation": 0,
                "humidity": 82
            },
            {
                "condition": "sunny",
                "precipitation_probability": 0,
                "datetime": "2023-09-25T00:00:00+00:00",
                "wind_bearing": 49,
                "cloud_coverage": 1,
                "temperature": 18.5,
                "pressure": 1023,
                "wind_speed": 11.59,
                "precipitation": 0,
                "humidity": 57
            },
            {
                "condition": "sunny",
                "precipitation_probability": 0,
                "datetime": "2023-09-25T03:00:00+00:00",
                "wind_bearing": 72,
                "cloud_coverage": 0,
                "temperature": 20,
                "pressure": 1020,
                "wind_speed": 22.28,
                "precipitation": 0,
                "humidity": 57
            },
            {
                "condition": "sunny",
                "precipitation_probability": 0,
                "datetime": "2023-09-25T06:00:00+00:00",
                "wind_bearing": 59,
                "cloud_coverage": 0,
                "temperature": 19,
                "pressure": 1018,
                "wind_speed": 23.58,
                "precipitation": 0,
                "humidity": 68
            },
            {
                "condition": "partlycloudy",
                "precipitation_probability": 0,
                "datetime": "2023-09-25T09:00:00+00:00",
                "wind_bearing": 44,
                "cloud_coverage": 24,
                "temperature": 17.2,
                "pressure": 1019,
                "wind_speed": 18.72,
                "precipitation": 0,
                "humidity": 82
            },
            {
                "condition": "cloudy",
                "precipitation_probability": 0,
                "datetime": "2023-09-25T12:00:00+00:00",
                "wind_bearing": 8,
                "cloud_coverage": 60,
                "temperature": 16.1,
                "pressure": 1020,
                "wind_speed": 9.07,
                "precipitation": 0,
                "humidity": 78
            },
            {
                "condition": "partlycloudy",
                "precipitation_probability": 0,
                "datetime": "2023-09-25T15:00:00+00:00",
                "wind_bearing": 217,
                "cloud_coverage": 36,
                "temperature": 14.4,
                "pressure": 1019,
                "wind_speed": 11.56,
                "precipitation": 0,
                "humidity": 84
            },
            {
                "condition": "partlycloudy",
                "precipitation_probability": 0,
                "datetime": "2023-09-25T18:00:00+00:00",
                "wind_bearing": 247,
                "cloud_coverage": 21,
                "temperature": 13.3,
                "pressure": 1019,
                "wind_speed": 11.56,
                "precipitation": 0,
                "humidity": 86
            },
            {
                "condition": "cloudy",
                "precipitation_probability": 0,
                "datetime": "2023-09-25T21:00:00+00:00",
                "wind_bearing": 248,
                "cloud_coverage": 52,
                "temperature": 15.2,
                "pressure": 1021,
                "wind_speed": 12.17,
                "precipitation": 0,
                "humidity": 83
            },
            {
                "condition": "cloudy",
                "precipitation_probability": 0,
                "datetime": "2023-09-26T00:00:00+00:00",
                "wind_bearing": 172,
                "cloud_coverage": 64,
                "temperature": 20.1,
                "pressure": 1021,
                "wind_speed": 15.98,
                "precipitation": 0,
                "humidity": 69
            },
            {
                "condition": "rainy",
                "precipitation_probability": 20,
                "datetime": "2023-09-26T03:00:00+00:00",
                "wind_bearing": 138,
                "cloud_coverage": 87,
                "temperature": 20.2,
                "pressure": 1019,
                "wind_speed": 18.83,
                "precipitation": 0.23,
                "humidity": 71
            },
            {
                "condition": "rainy",
                "precipitation_probability": 33,
                "datetime": "2023-09-26T06:00:00+00:00",
                "wind_bearing": 144,
                "cloud_coverage": 93,
                "temperature": 18.3,
                "pressure": 1019,
                "wind_speed": 9.9,
                "precipitation": 0.45,
                "humidity": 84
            },
            {
                "condition": "rainy",
                "precipitation_probability": 51,
                "datetime": "2023-09-26T09:00:00+00:00",
                "wind_bearing": 114,
                "cloud_coverage": 95,
                "temperature": 16.8,
                "pressure": 1020,
                "wind_speed": 8.1,
                "precipitation": 1.26,
                "humidity": 91
            },
            {
                "condition": "cloudy",
                "precipitation_probability": 47,
                "datetime": "2023-09-26T12:00:00+00:00",
                "wind_bearing": 317,
                "cloud_coverage": 63,
                "temperature": 16.3,
                "pressure": 1020,
                "wind_speed": 3.02,
                "precipitation": 0,
                "humidity": 91
            },
            {
                "condition": "partlycloudy",
                "precipitation_probability": 0,
                "datetime": "2023-09-26T15:00:00+00:00",
                "wind_bearing": 253,
                "cloud_coverage": 44,
                "temperature": 15.3,
                "pressure": 1019,
                "wind_speed": 4.86,
                "precipitation": 0,
                "humidity": 93
            },
            {
                "condition": "partlycloudy",
                "precipitation_probability": 0,
                "datetime": "2023-09-26T18:00:00+00:00",
                "wind_bearing": 253,
                "cloud_coverage": 38,
                "temperature": 14.4,
                "pressure": 1018,
                "wind_speed": 6.08,
                "precipitation": 0,
                "humidity": 96
            },
            {
                "condition": "cloudy",
                "precipitation_probability": 0,
                "datetime": "2023-09-26T21:00:00+00:00",
                "wind_bearing": 282,
                "cloud_coverage": 70,
                "temperature": 15.6,
                "pressure": 1019,
                "wind_speed": 2.3,
                "precipitation": 0,
                "humidity": 93
            },
            {
                "condition": "rainy",
                "precipitation_probability": 24,
                "datetime": "2023-09-27T00:00:00+00:00",
                "wind_bearing": 165,
                "cloud_coverage": 85,
                "temperature": 17.5,
                "pressure": 1020,
                "wind_speed": 3.89,
                "precipitation": 0.23,
                "humidity": 87
            },
            {
                "condition": "rainy",
                "precipitation_probability": 20,
                "datetime": "2023-09-27T03:00:00+00:00",
                "wind_bearing": 115,
                "cloud_coverage": 100,
                "temperature": 18.1,
                "pressure": 1018,
                "wind_speed": 15.08,
                "precipitation": 0.23,
                "humidity": 84
            },
            {
                "condition": "cloudy",
                "precipitation_probability": 0,
                "datetime": "2023-09-27T06:00:00+00:00",
                "wind_bearing": 126,
                "cloud_coverage": 100,
                "temperature": 18.1,
                "pressure": 1017,
                "wind_speed": 14.8,
                "precipitation": 0,
                "humidity": 82
            },
            {
                "condition": "cloudy",
                "precipitation_probability": 18,
                "datetime": "2023-09-27T09:00:00+00:00",
                "wind_bearing": 62,
                "cloud_coverage": 100,
                "temperature": 17.1,
                "pressure": 1019,
                "wind_speed": 11.12,
                "precipitation": 0,
                "humidity": 91
            },
            {
                "condition": "rainy",
                "precipitation_probability": 49,
                "datetime": "2023-09-27T12:00:00+00:00",
                "wind_bearing": 192,
                "cloud_coverage": 96,
                "temperature": 16.6,
                "pressure": 1021,
                "wind_speed": 2.56,
                "precipitation": 0.86,
                "humidity": 93
            },
            {
                "condition": "rainy",
                "precipitation_probability": 87,
                "datetime": "2023-09-27T15:00:00+00:00",
                "wind_bearing": 177,
                "cloud_coverage": 100,
                "temperature": 16.8,
                "pressure": 1021,
                "wind_speed": 4.18,
                "precipitation": 1.99,
                "humidity": 91
            },
            {
                "condition": "rainy",
                "precipitation_probability": 96,
                "datetime": "2023-09-27T18:00:00+00:00",
                "wind_bearing": 209,
                "cloud_coverage": 100,
                "temperature": 15.9,
                "pressure": 1022,
                "wind_speed": 10.8,
                "precipitation": 1,
                "humidity": 92
            },
            {
                "condition": "rainy",
                "precipitation_probability": 39,
                "datetime": "2023-09-27T21:00:00+00:00",
                "wind_bearing": 204,
                "cloud_coverage": 84,
                "temperature": 16.5,
                "pressure": 1025,
                "wind_speed": 12.74,
                "precipitation": 0.19,
                "humidity": 89
            },
            {
                "condition": "rainy",
                "precipitation_probability": 71,
                "datetime": "2023-09-28T00:00:00+00:00",
                "wind_bearing": 139,
                "cloud_coverage": 55,
                "temperature": 18.1,
                "pressure": 1026,
                "wind_speed": 17.03,
                "precipitation": 0.82,
                "humidity": 81
            },
            {
                "condition": "rainy",
                "precipitation_probability": 64,
                "datetime": "2023-09-28T03:00:00+00:00",
                "wind_bearing": 129,
                "cloud_coverage": 52,
                "temperature": 18.8,
                "pressure": 1025,
                "wind_speed": 17.21,
                "precipitation": 0.56,
                "humidity": 67
            },
            {
                "condition": "partlycloudy",
                "precipitation_probability": 43,
                "datetime": "2023-09-28T06:00:00+00:00",
                "wind_bearing": 115,
                "cloud_coverage": 36,
                "temperature": 18.1,
                "pressure": 1025,
                "wind_speed": 12.71,
                "precipitation": 0,
                "humidity": 67
            },
            {
                "condition": "clear-night",
                "precipitation_probability": 0,
                "datetime": "2023-09-28T09:00:00+00:00",
                "wind_bearing": 75,
                "cloud_coverage": 3,
                "temperature": 16.1,
                "pressure": 1026,
                "wind_speed": 9.22,
                "precipitation": 0,
                "humidity": 80
            },
            {
                "condition": "clear-night",
                "precipitation_probability": 0,
                "datetime": "2023-09-28T12:00:00+00:00",
                "wind_bearing": 18,
                "cloud_coverage": 2,
                "temperature": 15.3,
                "pressure": 1027,
                "wind_speed": 7.99,
                "precipitation": 0,
                "humidity": 84
            },
            {
                "condition": "clear-night",
                "precipitation_probability": 0,
                "datetime": "2023-09-28T15:00:00+00:00",
                "wind_bearing": 299,
                "cloud_coverage": 1,
                "temperature": 13.5,
                "pressure": 1026,
                "wind_speed": 7.56,
                "precipitation": 0,
                "humidity": 90
            },
            {
                "condition": "clear-night",
                "precipitation_probability": 0,
                "datetime": "2023-09-28T18:00:00+00:00",
                "wind_bearing": 311,
                "cloud_coverage": 1,
                "temperature": 13,
                "pressure": 1025,
                "wind_speed": 6.52,
                "precipitation": 0,
                "humidity": 89
            },
            {
                "condition": "sunny",
                "precipitation_probability": 0,
                "datetime": "2023-09-28T21:00:00+00:00",
                "wind_bearing": 326,
                "cloud_coverage": 3,
                "temperature": 14.7,
                "pressure": 1025,
                "wind_speed": 8.64,
                "precipitation": 0,
                "humidity": 84
            },
            {
                "condition": "sunny",
                "precipitation_probability": 0,
                "datetime": "2023-09-29T00:00:00+00:00",
                "wind_bearing": 10,
                "cloud_coverage": 2,
                "temperature": 22.3,
                "pressure": 1022,
                "wind_speed": 11.95,
                "precipitation": 0,
                "humidity": 53
            },
            {
                "condition": "sunny",
                "precipitation_probability": 0,
                "datetime": "2023-09-29T03:00:00+00:00",
                "wind_bearing": 39,
                "cloud_coverage": 0,
                "temperature": 26,
                "pressure": 1018,
                "wind_speed": 11.05,
                "precipitation": 0,
                "humidity": 42
            }
        ],
        "attribution": "Data provided by OpenWeatherMap",
        "friendly_name": "OpenWeatherMap",
        "supported_features": 2
    },
  }),
  ...createClimate("climate.air_conditioner"),
  ...createClimate("climate.unavailable", {
    state: 'unavailable',
    attributes: {
      hvac_action: 'unavailable',
    }
  }),
  ...createVacuum("vacuum.robot_vacuum"),
  ...createAutomation("automation.dim_lights"),
} as const;
