

export const DEFAULT_FILENAME = 'supported-types.d.ts';

export const REMAPPED_TYPES: Record<string, string> = {
  hs_color: `[number, number]`,
  rgb_color: `[number, number, number]`,
  rgbw_color: `[number, number, number, number]`,
  rgbww_color: `[number, number, number, number, number]`,
  group_members: `string[]`,
  media_content_id: `string | number`,
  kelvin: `number | object`,
  white: 'boolean',
  color_temp: `number | object`,
  xy_color: `[number, number]`,
  start_date_time: 'string',
  end_date_time: 'string',
  start_date: 'string',
  end_date: 'string',
  'calendar.get_events.duration': `{
    hours?: number;
    days?: number;
    minutes?: number;
    seconds?: number;
  }`
};
