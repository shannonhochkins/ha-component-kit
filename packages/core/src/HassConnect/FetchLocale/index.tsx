import { useConfig } from "@hooks";
import { Locales } from "@typings";
import { useEffect, useRef } from "react";
import { updateLocales } from "../../hooks/useLocale";
import locales from "../../hooks/useLocale/locales";
import { useStore } from "../HassContext";


interface FetchLocaleProps {
  locale?: Locales;
  children?: React.ReactNode;
}
export function FetchLocale({ locale, children }: FetchLocaleProps) {
  const config = useConfig();
  const fetched = useRef(false);
  const fetchPending = useRef(false);
  const setError = useStore((store) => store.setError);
  const setLocales = useStore((store) => store.setLocales);
  
  
  useEffect(() => {
    const match = locales.find(({ code }) => code === (locale ?? config?.language));
    if (!match) {
      fetched.current = false;
      fetchPending.current = false;
      setError(`Locale "${locale ?? config?.language}" not found, available options are "${locales.map(({ code }) => `${code}`).join(", ")}"`);
    } else if (!fetchPending.current) {
      fetched.current = false;
      fetchPending.current = true;
      match.fetch()
        .then(response => {
          fetchPending.current = false;
          fetched.current = true;
          updateLocales(response);
          setLocales(response);
        })
        .catch((e) => {
          fetchPending.current = false;
          fetched.current = false;
          setError(`Error retrieving translations from Home Assistant: ${e?.message ?? e}`);
        })
    }
  }, [config, setLocales, setError, locale])

  return fetched.current ? children : null;
}