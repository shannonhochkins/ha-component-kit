import { create } from "zustand";
import { DEFAULT_THEME_OPTIONS } from "./constants";

export type ThemeStore = {
  theme: {
    /** the tint factor to apply to the shade colors @default 0.8 */
    tint?: number;
    /** the color hue shift value @default 220 */
    hue?: number;
    /** the color saturation value @default 60 */
    saturation?: number;
    /** the color lightness value @default 54 */
    lightness?: number;
    /** the contrast threshold for text @default 65 */
    contrastThreshold?: number;
    /** dark mode or light mode @default true */
    darkMode?: boolean;
  };
  /** Will merge input theme values with the default values, undefined values passed through the setTheme function will be ignored */
  setTheme: (partialTheme: ThemeStore["theme"]) => void;
};

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: {
    hue: DEFAULT_THEME_OPTIONS.hue,
    lightness: DEFAULT_THEME_OPTIONS.lightness,
    tint: DEFAULT_THEME_OPTIONS.tint,
    saturation: DEFAULT_THEME_OPTIONS.saturation,
    darkMode: DEFAULT_THEME_OPTIONS.darkMode,
    contrastThreshold: DEFAULT_THEME_OPTIONS.contrastThreshold,
  },
  setTheme: (partialTheme) => {
    set((state) => ({
      theme: {
        ...state.theme,
        // Only spread properties that are not undefined
        ...Object.fromEntries(Object.entries(partialTheme).filter(([, value]) => value !== undefined)),
      },
    }));
  },
}));
