const columns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
// a type to only allow numbers 1 through 12
export type GridSpan = (typeof columns)[number];

export interface AvailableQueries {
  /** For example, xs={12} sm={6} sizes a component to occupy half of the viewport width (6 columns) (50% width) when viewport width is activated `SM` breakpoint or more pixels. For smaller viewports, the component fills all 12 available columns (100% width). */
  xxs?: GridSpan;
  /** For example, xs={12} sm={6} sizes a component to occupy half of the viewport width (6 columns) (50% width) when viewport width is activated `SM` breakpoint or more pixels. For smaller viewports, the component fills all 12 available columns (100% width). */
  xs?: GridSpan;
  /** For example, xs={12} sm={6} sizes a component to occupy half of the viewport width (6 columns) (50% width) when viewport width is activated `SM` breakpoint or more pixels. For smaller viewports, the component fills all 12 available columns (100% width). */
  sm?: GridSpan;
  /** For example, xs={12} sm={6} sizes a component to occupy half of the viewport width (6 columns) (50% width) when viewport width is activated `SM` breakpoint or more pixels. For smaller viewports, the component fills all 12 available columns (100% width). */
  md?: GridSpan;
  /** For example, xs={12} sm={6} sizes a component to occupy half of the viewport width (6 columns) (50% width) when viewport width is activated `SM` breakpoint or more pixels. For smaller viewports, the component fills all 12 available columns (100% width). */
  lg?: GridSpan;
  /** For example, xs={12} sm={6} sizes a component to occupy half of the viewport width (6 columns) (50% width) when viewport width is activated `SM` breakpoint or more pixels. For smaller viewports, the component fills all 12 available columns (100% width). */
  xlg?: GridSpan;
}

export const orderedBreakpoints: Exclude<BreakPoint, "xlg">[] = ["xxs", "xs", "sm", "md", "lg"];
export const allBreakpoints: BreakPoint[] = [...orderedBreakpoints, "xlg"];

export type BreakPoint = keyof AvailableQueries;
export type BreakPoints = Partial<Record<Exclude<BreakPoint, "xlg">, number>>;
export type BreakPointsWithXlg = Partial<Record<BreakPoint, number>>;

export const getBreakpoints = (breakpoints: BreakPoints) => {
  const definedEntries = orderedBreakpoints
    .filter((key) => breakpoints[key] !== undefined)
    .map((key) => [key, breakpoints[key]!] as [Exclude<BreakPoint, "xlg">, number]);

  const result: Partial<Record<BreakPoint, string>> = {};

  for (let i = 0; i < definedEntries.length; i++) {
    const [key, value] = definedEntries[i];
    if (i > 0) {
      const prevValue = definedEntries[i - 1][1];
      if (value <= prevValue) {
        throw new Error(`Breakpoint "${key}" must be greater than "${definedEntries[i - 1][0]}". Got ${value} <= ${prevValue}.`);
      }

      result[key] = `(min-width: ${prevValue + 1}px) and (max-width: ${value}px)`;
    } else {
      result[key] = `(max-width: ${value}px)`;
    }
  }
  // if no breakpoints available, set to -1 so we only get xlg >= 0
  const lastValue = definedEntries.length === 0 ? -1 : definedEntries[definedEntries.length - 1][1];

  result["xlg"] = `(min-width: ${lastValue + 1}px)`;

  return result;
};

export const mq = (names: BreakPoint[], cssValues: string) => {
  return names
    .map(
      (name) => `
    .bp-${name} & {
      ${cssValues}
    }
  `,
    )
    .join("\n");
};

export const getColumnSizeCSS = (column: GridSpan): string => {
  // Calculate the base width for each column.
  return `calc(
    (100% - 11 * var(--gap, 0px)) * ${column} / 12 + (${column} - 1) * var(--gap, 0px)
  )`;
};

export const generateColumnBreakpoints = (breakpoints: BreakPoints) => {
  // for every breakpoint, generate the css for each column, it should be a string like this:
  return Object.entries(breakpoints).reduce((acc, [breakpoint, value]) => {
    // if the current breakpoint is not defined, skip it
    if (value === undefined) {
      return acc;
    }
    const breakpointColumns = columns.map((column) => {
      return `
        .bp-${breakpoint} {
          .${breakpoint}-${column} {
            width: ${getColumnSizeCSS(column)};
          }
        }
      `;
    });
    return acc + breakpointColumns.join("\n");
  }, "");
};
