

export const DEFAULT_FILENAME = 'supported-types.d.ts';

export const REMAPPED_TYPES: Record<string, string> = {
  hs_color: `[number, number]`,
  rgb_color: `[number, number, number]`,
  rgbw_color: `[number, number, number, number]`,
  rgbww_color: `[number, number, number, number, number]`,
};

export const REMAPPED_TYPES_BY_DOMAIN: Record<string, Record<string, string>> = {
  'vacuum': {
    status: 'VacuumEntityState',
    state: 'VacuumEntityState',
    fan_speed: 'string',
    fan_speed_list: 'string[]',
    battery_level: 'number',
    battery_icon: 'string',
  }
}