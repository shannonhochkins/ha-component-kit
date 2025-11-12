import type { ServiceArgs } from './types';
import { type LightEntity } from '@hakit/core';

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
  switch (service) {
    case 'turn_on':
    case 'turnOn':
      return setEntities(entities => {
        const prev = entities[target];
        if (!prev) return entities;
        const attributes: LightEntity['attributes'] = { ...prev.attributes };

        // Brightness handling
      if (serviceData?.brightness_pct != null) {
          attributes.brightness = Math.round((255 * serviceData.brightness_pct) / 100);
        } else if (serviceData?.brightness != null) {
          attributes.brightness = serviceData.brightness;
        } else if (!attributes.brightness) {
          // default brightness when turning on without specifying
          attributes.brightness = 255;
        }

        // Determine if any color mode key provided
        const colorModeKeys = [
          'rgbww_color',
          'rgbw_color',
          'rgb_color',
          'hs_color',
          'color_temp_kelvin',
          'white'
        ];
        const hasColorModeUpdate = colorModeKeys.some((k) => k in (serviceData || {}));

        if (hasColorModeUpdate) {
          // Clear existing color-related attributes before applying new mode
          delete attributes.hs_color;
          delete attributes.rgb_color;
          delete attributes.rgbw_color;
          delete attributes.rgbww_color;
          delete attributes.color_temp_kelvin;
        }

        // Apply precedence order
        if (serviceData?.rgbww_color) {
          attributes.color_mode = 'rgbww';
          attributes.rgbww_color = serviceData.rgbww_color as [number, number, number, number, number];
        } else if (serviceData?.rgbw_color) {
          attributes.color_mode = 'rgbw';
          attributes.rgbw_color = serviceData.rgbw_color as [number, number, number, number];
        } else if (serviceData?.rgb_color) {
          attributes.color_mode = 'rgb';
          attributes.rgb_color = serviceData.rgb_color as [number, number, number];
        } else if (serviceData?.hs_color) {
          attributes.color_mode = 'hs';
          attributes.hs_color = serviceData.hs_color as [number, number];
        } else if (serviceData?.color_temp_kelvin) {
          attributes.color_mode = 'color_temp';
          attributes.color_temp_kelvin = serviceData.color_temp_kelvin;
        } else if (serviceData?.white) {
          attributes.color_mode = 'white';
        }

        return {
          ...entities,
          [target]: {
            ...prev,
            attributes: {
              ...attributes,
            },
            ...dates,
            state: 'on',
          },
        };
        // const attributes: LightEntity['attributes'] = {
        //   ...entities[target].attributes,
        //   ...serviceData || {},
        // }
        // const { hs_color, brightness_pct, rgb_color, color_temp } = serviceData;
        // if (brightness_pct) {
        //   attributes.brightness = (255 * brightness_pct) / 100;
        // } else if (!attributes.brightness) {
        //   attributes.brightness = 255;
        // }
        // if (hs_color) {
        //   attributes.color_mode = "hs";
        //   attributes.hs_color = hs_color;
        // }
        // if (rgb_color) {
        //   attributes.color_mode = "rgb";
        //   attributes.rgb_color = rgb_color;
        // }
        // if (color_temp) {
        //   attributes.color_mode = "color_temp";
        //   attributes.color_temp = color_temp;
        //   delete attributes.rgb_color;
        // }
        // return {
        //   ...entities,
        //   [target]: {
        //     ...entities[target],
        //     attributes: {
        //       ...attributes,
        //     },
        //     ...dates,
        //     state: 'on'
        //   }
        // };
      });
  }
  return true;
}