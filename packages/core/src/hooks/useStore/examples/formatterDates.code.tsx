import { useStore } from "@hakit/core";

export function FormatterDatesExample() {
  const formatter = useStore((s) => s.formatter);
  const now = new Date();
  return (
    <div>
      <p>Long Date: {formatter.formatDate(now)}</p>
      <p>Time: {formatter.formatTime(now)}</p>
      <p>
        24h Time + Suffix: {formatter.formatTimeWithoutAmPm(now)} {formatter.formatAmPmSuffix(now)}
      </p>
      <p>Hour Only: {formatter.formatHour(now)}</p>
      <p>Minute Only: {formatter.formatMinute(now)}</p>
      <p>Seconds Only: {formatter.formatSeconds(now)}</p>
      <p>DateTime: {formatter.formatDateTime(now)}</p>
      <p>DateTime (Seconds): {formatter.formatDateTimeWithSeconds(now)}</p>
      <p>Short DateTime: {formatter.formatShortDateTime(now)}</p>
      <p>Short DateTime (Year): {formatter.formatShortDateTimeWithYear(now)}</p>
      <p>Short DateTime (Conditional Year): {formatter.formatShortDateTimeWithConditionalYear(now)}</p>
      <p>Weekday+Day: {formatter.formatDateWeekdayDay(now)}</p>
      <p>Short Date: {formatter.formatDateShort(now)}</p>
      <p>Very Short Date: {formatter.formatDateVeryShort(now)}</p>
      <p>Month Year: {formatter.formatDateMonthYear(now)}</p>
      <p>Month: {formatter.formatDateMonth(now)}</p>
      <p>Year: {formatter.formatDateYear(now)}</p>
      <p>Weekday: {formatter.formatDateWeekday(now)}</p>
      <p>Weekday Short: {formatter.formatDateWeekdayShort(now)}</p>
      <p>Numeric Date: {formatter.formatDateNumeric(now)}</p>
    </div>
  );
}
