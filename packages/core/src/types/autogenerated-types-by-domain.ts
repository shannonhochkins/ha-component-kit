/* eslint-disable @typescript-eslint/no-explicit-any */
// auto generated, do not manipulate, instead run the sync-ha-types script
import {
  HassEntityBase,
  HassEntityAttributeBase,
} from "home-assistant-js-websocket";
export type HvacAction =
  | "off"
  | "preheating"
  | "heating"
  | "cooling"
  | "drying"
  | "idle"
  | "fan";

export type HvacMode = (typeof HVAC_MODES)[number];
export const HVAC_MODES = [
  "auto",
  "heat_cool",
  "heat",
  "cool",
  "dry",
  "fan_only",
  "off",
] as const;

export type HumidifierAction = "off" | "idle" | "humidifying" | "drying";
export const MODES = ["single", "restart", "queued", "parallel"] as const;

export type OperationMode = (typeof OPERATION_MODES)[number];
export const OPERATION_MODES = [
  "electric",
  "gas",
  "heat_pump",
  "eco",
  "performance",
  "high_demand",
  "off",
] as const;

export interface AlarmControlPanelEntity extends HassEntityBase {
  attributes: AlarmControlPanelEntityAttributes;
}

export interface AlarmControlPanelEntityAttributes
  extends HassEntityAttributeBase {
  code_format?: "text" | "number";
  changed_by?: string | null;
  code_arm_required?: boolean;
}
export interface AutomationEntity extends HassEntityBase {
  attributes: HassEntityAttributeBase & {
    id?: string;
    last_triggered: string;
  };
}
export interface CameraEntity extends HassEntityBase {
  attributes: CameraEntityAttributes;
}

export interface CameraEntityAttributes extends HassEntityAttributeBase {
  model_name: string;
  access_token: string;
  brand: string;
  motion_detection: boolean;
  frontend_stream_type: string;
}
export type ClimateEntity = HassEntityBase & {
  attributes: HassEntityAttributeBase & {
    hvac_mode: HvacMode;
    hvac_modes: HvacMode[];
    hvac_action?: HvacAction;
    current_temperature: number;
    min_temp: number;
    max_temp: number;
    temperature: number;
    target_temp_step?: number;
    target_temp_high?: number;
    target_temp_low?: number;
    humidity?: number;
    current_humidity?: number;
    target_humidity_low?: number;
    target_humidity_high?: number;
    min_humidity?: number;
    max_humidity?: number;
    fan_mode?: string;
    fan_modes?: string[];
    preset_mode?: string;
    preset_modes?: string[];
    swing_mode?: string;
    swing_modes?: string[];
    aux_heat?: "on" | "off";
  };
};
export interface CoverEntity extends HassEntityBase {
  attributes: CoverEntityAttributes;
}

export interface CoverEntityAttributes extends HassEntityAttributeBase {
  current_position?: number;
  current_tilt_position?: number;
}
export interface FanEntity extends HassEntityBase {
  attributes: FanEntityAttributes;
}

export interface FanEntityAttributes extends HassEntityAttributeBase {
  direction?: string;
  oscillating?: boolean;
  percentage?: number;
  percentage_step?: number;
  preset_mode?: string;
  preset_modes?: string[];
}
export interface GroupEntity extends HassEntityBase {
  attributes: GroupEntityAttributes;
}

export interface GroupEntityAttributes extends HassEntityAttributeBase {
  entity_id: string[];
  order: number;
  auto?: boolean;
  view?: boolean;
  control?: "hidden";
}
export type HumidifierEntity = HassEntityBase & {
  attributes: HassEntityAttributeBase & {
    humidity?: number;
    current_humidity?: number;
    min_humidity?: number;
    max_humidity?: number;
    mode?: string;
    action?: HumidifierAction;
    available_modes?: string[];
  };
};
export interface ImageEntity extends HassEntityBase {
  attributes: ImageEntityAttributes;
}

export interface ImageEntityAttributes extends HassEntityAttributeBase {
  access_token: string;
}
export interface InputSelectEntity extends HassEntityBase {
  attributes: InputSelectEntityAttributes;
}

export interface InputSelectEntityAttributes extends HassEntityAttributeBase {
  options: string[];
}
export interface LawnMowerEntity extends HassEntityBase {
  attributes: LawnMowerEntityAttributes;
}

export interface LawnMowerEntityAttributes extends HassEntityAttributeBase {
  [key: string]: any;
}
export type LightColor =
  | {
      color_temp_kelvin: number;
    }
  | {
      hs_color: [number, number];
    }
  | {
      rgb_color: [number, number, number];
    }
  | {
      rgbw_color: [number, number, number, number];
    }
  | {
      rgbww_color: [number, number, number, number, number];
    };
export const LIGHT_COLOR_MODES = {
  UNKNOWN: "unknown",
  ONOFF: "onoff",
  BRIGHTNESS: "brightness",
  COLOR_TEMP: "color_temp",
  HS: "hs",
  XY: "xy",
  RGB: "rgb",
  RGBW: "rgbw",
  RGBWW: "rgbww",
  WHITE: "white",
};
export type LightColorMode =
  (typeof LIGHT_COLOR_MODES)[keyof typeof LIGHT_COLOR_MODES];
export interface LightEntity extends HassEntityBase {
  attributes: LightEntityAttributes;
}

export interface LightEntityAttributes extends HassEntityAttributeBase {
  min_color_temp_kelvin?: number;
  max_color_temp_kelvin?: number;
  min_mireds?: number;
  max_mireds?: number;
  brightness?: number;
  xy_color?: [number, number];
  hs_color?: [number, number];
  color_temp?: number;
  color_temp_kelvin?: number;
  rgb_color?: [number, number, number];
  rgbw_color?: [number, number, number, number];
  rgbww_color?: [number, number, number, number, number];
  effect?: string;
  effect_list?: string[] | null;
  supported_color_modes?: LightColorMode[];
  color_mode?: LightColorMode;
}
export interface LockEntity extends HassEntityBase {
  attributes: LockEntityAttributes;
}

export interface LockEntityAttributes extends HassEntityAttributeBase {
  code_format?: string;
  changed_by?: string | null;
}
export interface MediaPlayerEntity extends HassEntityBase {
  attributes: MediaPlayerEntityAttributes;
  state:
    | "playing"
    | "paused"
    | "idle"
    | "off"
    | "on"
    | "unavailable"
    | "unknown"
    | "standby"
    | "buffering";
}

export interface MediaPlayerEntityAttributes extends HassEntityAttributeBase {
  media_content_id?: string;
  media_content_type?: string;
  media_artist?: string;
  media_playlist?: string;
  media_series_title?: string;
  media_season?: any;
  media_episode?: any;
  app_name?: string;
  media_position_updated_at?: string | number | Date;
  media_duration?: number;
  media_position?: number;
  media_title?: string;
  media_channel?: string;
  icon?: string;
  entity_picture_local?: string;
  is_volume_muted?: boolean;
  volume_level?: number;
  repeat?: string;
  shuffle?: boolean;
  source?: string;
  source_list?: string[];
  sound_mode?: string;
  sound_mode_list?: string[];
}
export type RemoteEntity = HassEntityBase & {
  attributes: HassEntityAttributeBase & {
    current_activity: string | null;
    activity_list: string[] | null;
    [key: string]: any;
  };
};
export interface SceneEntity extends HassEntityBase {
  attributes: HassEntityAttributeBase & { id?: string };
}
export interface ScriptEntity extends HassEntityBase {
  attributes: HassEntityAttributeBase & {
    last_triggered: string;
    mode: (typeof MODES)[number];
    current?: number;
    max?: number;
  };
}
export interface SelectEntity extends HassEntityBase {
  attributes: SelectEntityAttributes;
}

export interface SelectEntityAttributes extends HassEntityAttributeBase {
  options: string[];
}
export interface TextEntity extends HassEntityBase {
  attributes: TextEntityAttributes;
}

export interface TextEntityAttributes extends HassEntityAttributeBase {
  min?: number;
  max?: number;
  pattern?: string;
  mode?: "text" | "password";
}
export type TimerEntity = HassEntityBase & {
  attributes: HassEntityAttributeBase & {
    duration: string;
    remaining: string;
    restore: boolean;
  };
};
export interface UpdateEntity extends HassEntityBase {
  attributes: UpdateEntityAttributes;
}

export interface UpdateEntityAttributes extends HassEntityAttributeBase {
  auto_update: boolean | null;
  installed_version: string | null;
  in_progress: boolean | number;
  latest_version: string | null;
  release_summary: string | null;
  release_url: string | null;
  skipped_version: string | null;
  title: string | null;
}
export interface VacuumEntity extends HassEntityBase {
  attributes: VacuumEntityAttributes;
}

export interface VacuumEntityAttributes extends HassEntityAttributeBase {
  battery_level?: number;
  fan_speed?: any;
  [key: string]: any;
}
export type WaterHeaterEntity = HassEntityBase & {
  attributes: HassEntityAttributeBase & {
    target_temp_step?: number;
    min_temp: number;
    max_temp: number;
    current_temperature?: number;
    temperature?: number;
    operation_mode: OperationMode;
    operation_list: OperationMode[];
    away_mode?: "on" | "off";
  };
};
export interface WeatherEntity extends HassEntityBase {
  attributes: WeatherEntityAttributes;
}

export interface WeatherEntityAttributes extends HassEntityAttributeBase {
  attribution?: string;
  humidity?: number;
  forecast?: ForecastAttribute[];
  is_daytime?: boolean;
  pressure?: number;
  temperature?: number;
  visibility?: number;
  wind_bearing?: number | string;
  wind_speed?: number;
  precipitation_unit: string;
  pressure_unit: string;
  temperature_unit: string;
  visibility_unit: string;
  wind_speed_unit: string;
}

export interface ForecastAttribute {
  temperature: number;
  datetime: string;
  templow?: number;
  precipitation?: number;
  precipitation_probability?: number;
  humidity?: number;
  condition?: string;
  is_daytime?: boolean;
  pressure?: number;
  wind_speed?: string;
}
