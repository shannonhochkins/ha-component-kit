import { useEffect, useState, useCallback } from "react";

export const useHash = (): [string, (newHash: string) => void] => {
  const [hash, setHash] = useState(() => location.hash);

  useEffect(() => {
    if (typeof window === "undefined") return;
    function onHashChange() {
      setHash(location.hash);
    }
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  const _setHash = useCallback(
    (newHash: string) => {
      if (newHash !== hash) {
        location.hash = newHash;
      }
    },
    [hash],
  );

  return [hash, _setHash];
};
