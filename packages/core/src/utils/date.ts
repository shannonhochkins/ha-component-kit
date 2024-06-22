import { HassConfig } from "home-assistant-js-websocket";

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

const dateFormatterCache: { [key: string]: Intl.DateTimeFormat } = {};
const timeFormatterCache: { [key: string]: Intl.DateTimeFormat } = {};
const dateTimeFormatterCache: { [key: string]: Intl.DateTimeFormat } = {};

const getDateFormatter = (timeZone: string) => {
  if (!dateFormatterCache[timeZone]) {
    dateFormatterCache[timeZone] = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone,
    });
  }
  return dateFormatterCache[timeZone];
};

const getTimeFormatter = (timeZone: string) => {
  if (!timeFormatterCache[timeZone]) {
    timeFormatterCache[timeZone] = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hourCycle: "h12",
      timeZone,
    });
  }
  return timeFormatterCache[timeZone];
};

const getDateTimeFormatter = (timeZone: string) => {
  if (!dateTimeFormatterCache[timeZone]) {
    dateTimeFormatterCache[timeZone] = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hourCycle: "h12",
      timeZone,
    });
  }
  return dateTimeFormatterCache[timeZone];
};
// 9:15 PM || 21:15
export const formatDate = (dateObj: Date, config: HassConfig) => getDateFormatter(config.time_zone).format(dateObj);
// 9:15 PM || 21:15
export const formatTime = (dateObj: Date, config: HassConfig) => getTimeFormatter(config.time_zone).format(dateObj);
// August 9, 2021, 8:23 AM
export const formatDateTime = (dateObj: Date, config: HassConfig) => getDateTimeFormatter(config.time_zone).format(dateObj);
