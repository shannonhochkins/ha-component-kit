export type StandardResponsiveTypes =
  | "mobile"
  | "tablet"
  | "smallScreen"
  | "mediumScreen"
  | "desktop"
  | "largeDesktop";

export const STANDARD_BREAKPOINTS: {
  [key in StandardResponsiveTypes]: string;
} = {
  mobile: "(max-width: 660px)",
  tablet: "(min-width: 661px) and (max-width: 840px)",
  smallScreen: "(min-width: 841px) and (max-width: 1024px)",
  mediumScreen: "(min-width: 1025px) and (max-width: 1400px)",
  desktop: "(min-width: 1401px) and (max-width: 1600px)",
  largeDesktop: "(min-width: 1601px)",
};
