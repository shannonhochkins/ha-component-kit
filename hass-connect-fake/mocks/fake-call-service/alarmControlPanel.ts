import type { ServiceArgs } from './types';

export function alarmControlPanelUpdates({
  now,
  target: _target,
  service,
  setEntities,
}: ServiceArgs<'alarmControlPanel'>) {
  const dates = {
    last_changed: now,
    last_updated: now,
  }
  if (typeof _target !== 'string') return;
  // simple wrapper function that delays the state update by 500ms
  function updatePendingState(target: string, state: string) {
    return setEntities(entities => {
      setTimeout(() => {
        return setEntities(entities => ({
          ...entities,
          [target]: {
            ...entities[target],
            ...dates,
            state
          }
        }));  
      }, 500);
      return ({
        ...entities,
        [target]: {
          ...entities[target],
          ...dates,
          state: 'pending'
        }
      })
    });
  }
  switch (service) {
    case 'alarmArmHome':
    case 'alarm_arm_home':
      return updatePendingState(_target, 'armed_home');
    case 'alarmArmNight':
    case 'alarm_arm_night':
      return updatePendingState(_target, 'armed_night');
    case 'alarmArmAway':
    case 'alarm_arm_away':
      return updatePendingState(_target, 'armed_away');
    case 'alarmArmVacation':
    case 'alarm_arm_vacation':
      return updatePendingState(_target, 'armed_away');
    case 'alarmDisarm':
    case 'alarm_disarm':
      return updatePendingState(_target, 'disarmed');
  }
  return true;
}