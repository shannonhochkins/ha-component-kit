

export const DEFAULT_FILENAME = 'supported-types.d.ts';

export const REMAPPED_TYPES: Record<string, string> = {
  hs_color: `[number, number]`,
  rgb_color: `[number, number, number]`,
  rgbw_color: `[number, number, number, number]`,
  rgbww_color: `[number, number, number, number, number]`,
  group_members: `string[]`,
  media_content_id: `string | number`,
  color_temp_kelvin: `number`,
  white: 'boolean',
  color_temp: `number`,
  xy_color: `[number, number]`,
};
