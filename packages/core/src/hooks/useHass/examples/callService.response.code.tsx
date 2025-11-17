import { useCallback, useState } from "react";
import { useHass } from "@hakit/core";
import type { ServiceResponse } from "@hakit/core";

interface CalendarEvent {
  description: string;
  end: string;
  start: string;
  summary: string;
}
interface CalendarResponse {
  [key: string]: {
    events: CalendarEvent[];
  };
}

export function CallServiceResponseExample() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const getEvents = useCallback(() => {
    const { callService } = useHass.getState().helpers;
    callService<CalendarResponse, "calendar", "get_events">({
      domain: "calendar",
      service: "get_events",
      returnResponse: true,
      target: { entity_id: "calendar.my_calendar" },
    }).then((resp: ServiceResponse<CalendarResponse>) => {
      const allEvents = Object.values(resp.response).flatMap((r) => r.events);
      setEvents(allEvents);
    });
  }, []);
  return (
    <div>
      <p>Events: {events.length}</p>
      <button onClick={getEvents}>GET EVENTS</button>
    </div>
  );
}
