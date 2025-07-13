import type { ServiceArgs } from './types';
import { hs2rgb, type LightEntity } from '@hakit/core';

export function lightUpdates({
  now,
  target,
  service,
  setEntities,
  serviceData,
}: ServiceArgs<'light', 'turnOn' | 'turn_on'>): boolean | void {
  const dates = {
    last_changed: now,
    last_updated: now,
  }
  if (typeof target !== 'string') return;
  switch(service) {
    case 'turn_on':
    case 'turnOn':
      return setEntities(entities => {
        const attributes: LightEntity['attributes'] = {
          ...entities[target].attributes,
          ...serviceData || {},
        }
        serviceData.flash
        const isSettingTemperature = typeof serviceData?.color_temp_kelvin === 'number';
        const isSettingColor = typeof serviceData?.hs_color === 'object';
        if (isSettingTemperature) {
          delete attributes.hs_color;
          attributes.color_mode = 'color_temp';
          attributes.color_temp_kelvin = serviceData?.color_temp_kelvin;
        }
        if (isSettingColor && serviceData?.hs_color) {
          attributes.color_mode = 'hs';
          attributes.rgb_color = hs2rgb([serviceData.hs_color[0], serviceData.hs_color[1] / 100]);
        }
        if (serviceData?.brightness_pct) {
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