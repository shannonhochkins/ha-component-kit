import { HassEntity } from 'home-assistant-js-websocket';

export const generateEntityType = (input: HassEntity[]) => {
  return input.map(e => `'${e.entity_id}'`).join(' | ');
}
