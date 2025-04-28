import { useConfig } from "@hooks";
import { Locales } from "@typings";
import { useEffect, useRef, useState } from "react";
import { updateLocales } from "../../hooks/useLocale";
import locales from "../../hooks/useLocale/locales";
import { useStore } from "../HassContext";

interface FetchLocaleProps {
  locale?: Locales;
  children?: React.ReactNode;
}
export function FetchLocale({ locale, children }: FetchLocaleProps) {
  const config = useConfig();
  const [fetched, setFetched] = useState(false);
  const fetchPending = useRef(false);
  const previousLocale = useRef<Locales | null>(null);
  const setError = useStore((store) => store.setError);
  const setLocales = useStore((store) => store.setLocales);

  useEffect(() => {
    const _locale = locale ?? config?.language;
    if (!_locale) {
      // may just be waiting for the users config to resolve
      return;
    }
    const match = locales.find(({ code }) => code === (locale ?? config?.language));
    if (previousLocale.current !== match?.code) {
      setFetched(false);
      fetchPending.current = false;
      setError(null);
    }

    if (!match) {
      fetchPending.current = false;
      setError(
        `Locale "${locale ?? config?.language}" not found, available options are "${locales.map(({ code }) => `${code}`).join(", ")}"`,
      );
    } else {
      if (fetchPending.current) return;
      fetchPending.current = true;
      previousLocale.current = match.code;
      match
        .fetch()
        .then((response) => {
          fetchPending.current = false;
          setFetched(true);
          updateLocales(response);
          setLocales(response);
        })
        .catch((e) => {
          fetchPending.current = false;
          setFetched(true);
          setError(`Error retrieving translations from Home Assistant: ${e?.message ?? e}`);
        });
    }
  }, [config, fetched, setLocales, setError, locale]);

  return fetched ? children : null;
}
