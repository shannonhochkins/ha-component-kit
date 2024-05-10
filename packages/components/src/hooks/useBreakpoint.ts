import { useEffect, useState, useMemo } from "react";
import { getBreakpoints, type BreakPoint } from "@components";
import { useHass } from "@hakit/core";

export function useBreakpoint(): { [key in BreakPoint]: boolean } {
  const { useStore } = useHass();
  const breakpoints = useStore((store) => store.breakpoints);
  const _queeries = useMemo(() => getBreakpoints(breakpoints), [breakpoints]);
  const initialMatches: { [key in BreakPoint]: boolean } = {
    xxs: false,
    xs: false,
    sm: false,
    md: false,
    lg: false,
    xlg: false,
  };

  const [matches, setMatches] = useState(initialMatches);

  useEffect(() => {
    const handleChange = (type: BreakPoint, mediaQueryList: MediaQueryList) => {
      setMatches((prev) => ({ ...prev, [type]: mediaQueryList.matches }));
    };

    const mediaQueryLists: {
      [key in BreakPoint]: MediaQueryList;
    } = {
      xxs: window.matchMedia(_queeries.xxs),
      xs: window.matchMedia(_queeries.xs),
      sm: window.matchMedia(_queeries.sm),
      md: window.matchMedia(_queeries.md),
      lg: window.matchMedia(_queeries.lg),
      xlg: window.matchMedia(_queeries.xlg),
    };

    // Initialize
    Object.keys(mediaQueryLists).forEach((type) => {
      handleChange(type as BreakPoint, mediaQueryLists[type as BreakPoint]);
    });

    // Add listeners
    Object.keys(mediaQueryLists).forEach((type) => {
      const mediaQueryList = mediaQueryLists[type as BreakPoint];
      mediaQueryList.addEventListener("change", (event) => handleChange(type as BreakPoint, event.currentTarget as MediaQueryList));
    });

    // Cleanup listeners
    return () => {
      Object.keys(mediaQueryLists).forEach((type) => {
        const mediaQueryList = mediaQueryLists[type as BreakPoint];
        mediaQueryList.removeEventListener("change", (event) => handleChange(type as BreakPoint, event.currentTarget as MediaQueryList));
      });
    };
  }, [_queeries]);

  return matches;
}
