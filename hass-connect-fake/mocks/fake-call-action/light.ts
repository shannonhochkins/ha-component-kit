import type { ActionArgs } from './types';
import { hs2rgb } from '@hakit/core';

export function lightUpdates({
  now,
  target,
  action,
  setEntities,
  actionData,
}: ActionArgs<'light'>) {
  const dates = {
    last_changed: now,
    last_updated: now,
  }
  if (typeof target !== 'string') return;
  switch(action) {
    case 'turn_on':
    case 'turnOn':
      return setEntities(entities => {
        const attributes = {
          ...entities[target].attributes,
          ...actionData || {},
        }
        // @ts-ignore
        const isSettingTemperature = typeof actionData?.kelvin === 'number';
        // @ts-ignore
        const isSettingColor = typeof actionData?.hs_color === 'object';
        if (isSettingTemperature) {
          // @ts-ignore
          delete attributes.hs_color;
          // @ts-ignore
          attributes.color_mode = 'color_temp';
          // @ts-ignore
          attributes.color_temp_kelvin = actionData?.kelvin;
        }
        if (isSettingColor) {
          // @ts-ignore
          attributes.color_mode = 'hs';
          // @ts-ignore
          attributes.rgb_color = hs2rgb([actionData?.hs_color[0], actionData?.hs_color[1] / 100]);
        }
        // @ts-ignore
        const isSettingBrightness = actionData?.brightness_pct !== undefined;
        if (isSettingBrightness) {
          // @ts-ignore
          attributes.brightness = Math.round(actionData.brightness_pct / 100 * 255);
        }
        return {
          ...entities,
          [target]: {
            ...entities[target],
            attributes: {
              ...attributes,
            },
            ...dates,
            state: 'on'
          }
        };
      });
    }
  return true;
}