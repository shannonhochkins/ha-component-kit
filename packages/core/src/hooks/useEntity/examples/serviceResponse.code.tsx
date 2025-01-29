import { HassConnect, useEntity } from '@hakit/core';
import { useState, useCallback } from 'react';

interface CalendarEvent {
  description: string;
  end: string;
  start: string;
  summary: string;
}
interface CalendarResponse {
  "calendar.some_calendar": {
    events: CalendarEvent[];
  }
}
function CallServiceExample() {
  const entity = useEntity('calendar.some_calendar');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const getEvents = useCallback(() => {
    entity.service.getEvents<CalendarResponse>({
      returnResponse: true,
      serviceData: {
        start_date_time: '2024-12-22 20:00:00',
        duration: {
          days: 24
        }
      }
    }).then(({ response, context }) => {
      console.log('response', context, response);
      const events = response['calendar.some_calendar']?.events || [];
      setEvents(events);
    });
  }, [entity]);
  return <>
    <p>Events: {events.length}</p>
   <button onClick={getEvents}>GET EVENTS</button>
  </>
}

export function App() {
  return <HassConnect hassUrl="http://homeassistant.local:8123">
    <CallServiceExample />
  </HassConnect>
}