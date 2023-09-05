import type { HassEntities } from "home-assistant-js-websocket";
import { createLight } from "./createLight";
import { createSwitch } from "./createSwitch";
import { createMediaPlayer } from './createMediaPlayer';
import { createSensor } from './createSensor';
import { createScene } from './createScene';
import { createWeather } from './createWeather';
import { createClimate } from './createClimate';
import { createVacuum } from './createVacuum';

export const entities: HassEntities = {
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
  ...createScene('scene.goodmorning'),
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
  ...createWeather("weather.entity"),
  ...createClimate("climate.air_conditioner"),
  ...createVacuum("vacuum.robot_vacuum"),
} as const;
