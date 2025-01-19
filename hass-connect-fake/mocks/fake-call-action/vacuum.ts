import type { ActionArgs } from './types';

let returningTimeout: NodeJS.Timeout;

export function vacuumUpdates({
  now,
  target,
  action,
  actionData,
  setEntities,
}: ActionArgs<'vacuum'>) {
  const dates = {
    last_changed: now,
    last_updated: now,
  }
  if (typeof target !== 'string') return true;

  if (returningTimeout) {
    clearTimeout(returningTimeout);
  }
  switch (action) {
    case 'returnToBase':
      returningTimeout = setTimeout(() => {
        setEntities(entities => ({
          ...entities,
          [target]: {
            ...entities[target],
            ...dates,
            attributes: {
              ...entities[target].attributes,
              status: 'Docked'
            },
            state: 'docked'
          }
        }));
      }, 5000);
      return setEntities(entities => ({
        ...entities,
        [target]: {
          ...entities[target],
          ...dates,
          attributes: {
            ...entities[target].attributes,
            status: 'Returning to base'
          },
          state: 'returning'
        }
      }));
    case 'setFanSpeed':
      return setEntities(entities => ({
        ...entities,
        [target]: {
          ...entities[target],
          attributes: {
            ...entities[target].attributes,
            ...actionData,
          },
          ...dates,
        }
      }));
    case 'start':
    case 'cleanSpot':
      return setEntities(entities => ({
        ...entities,
        [target]: {
          ...entities[target],
          ...dates,
          attributes: {
            ...entities[target].attributes,
            status: action === 'start' ? 'Cleaning' : 'Cleaning spot'
          },
          state: 'cleaning'
        }
      }));
    case 'pause':
    case 'stop':
      return setEntities(entities => ({
        ...entities,
        [target]: {
          ...entities[target],
          ...dates,
          attributes: {
            ...entities[target].attributes,
            status: action === 'pause' ? 'Paused' : 'Stopped'
          },
          state: 'paused'
        }
      }));
  }
  return true;
}