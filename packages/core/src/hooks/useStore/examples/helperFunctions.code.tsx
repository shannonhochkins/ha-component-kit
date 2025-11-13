import { useStore } from "@hakit/core";

export function HelperFunctionsExample() {
  const helpers = useStore((s) => s.helpers);
  const tz = helpers.dateTime.getTimeZone();
  const ampm = helpers.dateTime.shouldUseAmPm();
  return (
    <div>
      <h4>Date/Time Helpers</h4>
      <p>Resolved Time Zone: {tz}</p>
      <p>Uses AM/PM: {ampm ? "Yes" : "No"}</p>
    </div>
  );
}
