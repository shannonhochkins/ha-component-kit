import { generateEvents } from './calendar';

export async function mockCallApi<T>(endpoint: string): Promise<{
  status: 'success';
  data: T;
} | {
  status: 'error';
  data: 'unknown';
}> {
  return new Promise(resolve => {
    setTimeout(() => {
      if (endpoint.includes('/calendars/calendar.')) {
        return resolve({
          status: 'success',
          data: generateEvents(endpoint) as unknown as T,
        });
      }
      return resolve({
        status: 'error',
        data: 'unknown'
      })
    }, 50);
  });
}