import { generateEvents } from './calendar';

export async function mockCallApi(endpoint: string): Promise<unknown> {
  return new Promise(resolve => {
    setTimeout(() => {
      if (endpoint.includes('/calendars/calendar.')) {
        return resolve({
          status: 'success',
          data: generateEvents(endpoint),
        });
      }
      return resolve({
        status: 'success',
        data: 'unknown'
      })
    }, 50);
  });
}