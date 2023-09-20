export type StandardResponsiveTypes =
  | "mobile"
  | "tablet"
  | "smallScreen"
  | "desktop"
  | "extraLarge";

export const STANDARD_BREAKPOINTS: {
  [key in StandardResponsiveTypes]: string;
} = {
  mobile: "(max-width: 480px)",
  tablet: "(min-width: 481px) and (max-width: 768px)",
  smallScreen: "(min-width: 769px) and (max-width: 1024px)",
  desktop: "(min-width: 1025px) and (max-width: 1200px)",
  extraLarge: "(min-width: 1201px)",
};
