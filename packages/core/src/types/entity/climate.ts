import type { HassEntityAttributeBase } from "home-assistant-js-websocket";

export type HvacMode =
  | "auto"
  | "heat_cool"
  | "heat"
  | "cool"
  | "off"
  | "fan_only"
  | "dry";

export type HvacAction =
  | "off"
  | "preheating"
  | "heating"
  | "cooling"
  | "drying"
  | "idle"
  | "fan";

export interface ClimateEntityAttributes extends HassEntityAttributeBase {
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
}
