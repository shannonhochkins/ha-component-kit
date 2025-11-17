import { useInternalStore } from "./HassContext";
import {
  formatDate,
  formatTime,
  formatDateTime,
  formatDateTimeWithSeconds,
  formatShortDateTime,
  formatShortDateTimeWithYear,
  formatShortDateTimeWithConditionalYear,
  formatDateTimeWithBrowserDefaults,
  formatDateTimeNumeric,
  formatDateWeekdayDay,
  formatDateShort,
  formatDateVeryShort,
  formatDateMonthYear,
  formatDateMonth,
  formatDateYear,
  formatDateWeekday,
  formatDateWeekdayShort,
  formatDateNumeric,
  formatTimeWithoutAmPm,
  formatAmPmSuffix,
  formatHour,
  formatMinute,
  formatSeconds,
} from "@core";

/**
 * A collection of all supported date/time formatting helpers exposed via the Hass formatter API.
 * Each method accepts either a Date object or an ISO/string parseable by the Date constructor.
 * All helpers automatically read `locale` and `config` from the internal store on every call so
 * they stay reactive to user preference changes without needing recreation.
 * If required data (locale or config) is not yet available, they fall back to a browser default
 * formatter (`formatDateTimeWithBrowserDefaults`).
 */
export interface DateFormatters {
  /** Long date (e.g. "August 9, 2025") */
  formatDate(date: Date | string): string;
  /** Time respecting 12/24 preference (e.g. "8:23 AM" or "08:23") */
  formatTime(date: Date | string): string;
  /** Time without AM/PM regardless of user preference is set to 12 or 24 hours */
  formatTimeWithoutAmPm(date: Date | string): string;
  /** Hour numeric only respecting 12/24 preference (no suffix, e.g. "5" or "17") */
  formatHour(date: Date | string): string;
  /** Localized AM/PM (day period) suffix irrespective of user 24h preference */
  formatAmPmSuffix(date: Date | string): string;
  /** Minute numeric only (e.g. "07") */
  formatMinute(date: Date | string): string;
  /** Seconds numeric only (e.g. "09") */
  formatSeconds(date: Date | string): string;
  /** Long date & time without seconds (e.g. "August 9, 2025, 8:23 AM") */
  formatDateTime(date: Date | string): string;
  /** Long date & time with seconds (e.g. "August 9, 2025, 8:23:15 AM") */
  formatDateTimeWithSeconds(date: Date | string): string;
  /** Short date & time without year if current year (e.g. "Aug 9, 8:23 AM") */
  formatShortDateTime(date: Date | string): string;
  /** Short date & time with year (e.g. "Aug 9, 2025, 8:23 AM") */
  formatShortDateTimeWithYear(date: Date | string): string;
  /** Short date & time with conditional year (omits year if current) */
  formatShortDateTimeWithConditionalYear(date: Date | string): string;
  /** Browser default date & time fallback (locale/config independent) */
  formatDateTimeWithBrowserDefaults(date: Date | string): string;
  /** Numeric date & time (e.g. "9/8/2025, 8:23 AM") honoring locale ordering */
  formatDateTimeNumeric(date: Date | string): string;
  /** Weekday + Month + Day (e.g. "Tuesday, August 10") */
  formatDateWeekdayDay(date: Date | string): string;
  /** Short date (e.g. "Aug 10, 2025") */
  formatDateShort(date: Date | string): string;
  /** Very short date (e.g. "Aug 10") */
  formatDateVeryShort(date: Date | string): string;
  /** Month + Year (e.g. "August 2025") */
  formatDateMonthYear(date: Date | string): string;
  /** Month name (e.g. "August") */
  formatDateMonth(date: Date | string): string;
  /** Year (e.g. "2025") */
  formatDateYear(date: Date | string): string;
  /** Weekday long (e.g. "Monday") */
  formatDateWeekday(date: Date | string): string;
  /** Weekday short (e.g. "Mon") */
  formatDateWeekdayShort(date: Date | string): string;
  /** Numeric date honoring user ordering preference (e.g. DMY -> 10/08/2025) */
  formatDateNumeric(date: Date | string): string;
}

/**
 * Safely coerce an incoming value to a Date instance. If construction fails, still pass the
 * resulting Date (which will be invalid) to downstream formatters which will then fall back.
 */
function toDate(date: Date | string): Date {
  return typeof date === "string" ? new Date(date) : date;
}

/**
 * Create the suite of date formatting helpers bound to the current internal store state.
 * They query `useInternalStore().getState()` at call time so preference updates are reflected
 * immediately without needing to recreate the formatter object.
 */
export function createDateFormatters(): DateFormatters {
  const fallback = (d: Date) => formatDateTimeWithBrowserDefaults(d);
  const getCtx = () => useInternalStore.getState();

  /** Long date (e.g. "August 9, 2025") */
  const formatDateWrapper = (value: Date | string) => {
    const d = toDate(value);
    const { locale, config } = getCtx();
    if (!locale || !config) return fallback(d);
    return formatDate(d, config, locale);
  };
  /** Time respecting 12/24 preference */
  const formatTimeWrapper = (value: Date | string) => {
    const d = toDate(value);
    const { locale, config } = getCtx();
    if (!locale || !config) return fallback(d);
    return formatTime(d, config, locale);
  };
  /** Time without AM/PM */
  const formatTimeWithoutAmPmWrapper = (value: Date | string) => {
    const d = toDate(value);
    const { locale, config } = getCtx();
    if (!locale || !config) {
      // simple 24h fallback
      return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
    }
    return formatTimeWithoutAmPm(d, config, locale);
  };
  /** Hour only respecting 12/24 preference */
  const formatHourWrapper = (value: Date | string) => {
    const d = toDate(value);
    const { locale, config } = getCtx();
    if (!locale || !config) {
      // Fallback: 24h hour without suffix
      return d.getHours().toString().padStart(2, "0");
    }
    return formatHour(d, config, locale);
  };
  /** AM/PM suffix only */
  const formatAmPmSuffixWrapper = (value: Date | string) => {
    const d = toDate(value);
    const { locale, config } = getCtx();
    if (!locale || !config) return d.getHours() >= 12 ? "PM" : "AM";
    return formatAmPmSuffix(d, locale, config);
  };
  /** Minute only */
  const formatMinuteWrapper = (value: Date | string) => {
    const d = toDate(value);
    const { locale, config } = getCtx();
    if (!locale || !config) return d.getMinutes().toString().padStart(2, "0");
    return formatMinute(d, config, locale);
  };
  /** Seconds only */
  const formatSecondsWrapper = (value: Date | string) => {
    const d = toDate(value);
    const { locale, config } = getCtx();
    if (!locale || !config) return d.getSeconds().toString().padStart(2, "0");
    return formatSeconds(d, config, locale);
  };
  /** Long date & time without seconds */
  const formatDateTimeWrapper = (value: Date | string) => {
    const d = toDate(value);
    const { locale, config } = getCtx();
    if (!locale || !config) return fallback(d);
    return formatDateTime(d, config, locale);
  };
  /** Long date & time with seconds */
  const formatDateTimeWithSecondsWrapper = (value: Date | string) => {
    const d = toDate(value);
    const { locale, config } = getCtx();
    if (!locale || !config) return fallback(d);
    return formatDateTimeWithSeconds(d, locale, config);
  };
  /** Short date & time without year if current year */
  const formatShortDateTimeWrapper = (value: Date | string) => {
    const d = toDate(value);
    const { locale, config } = getCtx();
    if (!locale || !config) return fallback(d);
    return formatShortDateTime(d, locale, config);
  };
  /** Short date & time with year */
  const formatShortDateTimeWithYearWrapper = (value: Date | string) => {
    const d = toDate(value);
    const { locale, config } = getCtx();
    if (!locale || !config) return fallback(d);
    return formatShortDateTimeWithYear(d, locale, config);
  };
  /** Short date & time with conditional year */
  const formatShortDateTimeWithConditionalYearWrapper = (value: Date | string) => {
    const d = toDate(value);
    const { locale, config } = getCtx();
    if (!locale || !config) return fallback(d);
    return formatShortDateTimeWithConditionalYear(d, locale, config);
  };
  /** Browser default date & time fallback */
  const formatDateTimeWithBrowserDefaultsWrapper = (value: Date | string) => {
    return formatDateTimeWithBrowserDefaults(toDate(value));
  };
  /** Numeric date & time honoring locale ordering */
  const formatDateTimeNumericWrapper = (value: Date | string) => {
    const d = toDate(value);
    const { locale, config } = getCtx();
    if (!locale || !config) return fallback(d);
    return formatDateTimeNumeric(d, locale, config);
  };
  /** Weekday + Month + Day */
  const formatDateWeekdayDayWrapper = (value: Date | string) => {
    const d = toDate(value);
    const { locale, config } = getCtx();
    if (!locale || !config) return fallback(d);
    return formatDateWeekdayDay(d, locale, config);
  };
  /** Short date */
  const formatDateShortWrapper = (value: Date | string) => {
    const d = toDate(value);
    const { locale, config } = getCtx();
    if (!locale || !config) return fallback(d);
    return formatDateShort(d, locale, config);
  };
  /** Very short date */
  const formatDateVeryShortWrapper = (value: Date | string) => {
    const d = toDate(value);
    const { locale, config } = getCtx();
    if (!locale || !config) return fallback(d);
    return formatDateVeryShort(d, locale, config);
  };
  /** Month + Year */
  const formatDateMonthYearWrapper = (value: Date | string) => {
    const d = toDate(value);
    const { locale, config } = getCtx();
    if (!locale || !config) return fallback(d);
    return formatDateMonthYear(d, locale, config);
  };
  /** Month name */
  const formatDateMonthWrapper = (value: Date | string) => {
    const d = toDate(value);
    const { locale, config } = getCtx();
    if (!locale || !config) return fallback(d);
    return formatDateMonth(d, locale, config);
  };
  /** Year */
  const formatDateYearWrapper = (value: Date | string) => {
    const d = toDate(value);
    const { locale, config } = getCtx();
    if (!locale || !config) return fallback(d);
    return formatDateYear(d, locale, config);
  };
  /** Weekday long */
  const formatDateWeekdayWrapper = (value: Date | string) => {
    const d = toDate(value);
    const { locale, config } = getCtx();
    if (!locale || !config) return fallback(d);
    return formatDateWeekday(d, locale, config);
  };
  /** Weekday short */
  const formatDateWeekdayShortWrapper = (value: Date | string) => {
    const d = toDate(value);
    const { locale, config } = getCtx();
    if (!locale || !config) return fallback(d);
    return formatDateWeekdayShort(d, locale, config);
  };
  /** Numeric date honoring user ordering preference */
  const formatDateNumericWrapper = (value: Date | string) => {
    const d = toDate(value);
    const { locale, config } = getCtx();
    if (!locale || !config) return fallback(d);
    return formatDateNumeric(d, locale, config);
  };

  return {
    formatDate: formatDateWrapper,
    formatTime: formatTimeWrapper,
    formatTimeWithoutAmPm: formatTimeWithoutAmPmWrapper,
    formatHour: formatHourWrapper,
    formatAmPmSuffix: formatAmPmSuffixWrapper,
    formatMinute: formatMinuteWrapper,
    formatSeconds: formatSecondsWrapper,
    formatDateTime: formatDateTimeWrapper,
    formatDateTimeWithSeconds: formatDateTimeWithSecondsWrapper,
    formatShortDateTime: formatShortDateTimeWrapper,
    formatShortDateTimeWithYear: formatShortDateTimeWithYearWrapper,
    formatShortDateTimeWithConditionalYear: formatShortDateTimeWithConditionalYearWrapper,
    formatDateTimeWithBrowserDefaults: formatDateTimeWithBrowserDefaultsWrapper,
    formatDateTimeNumeric: formatDateTimeNumericWrapper,
    formatDateWeekdayDay: formatDateWeekdayDayWrapper,
    formatDateShort: formatDateShortWrapper,
    formatDateVeryShort: formatDateVeryShortWrapper,
    formatDateMonthYear: formatDateMonthYearWrapper,
    formatDateMonth: formatDateMonthWrapper,
    formatDateYear: formatDateYearWrapper,
    formatDateWeekday: formatDateWeekdayWrapper,
    formatDateWeekdayShort: formatDateWeekdayShortWrapper,
    formatDateNumeric: formatDateNumericWrapper,
  };
}
