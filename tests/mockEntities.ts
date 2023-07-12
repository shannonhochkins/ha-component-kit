import type { HassEntities } from "home-assistant-js-websocket";
// Current time
const now = new Date();

// Subtracting 1 day
const oneDayAgo = new Date(now);
oneDayAgo.setDate(now.getDate() - 1);

// Subtracting 2 minutes
const twoMinutesAgo = new Date(now);
twoMinutesAgo.setMinutes(now.getMinutes() - 2);

// Subtracting 2 hours
const twoHoursAgo = new Date(now);
twoHoursAgo.setHours(now.getHours() - 2);

// formatted time based on now
const formatted = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });


export const entities: HassEntities = {
  'light.fake_light': {
    attributes: {
      friendly_name: 'Dining room light',
      icon: "mdi:light-recessed",
      "min_color_temp_kelvin": 2702,
      "max_color_temp_kelvin": 6535,
      "min_mireds": 153,
      "max_mireds": 370,
      "effect_list": [
          "Night",
          "Read",
          "Meeting",
          "Leasure",
          "Soft",
          "Rainbow",
          "Shine",
          "Beautiful",
          "Music"
      ],
      "supported_color_modes": [
          "color_temp",
          "hs"
      ],
      "color_mode": "hs",
      "brightness": 255,
      "hs_color": [
          9,
          67.1
      ],
      "rgb_color": [
          255,
          109,
          83
      ],
      "xy_color": [
          0.591,
          0.328
      ],
      "raw_state": true,
      "supported_features": 23
    },
    state: 'on',
    entity_id: 'light.fake_light',
    last_changed: twoHoursAgo.toISOString(),
    last_updated: twoHoursAgo.toISOString(),
    context: {
      id: '',
      user_id: null,
      parent_id: null,
    }
  },
  'switch.fake_gaming_switch': {
    attributes: {
      friendly_name: 'Gaming Computer'
    },
    state: 'off',
    entity_id: 'switch.fake_gaming_switch',
    last_changed: twoMinutesAgo.toISOString(),
    last_updated: twoMinutesAgo.toISOString(),
    context: {
      id: '',
      user_id: null,
      parent_id: null,
    }
  },
  'media_player.fake_tv': {
    attributes: {
      friendly_name: 'Living room TV'
    },
    state: 'off',
    entity_id: 'media_player.fake_tv',
    last_changed: oneDayAgo.toDateString(),
    last_updated: oneDayAgo.toDateString(),
    context: {
      id: '',
      user_id: null,
      parent_id: null,
    }
  },
  'scene.good_morning': {
    entity_id: "scene.goodmorning",
    state: oneDayAgo.toISOString(),
    attributes: {
        entity_id: [
            "light.all_office_lights_2"
        ],
        id: "1688447567040",
        icon: "mdi:sun-clock",
        friendly_name: "Goodmorning"
    },
    context: {
        id: "01H4FP0HY3K7R49GJS574K5TPW",
        parent_id: null,
        user_id: null
    },
    last_changed: oneDayAgo.toISOString(),
    last_updated: oneDayAgo.toISOString()
  },
  'sensor.time': {
    entity_id: "sensor.time",
    state: formatted,
    attributes: {
        icon: "mdi:clock",
        friendly_name: "Time"
    },
    context: {
        id: "01H4JAXGF1RTA2MJGGPGAGM7VD",
        parent_id: null,
        user_id: null
    },
    last_changed: now.toISOString(),
    last_updated: now.toISOString()
  },
  'climate.air_conditioner': {
    entity_id: "climate.air_conditioner",
    state: "off",
    attributes: {
        hvac_modes: [
            "fan_only",
            "dry",
            "cool",
            "heat",
            "heat_cool",
            "off"
        ],
        min_temp: 7,
        max_temp: 35,
        target_temp_step: 1,
        fan_modes: [
            "Low",
            "Mid",
            "High"
        ],
        current_temperature: 24,
        temperature: 25,
        fan_mode: "High",
        hvac_action: "off",
        friendly_name: "Air Conditioner",
        supported_features: 9
    },
    context: {
        id: "01H4J3SQV4JJX4KF6G28K2AADY",
        parent_id: null,
        user_id: null
    },
    last_changed: oneDayAgo.toDateString(),
    last_updated: oneDayAgo.toDateString()
}
}