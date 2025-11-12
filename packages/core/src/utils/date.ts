import { HassConfig } from "home-assistant-js-websocket";
import { FrontendLocaleData, DateFormat } from "./subscribe/frontend_data";

const RESOLVED_TIME_ZONE = Intl.DateTimeFormat?.().resolvedOptions?.().timeZone;

// Browser time zone can be determined from Intl, with fallback to UTC for polyfill or no support.
export const LOCAL_TIME_ZONE = RESOLVED_TIME_ZONE ?? "UTC";

// Pick time zone based on user profile option.  Core zone is used when local cannot be determined.
export const resolveTimeZone = (option: TimeZone, serverTimeZone: string) =>
  option === TimeZone.local && RESOLVED_TIME_ZONE ? LOCAL_TIME_ZONE : serverTimeZone;

export enum TimeFormat {
  language = "language",
  system = "system",
  am_pm = "12",
  twenty_four = "24",
}

export enum TimeZone {
  local = "local",
  server = "server",
}

export const shouldUseAmPm = (locale: FrontendLocaleData): boolean => {
  if (locale.time_format === TimeFormat.language || locale.time_format === TimeFormat.system) {
    const testLanguage = locale.time_format === TimeFormat.language ? locale.language : undefined;
    const test = new Date("January 1, 2023 22:00:00").toLocaleString(testLanguage);
    return test.includes("10");
  }

  return locale.time_format === TimeFormat.am_pm;
};

const DAY_IN_MILLISECONDS = 86400000;
const HOUR_IN_MILLISECONDS = 3600000;
const MINUTE_IN_MILLISECONDS = 60000;
const SECOND_IN_MILLISECONDS = 1000;

export const UNIT_TO_MILLISECOND_CONVERT = {
  ms: 1,
  s: SECOND_IN_MILLISECONDS,
  min: MINUTE_IN_MILLISECONDS,
  h: HOUR_IN_MILLISECONDS,
  d: DAY_IN_MILLISECONDS,
};

export const formatDuration = (duration: string, units: keyof typeof UNIT_TO_MILLISECOND_CONVERT): string =>
  millisecondsToDuration(parseFloat(duration) * UNIT_TO_MILLISECOND_CONVERT[units]) || "0";

const leftPad = (num: number, digits = 2) => {
  let paddedNum = "" + num;
  for (let i = 1; i < digits; i++) {
    paddedNum = parseInt(paddedNum) < 10 ** i ? `0${paddedNum}` : paddedNum;
  }
  return paddedNum;
};

export function millisecondsToDuration(d: number) {
  const h = Math.floor(d / 1000 / 3600);
  const m = Math.floor(((d / 1000) % 3600) / 60);
  const s = Math.floor(((d / 1000) % 3600) % 60);
  const ms = Math.floor(d % 1000);

  if (h > 0) {
    return `${h}:${leftPad(m)}:${leftPad(s)}`;
  }
  if (m > 0) {
    return `${m}:${leftPad(s)}`;
  }
  if (s > 0 || ms > 0) {
    return `${s}${ms > 0 ? `.${leftPad(ms, 3)}` : ``}`;
  }
  return null;
}

// https://stackoverflow.com/a/14322189/1947205
// Changes:
// 1. Do not allow a plus or minus at the start.
// 2. Enforce that we have a "T" or a blank after the date portion
//    to ensure we have a timestamp and not only a date.
// 3. Disallow dates based on week number.
// 4. Disallow dates only consisting of a year.
// https://regex101.com/r/kc5C14/3
const regexp =
  /^\d{4}-(0[1-9]|1[0-2])-([12]\d|0[1-9]|3[01])[T| ](((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([.,]\d+(?!:))?)(\8[0-5]\d([.,]\d+)?)?([zZ]|([+-])([01]\d|2[0-3]):?([0-5]\d)?)?)$/;

export const isTimestamp = (input: string): boolean => regexp.test(input);

// https://regex101.com/r/kc5C14/2
const regExpString = "^\\d{4}-(0[1-9]|1[0-2])-([12]\\d|0[1-9]|3[01])";

const regExp = new RegExp(regExpString + "$");
// 2nd expression without the "end of string" enforced, so it can be used
// to just verify the start of a string and then based on that result e.g.
// check for a full timestamp string efficiently.
const regExpNoStringEnd = new RegExp(regExpString);

export const isDate = (input: string, allowCharsAfterDate = false): boolean =>
  allowCharsAfterDate ? regExpNoStringEnd.test(input) : regExp.test(input);

export function checkValidDate(date?: Date): boolean {
  if (!date) {
    return false;
  }

  return date instanceof Date && !isNaN(date.valueOf());
}

// Single-entry memo factory: caches only the last invocation per formatter.
// This keeps memory footprint minimal while still avoiding repeated construction
// during render cycles with stable locale/timezone preferences.
function singleEntryMemo<Args extends unknown[], R>(factory: (...a: Args) => R) {
  let lastArgs: Args | null = null;
  let lastResult: R | null = null;
  return (...args: Args): R => {
    if (lastArgs && lastArgs.length === args.length && lastArgs.every((v, i) => v === args[i])) {
      return lastResult as R;
    }
    lastArgs = args;
    lastResult = factory(...args);
    return lastResult as R;
  };
}

const dateFormatterMem = singleEntryMemo(
  (locale: FrontendLocaleData, serverTZ: string) =>
    new Intl.DateTimeFormat(locale.language, {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: resolveTimeZone(locale.time_zone, serverTZ),
    }),
);

const timeFormatterMem = singleEntryMemo(
  (locale: FrontendLocaleData, serverTZ: string) =>
    new Intl.DateTimeFormat(locale.language, {
      hour: shouldUseAmPm(locale) ? "numeric" : "2-digit",
      minute: "2-digit",
      hourCycle: shouldUseAmPm(locale) ? "h12" : "h23",
      timeZone: resolveTimeZone(locale.time_zone, serverTZ),
    }),
);

// Always returns 24h time without an AM/PM suffix regardless of locale time preference.
// We intentionally only respect timezone here: language does not influence output because it's numeric.
const timeWithoutAmPmFormatterMem = singleEntryMemo(
  (serverTZ: string) =>
    new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      timeZone: serverTZ,
    }),
);

const dateTimeFormatterMem = singleEntryMemo(
  (locale: FrontendLocaleData, serverTZ: string) =>
    new Intl.DateTimeFormat(locale.language, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: shouldUseAmPm(locale) ? "numeric" : "2-digit",
      minute: "2-digit",
      hourCycle: shouldUseAmPm(locale) ? "h12" : "h23",
      timeZone: resolveTimeZone(locale.time_zone, serverTZ),
    }),
);

const dateTimeWithSecondsFormatterMem = singleEntryMemo(
  (locale: FrontendLocaleData, serverTZ: string) =>
    new Intl.DateTimeFormat(locale.language, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: shouldUseAmPm(locale) ? "numeric" : "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: shouldUseAmPm(locale) ? "h12" : "h23",
      timeZone: resolveTimeZone(locale.time_zone, serverTZ),
    }),
);

const shortDateTimeWithYearMem = singleEntryMemo(
  (locale: FrontendLocaleData, serverTZ: string) =>
    new Intl.DateTimeFormat(locale.language, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: shouldUseAmPm(locale) ? "numeric" : "2-digit",
      minute: "2-digit",
      hourCycle: shouldUseAmPm(locale) ? "h12" : "h23",
      timeZone: resolveTimeZone(locale.time_zone, serverTZ),
    }),
);

const shortDateTimeMem = singleEntryMemo(
  (locale: FrontendLocaleData, serverTZ: string) =>
    new Intl.DateTimeFormat(locale.language, {
      month: "short",
      day: "numeric",
      hour: shouldUseAmPm(locale) ? "numeric" : "2-digit",
      minute: "2-digit",
      hourCycle: shouldUseAmPm(locale) ? "h12" : "h23",
      timeZone: resolveTimeZone(locale.time_zone, serverTZ),
    }),
);

const browserDefaultsFormatterMem = singleEntryMemo(
  () =>
    new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
);

// --- Additional granular date formatters for HA parity ---

const dateWeekdayDayMem = singleEntryMemo(
  (locale: FrontendLocaleData, serverTZ: string) =>
    new Intl.DateTimeFormat(locale.language, {
      weekday: "long",
      month: "long",
      day: "numeric",
      timeZone: resolveTimeZone(locale.time_zone, serverTZ),
    }),
);

const dateShortMem = singleEntryMemo(
  (locale: FrontendLocaleData, serverTZ: string) =>
    new Intl.DateTimeFormat(locale.language, {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: resolveTimeZone(locale.time_zone, serverTZ),
    }),
);

const dateVeryShortMem = singleEntryMemo(
  (locale: FrontendLocaleData, serverTZ: string) =>
    new Intl.DateTimeFormat(locale.language, {
      day: "numeric",
      month: "short",
      timeZone: resolveTimeZone(locale.time_zone, serverTZ),
    }),
);

const dateMonthYearMem = singleEntryMemo(
  (locale: FrontendLocaleData, serverTZ: string) =>
    new Intl.DateTimeFormat(locale.language, {
      month: "long",
      year: "numeric",
      timeZone: resolveTimeZone(locale.time_zone, serverTZ),
    }),
);

const dateMonthMem = singleEntryMemo(
  (locale: FrontendLocaleData, serverTZ: string) =>
    new Intl.DateTimeFormat(locale.language, {
      month: "long",
      timeZone: resolveTimeZone(locale.time_zone, serverTZ),
    }),
);

const dateYearMem = singleEntryMemo(
  (locale: FrontendLocaleData, serverTZ: string) =>
    new Intl.DateTimeFormat(locale.language, {
      year: "numeric",
      timeZone: resolveTimeZone(locale.time_zone, serverTZ),
    }),
);

const dateWeekdayMem = singleEntryMemo(
  (locale: FrontendLocaleData, serverTZ: string) =>
    new Intl.DateTimeFormat(locale.language, {
      weekday: "long",
      timeZone: resolveTimeZone(locale.time_zone, serverTZ),
    }),
);

const dateWeekdayShortMem = singleEntryMemo(
  (locale: FrontendLocaleData, serverTZ: string) =>
    new Intl.DateTimeFormat(locale.language, {
      weekday: "short",
      timeZone: resolveTimeZone(locale.time_zone, serverTZ),
    }),
);

// Numeric date with user preference ordering (DMY/MDY/YMD) when locale.date_format overrides language/system.
const dateNumericBaseMem = singleEntryMemo((locale: FrontendLocaleData, serverTZ: string) => {
  const localeString = locale.date_format === DateFormat.system ? undefined : locale.language;
  return new Intl.DateTimeFormat(localeString, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    timeZone: resolveTimeZone(locale.time_zone, serverTZ),
  });
});

/** Format a date (long month) e.g. "August 9, 2021" */
export const formatDate = (dateObj: Date, config: HassConfig, locale: FrontendLocaleData) =>
  dateFormatterMem(locale, config.time_zone).format(dateObj);

/** Format a time respecting 12/24 preference e.g. "8:23 AM" or "08:23" */
export const formatTime = (dateObj: Date, config: HassConfig, locale: FrontendLocaleData) =>
  timeFormatterMem(locale, config.time_zone).format(dateObj);

/** Format a time forcing 24h cycle (HH:MM) without an AM/PM suffix, ignoring user 12h preference. */
export const formatTimeWithoutAmPm = (dateObj: Date, config: HassConfig) => timeWithoutAmPmFormatterMem(config.time_zone).format(dateObj);

/** Long date & time without seconds e.g. "August 9, 2021, 8:23 AM" */
export const formatDateTime = (dateObj: Date, config: HassConfig, locale: FrontendLocaleData) =>
  dateTimeFormatterMem(locale, config.time_zone).format(dateObj);

// August 9, 2021, 8:23:15 AM
/** Long date & time with seconds e.g. "August 9, 2021, 8:23:15 AM" */
export const formatDateTimeWithSeconds = (dateObj: Date, locale: FrontendLocaleData, config: HassConfig) =>
  dateTimeWithSecondsFormatterMem(locale, config.time_zone).format(dateObj);

/** Short date/time without year if same year e.g. "Aug 9, 8:23 AM" */
export const formatShortDateTime = (dateObj: Date, locale: FrontendLocaleData, config: HassConfig) =>
  shortDateTimeMem(locale, config.time_zone).format(dateObj);

/** Short date/time with year e.g. "Aug 9, 2021, 8:23 AM" */
export const formatShortDateTimeWithYear = (dateObj: Date, locale: FrontendLocaleData, config: HassConfig) =>
  shortDateTimeWithYearMem(locale, config.time_zone).format(dateObj);

/** Conditionally include year (current year omitted) */
export const formatShortDateTimeWithConditionalYear = (dateObj: Date, locale: FrontendLocaleData, config: HassConfig) => {
  const now = new Date();
  return now.getFullYear() === dateObj.getFullYear()
    ? formatShortDateTime(dateObj, locale, config)
    : formatShortDateTimeWithYear(dateObj, locale, config);
};

/** Browser default locale (useful for fallback) */
export const formatDateTimeWithBrowserDefaults = (dateObj: Date) => browserDefaultsFormatterMem().format(dateObj);

/** Numeric date/time variant (delegates to existing helpers if present) */
export const formatDateTimeNumeric = (dateObj: Date, locale: FrontendLocaleData, config: HassConfig) => {
  // Provide a simple numeric format similar to HA's `formatDateTimeNumeric`.
  // We intentionally do not memoize this combined string (two memoized parts already).
  const datePart = new Intl.DateTimeFormat(locale.language, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    timeZone: resolveTimeZone(locale.time_zone, config.time_zone),
  }).format(dateObj);
  return `${datePart}, ${formatTime(dateObj, config, locale)}`;
};

/** Weekday + Month + Day (e.g. "Tuesday, August 10") */
export const formatDateWeekdayDay = (dateObj: Date, locale: FrontendLocaleData, config: HassConfig) =>
  dateWeekdayDayMem(locale, config.time_zone).format(dateObj);

/** Short date (e.g. "Aug 10, 2021") */
export const formatDateShort = (dateObj: Date, locale: FrontendLocaleData, config: HassConfig) =>
  dateShortMem(locale, config.time_zone).format(dateObj);

/** Very short date (e.g. "Aug 10") */
export const formatDateVeryShort = (dateObj: Date, locale: FrontendLocaleData, config: HassConfig) =>
  dateVeryShortMem(locale, config.time_zone).format(dateObj);

/** Month + Year (e.g. "August 2021") */
export const formatDateMonthYear = (dateObj: Date, locale: FrontendLocaleData, config: HassConfig) =>
  dateMonthYearMem(locale, config.time_zone).format(dateObj);

/** Month name (e.g. "August") */
export const formatDateMonth = (dateObj: Date, locale: FrontendLocaleData, config: HassConfig) =>
  dateMonthMem(locale, config.time_zone).format(dateObj);

/** Year (e.g. "2021") */
export const formatDateYear = (dateObj: Date, locale: FrontendLocaleData, config: HassConfig) =>
  dateYearMem(locale, config.time_zone).format(dateObj);

/** Weekday long (e.g. "Monday") */
export const formatDateWeekday = (dateObj: Date, locale: FrontendLocaleData, config: HassConfig) =>
  dateWeekdayMem(locale, config.time_zone).format(dateObj);

/** Weekday short (e.g. "Mon") */
export const formatDateWeekdayShort = (dateObj: Date, locale: FrontendLocaleData, config: HassConfig) =>
  dateWeekdayShortMem(locale, config.time_zone).format(dateObj);

/** Numeric date honoring user ordering preference (e.g. DMY -> 10/08/2021) */
export const formatDateNumeric = (dateObj: Date, locale: FrontendLocaleData, config: HassConfig) => {
  const formatter = dateNumericBaseMem(locale, config.time_zone);
  if (locale.date_format === DateFormat.language || locale.date_format === DateFormat.system) {
    return formatter.format(dateObj);
  }
  const parts = formatter.formatToParts(dateObj);
  const literal = parts.find((p) => p.type === "literal")?.value || "/";
  const day = parts.find((p) => p.type === "day")?.value || "";
  const month = parts.find((p) => p.type === "month")?.value || "";
  const year = parts.find((p) => p.type === "year")?.value || "";
  const lastPart = parts[parts.length - 1];
  let lastLiteral = lastPart?.type === "literal" ? lastPart.value : "";
  if (locale.language === "bg" && locale.date_format === DateFormat.YMD) {
    lastLiteral = "";
  }
  const byFormat: Record<DateFormat, string> = {
    [DateFormat.DMY]: `${day}${literal}${month}${literal}${year}${lastLiteral}`,
    [DateFormat.MDY]: `${month}${literal}${day}${literal}${year}${lastLiteral}`,
    [DateFormat.YMD]: `${year}${literal}${month}${literal}${day}${lastLiteral}`,
    [DateFormat.language]: formatter.format(dateObj),
    [DateFormat.system]: formatter.format(dateObj),
  };
  return byFormat[locale.date_format];
};

/**
 * Return a localized day period (AM/PM or locale equivalent) for the given date.
 * This intentionally ignores the user's 24h preference so callers can always access the suffix if desired.
 * Only timezone and language are considered (not time_format). Falls back to simple "AM"/"PM" on failure.
 */
export const formatAmPmSuffix = (dateObj: Date, locale: FrontendLocaleData, config: HassConfig): string => {
  try {
    const formatter = new Intl.DateTimeFormat(locale.language, {
      hour: "numeric",
      hour12: true,
      timeZone: resolveTimeZone(locale.time_zone, config.time_zone),
    });
    const parts = formatter.formatToParts(dateObj);
    const period = parts.find((p) => p.type === "dayPeriod")?.value;
    return period || (dateObj.getHours() >= 12 ? "PM" : "AM");
  } catch {
    return dateObj.getHours() >= 12 ? "PM" : "AM";
  }
};
