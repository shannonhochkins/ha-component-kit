import type { ServiceArgs } from './types';

export function sceneUpdates({
  now,
  target,
  setEntities,
}: ServiceArgs<'scene'>) {
  const dates = {
    last_changed: now,
    last_updated: now,
  }
  if (typeof target !== 'string') return;
  return setEntities(entities => ({
    ...entities,
    [target]: {
      ...entities[target],
      ...dates,
      state: now
    }
  }));
}