import { useEffect, useState, useMemo } from "react";
import { getBreakpoints, allBreakpoints, type BreakPoint, useThemeStore } from "@components";
import { useStore } from "@hakit/core";

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
  const breakpoints = useThemeStore((store) => store.breakpoints);
  const windowContext = useStore((store) => store.windowContext);
  const win = windowContext ?? window;
  const queries = useMemo(() => getBreakpoints(breakpoints), [breakpoints]);
  const [matches, setMatches] = useState(() => Object.fromEntries(allBreakpoints.map((bp) => [bp, false])) as Record<BreakPoint, boolean>);

  useEffect(() => {
    const context = win || window;
    const mqlMap = new Map<BreakPoint, MediaQueryList>();

    const updateMatches = () => {
      const newMatches = Object.fromEntries(allBreakpoints.map((bp) => [bp, false])) as Record<BreakPoint, boolean>;

      for (const bp of allBreakpoints) {
        const query = queries[bp];
        if (typeof query === "string") {
          const mql = mqlMap.get(bp);
          if (mql?.matches) {
            newMatches[bp] = true;
            // Only one should be active at a time, so we can break here
            break;
          }
        }
      }

      setMatches(newMatches);
    };

    for (const bp of allBreakpoints) {
      const query = queries[bp];
      if (typeof query === "string") {
        const mql = context.matchMedia(query);
        // when dynamically switch context (windows) the mql will be null
        // let the next iteration handle the mql
        if (!mql) continue;
        mqlMap.set(bp, mql);
        mql.addEventListener("change", updateMatches);
      }
    }

    // Set initial matches
    updateMatches();

    return () => {
      for (const mql of mqlMap.values()) {
        if (!mql) continue;
        mql.removeEventListener("change", updateMatches);
      }
    };
  }, [queries, win]);

  return matches;
}
