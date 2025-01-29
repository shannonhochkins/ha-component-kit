import { useEffect, useState } from "react";
import { useHass, HassConnect } from "@hakit/core";
export type DateFormat = {
  dateTime: string;
  date: string;
};

export interface CalendarEvent {
  start: DateFormat;
  end: DateFormat;
  summary: string;
  location?: string;
  description?: string;
  uid?: string;
  recurrence_id?: string;
  rrule?: string;
}
export function CallApiExample() {
  const { callApi } = useHass();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  useEffect(() => {
    callApi<CalendarEvent[]>("/calendars/calendar.google_calendar?start=2023-09-30T14:00:00.000Z&end=2023-11-11T13:00:00.000Z").then(
      (response) => {
        if (response.status === "success") {
          setEvents(response.data);
        } else {
          console.error("Error", response.data);
        }
      },
    );
  }, [callApi]);
  return (
    <>
      <p>{events.length ? `There is ${events.length} events!` : "No events"}</p>
    </>
  );
}

export function App() {
  return (
    <HassConnect hassUrl="https://homeassistant.local:8123">
      <CallApiExample />
    </HassConnect>
  );
}
