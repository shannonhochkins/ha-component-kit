import { generateEvents } from './calendar';

export async function mockCallApi(endpoint: string): Promise<unknown> {
  if (endpoint.includes('/calendars/calendar.google_calendar?')) {
    return Promise.resolve(generateEvents());
  }
}