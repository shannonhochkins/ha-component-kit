export const enum AlarmControlPanelEntityFeature {
  ARM_HOME = 1,
  ARM_AWAY = 2,
  ARM_NIGHT = 4,
  TRIGGER = 8,
  ARM_CUSTOM_BYPASS = 16,
  ARM_VACATION = 32,
}

export type AlarmConfig = {
  service: string;
  feature?: AlarmControlPanelEntityFeature;
  icon: string;
};
