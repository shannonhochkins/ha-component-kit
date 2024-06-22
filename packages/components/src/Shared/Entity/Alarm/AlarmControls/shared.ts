import { localize, HassEntityWithService, AlarmMode, AlarmPanelCardConfigState, supportsFeatureFromAttributes } from "@hakit/core";
import { AlarmControlPanelEntityFeature, AlarmConfig } from "./types";

export const ALARM_MODES: Record<AlarmMode, AlarmConfig> = {
  armed_home: {
    feature: AlarmControlPanelEntityFeature.ARM_HOME,
    service: "alarm_arm_home",
    icon: "mdi:home",
  },
  armed_away: {
    feature: AlarmControlPanelEntityFeature.ARM_AWAY,
    service: "alarm_arm_away",
    icon: "mdi:lock",
  },
  armed_night: {
    feature: AlarmControlPanelEntityFeature.ARM_NIGHT,
    service: "alarm_arm_night",
    icon: "mdi:moon-waning-crescent",
  },
  armed_vacation: {
    feature: AlarmControlPanelEntityFeature.ARM_VACATION,
    service: "alarm_arm_vacation",
    icon: "mdi:airplane",
  },
  armed_custom_bypass: {
    feature: AlarmControlPanelEntityFeature.ARM_CUSTOM_BYPASS,
    service: "alarm_arm_custom_bypass",
    icon: "mdi:shield",
  },
  disarmed: {
    service: "alarm_disarm",
    icon: "mdi:shield-off",
  },
  triggered: {
    feature: AlarmControlPanelEntityFeature.TRIGGER,
    service: "",
    icon: "mdi:alert",
  },
  pending: {
    feature: AlarmControlPanelEntityFeature.TRIGGER,
    service: "",
    icon: "mdi:clock",
  },
  arming: {
    feature: AlarmControlPanelEntityFeature.TRIGGER,
    service: "",
    icon: "mdi:clock",
  },
};

export const _getActionColor = (state: AlarmMode, customActionColor?: (state: AlarmMode) => string | undefined): string => {
  const customColor = customActionColor?.(state);
  if (customColor) return customColor;
  switch (state) {
    case "disarmed":
      return "var(--ha-error-color)";
    case "armed_away":
      return "var(--ha-success-color)";
    case "armed_home":
      return "var(--ha-success-color)";
    case "armed_custom_bypass":
      return "var(--ha-success-color)";
    case "armed_night":
      return "var(--ha-success-color)";
    case "armed_vacation":
      return "var(--ha-success-color)";
    default:
      return "var(--ha-warning-color)";
  }
};

export const DEFAULT_STATES: AlarmPanelCardConfigState[] = ["arm_home", "arm_away"];

export const ALARM_MODE_STATE_MAP: Record<AlarmPanelCardConfigState | "disarm" | "triggered" | "pending" | "arming", AlarmMode> = {
  arm_home: "armed_home",
  arm_away: "armed_away",
  arm_night: "armed_night",
  arm_vacation: "armed_vacation",
  arm_custom_bypass: "armed_custom_bypass",
  disarm: "disarmed",
  triggered: "triggered",
  pending: "pending",
  arming: "arming",
};

export const _getActionLabel = (
  state: AlarmPanelCardConfigState | "disarm",
  labelMap?: Record<AlarmPanelCardConfigState | "disarm", string>,
): string => {
  return labelMap?.[state] ?? localize(state === "arm_custom_bypass" ? "custom_bypass" : state);
};

export const filterSupportedAlarmStates = (
  entity: HassEntityWithService<"alarm_control_panel"> | undefined,
  states: AlarmPanelCardConfigState[],
): AlarmPanelCardConfigState[] =>
  states.filter((s) => entity && supportsFeatureFromAttributes(entity.attributes, ALARM_MODES[ALARM_MODE_STATE_MAP[s]].feature || 0));
