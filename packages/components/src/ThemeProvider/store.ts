import { create } from "zustand";
import { DEFAULT_THEME_OPTIONS, DEFAULT_BREAKPOINTS } from "./constants";
import { BreakPoints, BreakPointsWithXlg } from "@components";

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
  /** getter for breakpoints, if using @hakit/components, the breakpoints are stored here to retrieve in different locations */
  breakpoints: BreakPointsWithXlg;
  /** setter for breakpoints, intended for internal use only */
  setBreakpoints: (breakpoints: BreakPoints) => void;
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
  breakpoints: DEFAULT_BREAKPOINTS,
  setBreakpoints: (breakpoints) => {
    // there should at least be ONE breakpoint defined, get the largest value from the breakpoints object
    // if the object is empty or no values with numbers, it should throw an error
    if (Object.keys(breakpoints).length === 0) {
      throw new Error("No breakpoints provided");
    }
    const largestValue = Math.max(...Object.values(breakpoints).filter((value) => typeof value === "number"));
    if (largestValue === -Infinity) {
      throw new Error("No valid breakpoints provided");
    }
    set({
      breakpoints: {
        ...breakpoints,
        xlg: largestValue + 1,
      },
    });
  },
}));
