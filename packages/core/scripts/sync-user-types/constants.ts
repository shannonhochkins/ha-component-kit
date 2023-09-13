

export const DEFAULT_FILENAME = 'supported-types.d.ts';

export const REMAPPED_TYPES: Record<string, string> = {
  hs_color: `[number, number]`,
  rgb_color: `[number, number, number]`,
  rgbw_color: `[number, number, number, number]`,
  rgbww_color: `[number, number, number, number, number]`,
  group_members: `string[]`,
};
