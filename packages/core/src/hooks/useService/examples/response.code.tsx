import { HassConnect, useService } from "@hakit/core";
import { useState, useCallback } from "react";

interface CalendarEvent {
  description: string;
  end: string;
  start: string;
  summary: string;
}
interface CalendarResponse {
  "calendar.some_calendar": {
    events: CalendarEvent[];
  };
}
function UseServiceExample() {
  const service = useService("calendar");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const getEvents = useCallback(async () => {
    const events = await service.getEvents<CalendarResponse>({
      target: "calendar.some_calendar",
      serviceData: {
        start_date_time: "2024-12-22 20:00:00",
        duration: {
          days: 24,
        },
      },
      returnResponse: true,
    });
    setEvents(events.response["calendar.some_calendar"].events);
  }, [service]);
  return (
    <>
      <p>There are {events.length} events</p>
      <button onClick={getEvents}>GET CALENDAR EVENTS</button>
    </>
  );
}
export function App() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <UseServiceExample />
    </HassConnect>
  );
}
