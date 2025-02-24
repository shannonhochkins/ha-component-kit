import { useEffect, useState, useMemo } from "react";
import { getBreakpoints, type BreakPoint } from "@components";
import { useHass } from "@hakit/core";

/**
 * @description This hook can be used to programmatically change the layout/content or functionality based on the current breakpoint.
 * This will return an object with all breakpoint key names and their active state.
 *
 * NOTE: If you're running hakit within an iframe, you'll need to update the window context in the HassConnect.options.windowContext property
 *
 * @example
 * ```tsx
 * import { useBreakpoint } from "@hakit/components";
 * function SomeComponent() {
 *  const bp = useBreakpoint();
 * return (
 *   <div>
 *     {bp.xxs && <p>Extra small</p>}
 *     {bp.xs && <p>Small</p>}
 *     {bp.sm && <p>Medium</p>}
 *     {bp.md && <p>Large</p>}
 *     {bp.lg && <p>Extra large</p>}
 *   </div>
 *   );
 * }
 *
 * @returns { [key in BreakPoint]: boolean } - Object containing the breakpoint keys and if they're active or not.
 */
export function useBreakpoint(): { [key in BreakPoint]: boolean } {
  const { useStore } = useHass();
  const breakpoints = useStore((store) => store.breakpoints);
  const windowContext = useStore((store) => store.windowContext);
  const win = windowContext ?? window;
  const _queries = useMemo(() => getBreakpoints(breakpoints), [breakpoints]);
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
      xxs: win.matchMedia(_queries.xxs),
      xs: win.matchMedia(_queries.xs),
      sm: win.matchMedia(_queries.sm),
      md: win.matchMedia(_queries.md),
      lg: win.matchMedia(_queries.lg),
      xlg: win.matchMedia(_queries.xlg),
    };

    // Initialize
    Object.keys(mediaQueryLists).forEach((type) => {
      handleChange(type as BreakPoint, mediaQueryLists[type as BreakPoint]);
    });

    // Add listeners
    Object.keys(mediaQueryLists).forEach((type) => {
      const mediaQueryList = mediaQueryLists[type as BreakPoint];
      // intentionally using optional chaining here so if the window context used changes it doesn't throw an error
      mediaQueryList?.addEventListener("change", (event) => handleChange(type as BreakPoint, event.currentTarget as MediaQueryList));
    });

    // Cleanup listeners
    return () => {
      Object.keys(mediaQueryLists).forEach((type) => {
        const mediaQueryList = mediaQueryLists[type as BreakPoint];
        // intentionally using optional chaining here so if the window context used changes it doesn't throw an error
        mediaQueryList?.removeEventListener("change", (event) => handleChange(type as BreakPoint, event.currentTarget as MediaQueryList));
      });
    };
  }, [_queries, win]);

  return matches;
}
