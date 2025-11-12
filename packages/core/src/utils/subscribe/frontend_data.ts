import { Connection } from "home-assistant-js-websocket";

import { localeTranslations } from "../../hooks/useLocale/locales";
import { TimeZone, TimeFormat } from "@utils/date";

export interface FrontendLocaleData {
  language: string;
  number_format: NumberFormat;
  time_format: TimeFormat;
  date_format: DateFormat;
  first_weekday: FirstWeekday;
  time_zone: TimeZone;
}
interface FrontendUserData {
  language: FrontendLocaleData;
}

export enum NumberFormat {
  language = "language",
  system = "system",
  comma_decimal = "comma_decimal",
  decimal_comma = "decimal_comma",
  quote_decimal = "quote_decimal",
  space_comma = "space_comma",
  none = "none",
}

export enum DateFormat {
  language = "language",
  system = "system",
  DMY = "DMY",
  MDY = "MDY",
  YMD = "YMD",
}

export enum FirstWeekday {
  language = "language",
  monday = "monday",
  tuesday = "tuesday",
  wednesday = "wednesday",
  thursday = "thursday",
  friday = "friday",
  saturday = "saturday",
  sunday = "sunday",
}

export type ValidUserDataKey = keyof FrontendUserData;

export const subscribeFrontendUserData = <UserDataKey extends ValidUserDataKey>(
  conn: Connection,
  userDataKey: UserDataKey,
  onChange: (data: { value: FrontendUserData[UserDataKey] | null }) => void,
) =>
  conn.subscribeMessage<{ value: FrontendUserData[UserDataKey] | null }>(onChange, {
    type: "frontend/subscribe_user_data",
    key: userDataKey,
  });

// Chinese locales need map to Simplified or Traditional Chinese
const LOCALE_LOOKUP = {
  "zh-cn": "zh-Hans",
  "zh-sg": "zh-Hans",
  "zh-my": "zh-Hans",
  "zh-tw": "zh-Hant",
  "zh-hk": "zh-Hant",
  "zh-mo": "zh-Hant",
  zh: "zh-Hant", // all other Chinese locales map to Traditional Chinese
};

/**
 * Search for a matching translation from most specific to general
 */
export function findAvailableLanguage(language: string) {
  // In most case, the language has the same format with our translation meta data
  if (localeTranslations.find((lang) => lang.code === language)) {
    return language;
  }

  // Perform case-insensitive comparison since browser isn't required to
  // report languages with specific cases.
  const langLower = language.toLowerCase();

  if (langLower in LOCALE_LOOKUP) {
    return LOCALE_LOOKUP[langLower as keyof typeof LOCALE_LOOKUP];
  }

  const translation = localeTranslations.find((lang) => lang.code.toLowerCase() === langLower);
  if (translation) {
    return translation.code;
  }

  if (language.includes("-")) {
    return findAvailableLanguage(language.split("-")[0]);
  }

  return undefined;
}

/**
 * Get user selected locale data from backend
 */
export function getUserLocaleLanguage(data: FrontendLocaleData): string {
  const language = data.language;
  if (language) {
    const availableLanguage = findAvailableLanguage(language);
    if (availableLanguage) {
      return availableLanguage;
    }
  }
  return language;
}
