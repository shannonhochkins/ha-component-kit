import type { HassEntities } from "home-assistant-js-websocket";
import { createAutomation } from "./createAutomation";
import { createBinarySensor } from "./createBinarySensor";
import { createCalendar } from "./createCalendar";
import { createCamera } from "./createCamera";
import { createClimate } from "./createClimate";
import { createCover } from "./createCover";
import { createLight } from "./createLight";
import { createMediaPlayer } from "./createMediaPlayer";
import { createPerson } from "./createPerson";
import { createScene } from "./createScene";
import { createSensor } from "./createSensor";
import { createSwitch } from "./createSwitch";
import { createVacuum } from "./createVacuum";
import { createWeather } from "./createWeather";
import { createAlarmPanel } from "./createAlarmPanel";
// fixtures
import openWeatherFixture from './fixtures/open-weather';

import johnDoe from '../assets/john_doe_ai_generated.png';

export const entities: HassEntities = {
  ...createCover("cover.cover_with_tilt"),
  ...createCover("cover.cover_position_only", {
    attributes: {
      supported_features: 15,
    },
  }),
  ...createCover("cover.cover_no_position", {
    attributes: {
      supported_features: 9,
    },
  }),

  ...createCamera("camera.demo_camera"),
  ...createLight("light.unavailable", {
    state: "unavailable",
    attributes: {
      friendly_name: "Unavailable light demo",
    },
  }),
  ...createSwitch("switch.record", {
    attributes: {
      icon: "mdi:record-rec",
      friendly_name: "Backyard Record",
    },
    state: "on",
  }),
  ...createBinarySensor("binary_sensor.vehicle"),
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
  ...createSwitch("switch.fake_switch"),
  ...createSwitch("switch.unavailable", {
    state: "unavailable",
    attributes: {
      friendly_name: "Unavailable switch demo",
    },
  }),
  ...createSwitch("switch.coffee_machine", {
    attributes: {
      friendly_name: "Coffee Machine",
    },
  }),
  ...createMediaPlayer("media_player.groups", {
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
      entity_picture:
        "https://lh3.googleusercontent.com/sLxiYvk82ZBXIYW-g_qh4BDjkApX4gdRvGxeinQIC0HBwte4AKOzS3u2mDPaYjPBw6dD_Of-r0x10egf=w544-h544-l90-rj",
      friendly_name: "Bedroom Speaker",
      supported_features: 4127295,
    },
  }),
  ...createMediaPlayer("media_player.fake_tv"),
  ...createMediaPlayer("media_player.fake_speaker", {
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
      entity_picture:
        "https://lh3.googleusercontent.com/sLxiYvk82ZBXIYW-g_qh4BDjkApX4gdRvGxeinQIC0HBwte4AKOzS3u2mDPaYjPBw6dD_Of-r0x10egf=w544-h544-l90-rj",
      friendly_name: "Bedroom Speaker",
      supported_features: 152511,
    },
  }),
  ...createMediaPlayer("media_player.fake_speaker_2", {
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
      entity_picture:
        "https://lh3.googleusercontent.com/sLxiYvk82ZBXIYW-g_qh4BDjkApX4gdRvGxeinQIC0HBwte4AKOzS3u2mDPaYjPBw6dD_Of-r0x10egf=w544-h544-l90-rj",
      friendly_name: "Bedroom Speaker",
      supported_features: 152511,
    },
  }),
  ...createScene("scene.good_morning"),
  ...createSensor("sensor.time", {
    attributes: {
      icon: "mdi:clock",
      friendly_name: "Time",
    },
  }),
  ...createSensor("sensor.date", {
    state: "2023-07-19",
    attributes: {
      icon: "mdi:calendar",
      friendly_name: "Date",
    },
  }),
  ...createSensor("sensor.air_conditioner_inside_temperature", {
    state: "21",
    attributes: {
      unit_of_measurement: "°C",
      friendly_name: "Air Conditioner Inside Temperature",
    },
  }),
  ...createSensor("sensor.openweathermap_uv_index", {
    entity_id: "sensor.openweathermap_uv_index",
    state: "6.6",
    attributes: {
      state_class: "measurement",
      unit_of_measurement: "UV index",
      attribution: "Data provided by OpenWeatherMap",
      icon: "mdi:sun-wireless-outline",
      friendly_name: "UV Index",
    },
  }),
  ...createSensor("sensor.openweathermap_wind_speed", {
    entity_id: "sensor.openweathermap_wind_speed",
    state: "15.91",
    attributes: {
      state_class: "measurement",
      unit_of_measurement: "km/h",
      attribution: "Data provided by OpenWeatherMap",
      device_class: "wind_speed",
      friendly_name: "Wind speed",
    },
  }),
  ...createSensor("sensor.openweathermap_humidity", {
    entity_id: "sensor.openweathermap_humidity",
    state: "53",
    attributes: {
      state_class: "measurement",
      unit_of_measurement: "%",
      attribution: "Data provided by OpenWeatherMap",
      device_class: "humidity",
      friendly_name: "Humidity",
    },
  }),
  ...createSensor("sensor.openweathermap_pressure", {
    entity_id: "sensor.openweathermap_pressure",
    state: "1025",
    attributes: {
      state_class: "measurement",
      unit_of_measurement: "hPa",
      attribution: "Data provided by OpenWeatherMap",
      device_class: "pressure",
      friendly_name: "Pressure",
    },
  }),
  ...createSensor("sensor.curtain", {
    state: "12",
    attributes: {
      device_class: "battery",
      icon: "mdi:curtains",
      friendly_name: "Office curtain sensor",
      unit_of_measurement: "%",
    },
  }),
  ...createSensor("sensor.remote", {
    state: "20",
    attributes: {
      icon: "mdi:remote",
      friendly_name: "Remote battery",
      device_class: "battery",
      unit_of_measurement: "%",
    },
  }),
  ...createSensor("sensor.motion_sensor", {
    state: "3",
    attributes: {
      device_class: "battery",
      friendly_name: "Motion Sensor",
      icon: "mdi:proximity-sensor-off",
      unit_of_measurement: "%",
    },
  }),
  ...createCalendar("calendar.google_calendar"),
  ...createCalendar("calendar.another_google_calendar"),
  ...createWeather("weather.entity"),
  ...createWeather("weather.openweathermap", openWeatherFixture),
  ...createClimate("climate.air_conditioner"),
  ...createClimate("climate.unavailable", {
    state: "unavailable",
    attributes: {
      hvac_action: "unavailable",
    },
  }),
  ...createVacuum("vacuum.robot_vacuum"),
  ...createAutomation("automation.dim_lights"),
  ...createPerson("person.john_doe", { attributes: { entity_picture: johnDoe } }),
  ...createPerson("person.jane_doe", {
    state: "not_home",
    attributes: { friendly_name: "Jane", latitude: 48.857543231604986, longitude: 2.274926660937714 },
  }),
  ...createAlarmPanel("alarm_control_panel.home_alarm"),
  ...createAlarmPanel("alarm_control_panel.no_code", {
    attributes: {
      supported_features: 11,
      code_format: undefined,
    }
  }),
  ...createSensor("sensor.alarm_battery", {
    state: "20",
    attributes: {
      icon: undefined,
      friendly_name: "Alarm battery",
      device_class: "battery",
      unit_of_measurement: "%",
    },
  }),
} as const;
