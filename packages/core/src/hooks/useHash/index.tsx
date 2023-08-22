import { useEffect, useState, useCallback } from "react";

export const useHash = (): [string, (newHash: string) => void] => {
  const [hash, setHash] = useState(() =>
    typeof location !== "undefined" ? location.hash : "",
  );

  const hashChangeHandler = useCallback(() => {
    setHash(typeof location !== "undefined" ? location.hash : "");
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.addEventListener("hashchange", hashChangeHandler);
    return () => {
      window.removeEventListener("hashchange", hashChangeHandler);
    };
  }, [hashChangeHandler]);

  const _setHash = useCallback(
    (newHash: string) => {
      if (newHash !== hash && typeof location !== "undefined") {
        location.hash = newHash;
      }
    },
    [hash],
  );

  return [hash, _setHash];
};
