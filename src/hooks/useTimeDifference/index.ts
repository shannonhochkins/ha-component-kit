import { useEffect, useMemo, useState, useRef } from "react";
import TimeAgo from "javascript-time-ago";
// English.
import en from "javascript-time-ago/locale/en";
import { useEntity } from "@hooks";

TimeAgo.addDefaultLocale({
  ...en,
  now: {
    now: {
      // too account for odd time differences, we set these to all be the same
      current: "just now",
      future: "just now",
      past: "just now",
    },
  },
});
// Create formatter (English).
export const timeAgo = new TimeAgo("en-US");

interface TimeDifference {
  active: boolean;
  formatted: string;
}
/** This hook will return the "last updated" time based on the date string provided, this will automatically update based on the home assistant time sensor, which updated every minute */
export function useTimeDifference(dateString: string) {
  const timeSensor = useEntity("sensor.time");
  // we want this to update based on the time tick from the sensor
  const formattedDateString = useMemo(
    () => new Date(dateString),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dateString, timeSensor]
  );

  const timer = useRef<NodeJS.Timeout | null>(null);
  const formatted = timeAgo.format(formattedDateString);
  const active = formatted === "just now";
  const [difference, setDifference] = useState<TimeDifference>({
    formatted,
    active,
  });

  // Effect for initial setup and when dateString changes
  useEffect(() => {
    const formatted = timeAgo.format(formattedDateString);
    const active = formatted === "just now";
    setDifference({
      formatted,
      active,
    });
  }, [formattedDateString]);

  // Effect for timer logic
  useEffect(() => {
    if (active) {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        const formatted = timeAgo.format(formattedDateString);
        setDifference({
          formatted,
          active: false,
        });
      }, 3000);
    }

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [active, formattedDateString]);

  return useMemo(() => difference, [difference]);
}
