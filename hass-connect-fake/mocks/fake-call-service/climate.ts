import type { ServiceArgs } from './types';
import type { HvacMode, HvacAction } from '@hakit/core';

const MODE_TO_HVAC_ACTION: {
  [key in HvacMode]: HvacAction
} = {
  'off': 'off',
  'heat': 'heating',
  'cool': 'cooling',
  'heat_cool': 'preheating',
  'auto': 'idle',
  'dry': 'drying',
  'fan_only': 'fan',
}

export function climateUpdates({
  now,
  target,
  setEntities,
  serviceData,
}: ServiceArgs<'climate'>) {
  const dates = {
    last_changed: now,
    last_updated: now,
  }
  if (typeof target !== 'string') return;
  return setEntities(entities => ({
    [target]: {
      ...entities[target],
      attributes: {
        ...entities[target].attributes,
        ...serviceData || {},
        // @ts-ignore - purposely casting here so i don't have to setup manual types for fake data
        hvac_action: MODE_TO_HVAC_ACTION[serviceData?.hvac_mode] || entities[target].attributes.hvac_action
      },
      ...dates,
      // @ts-ignore - purposely casting here so i don't have to setup manual types for fake data
      state: serviceData?.hvac_mode || entities[target].state
    }
  }));
}