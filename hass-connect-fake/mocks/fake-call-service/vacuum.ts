import type { ServiceArgs } from './types';

let returningTimeout: NodeJS.Timeout;

export function vacuumUpdates({
  now,
  target,
  service,
  serviceData,
  setEntities,
}: ServiceArgs<'vacuum'>) {
  const dates = {
    last_changed: now,
    last_updated: now,
  }
  if (typeof target !== 'string') return true;
  console.log('target', { target, service, serviceData })

  if (returningTimeout) {
    clearTimeout(returningTimeout);
  }
  switch (service) {
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
            ...serviceData,
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
            status: service === 'start' ? 'Cleaning' : 'Cleaning spot'
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
            status: service === 'pause' ? 'Paused' : 'Stopped'
          },
          state: 'paused'
        }
      }));
  }
  return true;
}