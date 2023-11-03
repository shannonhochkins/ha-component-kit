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

export type BreakPoint = keyof AvailableQueries;
export type BreakPoints = Record<Exclude<BreakPoint, "xlg">, number>;

export const getBreakpoints = (breakpoints: BreakPoints): Record<BreakPoint, string> => {
  const { xxs, xs, sm, md, lg } = breakpoints;
  return {
    xxs: `(max-width: ${xxs}px)`,
    xs: `(min-width: ${xxs + 1}px) and (max-width: ${xs}px)`,
    sm: `(min-width: ${xs + 1}px) and (max-width: ${sm}px)`,
    md: `(min-width: ${sm + 1}px) and (max-width: ${md}px)`,
    lg: `(min-width: ${md + 1}px) and (max-width: ${lg}px)`,
    xlg: `(min-width: ${lg + 1}px)`,
  };
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

const getColumnSizeCSS = (column: GridSpan): string => {
  // Calculate the base width for each column.
  return `calc(
    (100% - 11 * var(--gap, 0px)) * ${column} / 12 + (${column} - 1) * var(--gap, 0px)
  )`;
};

export const generateColumnBreakpoints = (breakpoints: BreakPoints) => {
  // for every breakpoint, generate the css for each column, it should be a string like this:
  return Object.entries(breakpoints).reduce((acc, [breakpoint]) => {
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
