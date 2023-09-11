import type { ServiceArgs } from './types';
import { hs2rgb } from '@hakit/core';

export function lightUpdates({
  now,
  target,
  service,
  setEntities,
  serviceData,
}: ServiceArgs<'light'>) {
  const dates = {
    last_changed: now,
    last_updated: now,
  }
  if (typeof target !== 'string') return;
  switch(service) {
    case 'turn_on':
    case 'turnOn':
      return setEntities(entities => {
        const attributes = {
          ...entities[target].attributes,
          ...serviceData || {},
        }
        // @ts-ignore
        const isSettingTemperature = typeof serviceData?.kelvin === 'number';
        // @ts-ignore
        const isSettingColor = typeof serviceData?.hs_color === 'object';
        if (isSettingTemperature) {
          // @ts-ignore
          delete attributes.hs_color;
          // @ts-ignore
          attributes.color_mode = 'color_temp';
          // @ts-ignore
          attributes.color_temp_kelvin = serviceData?.kelvin;
        }
        if (isSettingColor) {
          // @ts-ignore
          attributes.color_mode = 'hs';
          // @ts-ignore
          attributes.rgb_color = hs2rgb([serviceData?.hs_color[0], serviceData?.hs_color[1] / 100]);
        }
        // @ts-ignore
        const isSettingBrightness = serviceData?.brightness_pct !== undefined;
        if (isSettingBrightness) {
          // @ts-ignore
          attributes.brightness = Math.round(serviceData.brightness_pct / 100 * 255);
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