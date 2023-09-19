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

export const entities: HassEntities = {
  ...createLight('light.unavailable', {
    "state": "unavailable",
    attributes: {
      friendly_name: 'Unavailable light demo',
    }
  }),
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
  ...createWeather("weather.entity"),
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
