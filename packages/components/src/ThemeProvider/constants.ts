export const NAMESPACE = "ha";
export const LIGHT = ["50", "100", "200", "300", "400"];
export const DARK = ["600", "700", "800", "900"];
export const ACCENT = ["A100", "A200", "A400", "A700"];
export const DEFAULT_START_LIGHT = 3;
export const DEFAULT_START_DARK = 97;
// 60% is the default contrast ratio for accessibility
export const DIFF = 60 / (LIGHT.length + 1 + DARK.length + ACCENT.length);

export const DEFAULT_THEME_OPTIONS = {
  darkMode: true,
  tint: 0.8,
  hue: 220,
  saturation: 60,
  lightness: 54,
  contrastThreshold: 65,
  breakpoints: {
    xxs: 600,
    xs: 900,
    sm: 1200,
    md: 1536,
    lg: 1700,
  },
} as const;
