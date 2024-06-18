import { useState, useEffect } from "react";
import { LocaleKeys } from "./locales/types";
import locales from "./locales";
import { useHass } from "../useHass";

const LOCALES: Record<string, string> = {};

export function updateLocales(translations: Record<string, string>): void {
  Object.assign(LOCALES, translations);
}

interface Options {
  /** if the string isn't found as some languages might not have specific values translated, it will use this value. */
  fallback?: string;
  /** value to search & replace */
  search?: string;
  /** value to search & replace */
  replace?: string;
}

export function localize(key: LocaleKeys, { search, replace, fallback }: Options = {}): string {
  if (!LOCALES[key]) {
    if (fallback) {
      return fallback;
    }
    // as a generic fallback, we just return the keyname
    return key;
  }
  if (typeof search === "string" && typeof replace === "string") {
    return LOCALES[key].replace(`${search}`, replace).trim();
  }
  return LOCALES[key];
}

export function useLocales(): Record<LocaleKeys, string> {
  return LOCALES;
}

export const useLocale = (key: LocaleKeys, options: Options) => {
  const { fallback = localize("unknown") } = options;
  const [value, setValue] = useState<string>(fallback);
  const { getConfig } = useHass();

  useEffect(() => {
    const fetchAndSetLocale = async () => {
      const locale = (await getConfig())?.language;
      const localeData = locales.find((l) => l.code === locale);
      if (localeData) {
        const data = await localeData.fetch();
        setValue(data[key] ?? fallback);
      }
    };

    fetchAndSetLocale();
  }, [key, fallback, getConfig]);

  return value;
};
