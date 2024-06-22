import { useState, useCallback, useEffect, memo } from "react";
import { css, Global } from "@emotion/react";
import { CSSInterpolation } from "@emotion/serialize";
import styled from "@emotion/styled";
import { merge } from "lodash";
import { theme as defaultTheme } from "./theme";
import type { ThemeParams } from "./theme";
import { convertToCssVars } from "./helpers";
import { useBreakpoint, fallback, FabCard, Modal, type BreakPoints } from "@components";
import { ErrorBoundary } from "react-error-boundary";
import { motion } from "framer-motion";
import { LIGHT, DARK, ACCENT, DEFAULT_START_LIGHT, DEFAULT_START_DARK, DIFF, DEFAULT_THEME_OPTIONS } from "./constants";
import { localize, useHass, type SupportedComponentOverrides } from "@hakit/core";
import { ThemeControls } from "./ThemeControls";
import type { ThemeControlsProps } from "./ThemeControls";
import { generateColumnBreakpoints } from "./breakpoints";
import createCache, { type Options } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import weakMemoize from "@emotion/weak-memoize";

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

// https://github.com/emotion-js/emotion/issues/760#issuecomment-404353706
const memoizedCreateCacheWithContainer = weakMemoize((options: Options) => {
  return createCache(options);
});

function EmotionProvider({ children, options }: { children: React.ReactNode; options: Options }) {
  return <CacheProvider value={memoizedCreateCacheWithContainer(options)}>{children}</CacheProvider>;
}

export interface ThemeProviderProps<T extends object> {
  /** the tint factor to apply to the shade colors */
  tint?: number;
  /** the color hue shift value */
  hue?: number;
  /** the color saturation value */
  saturation?: number;
  /** the color lightness value */
  lightness?: number;
  /** the contrast threshold for text @default 65 */
  contrastThreshold?: number;
  /** dark mode or light mode */
  darkMode?: boolean;
  /** the theme controls button can be automatically included at the top right of the page @default false */
  includeThemeControls?: boolean;
  /** the styles for the theme controls button if you want to reposition it */
  themeControlStyles?: React.CSSProperties;
  /** the theme properties */
  theme?: DeepPartial<ThemeParams> & T;
  /** any global style overrides */
  globalStyles?: CSSInterpolation;
  /** options to pass to the emotion cache provider */
  emotionCache?: Options;
  /** default breakpoint media query overrides @default {
   * xxs: 600,
   * xs: 900,
   * sm: 1200,
   * md: 1536,
   * lg: 1700,
   *
   */
  breakpoints?: BreakPoints;
  /** styles to provide for a specific component type to override every instance */
  globalComponentStyles?: Partial<Record<SupportedComponentOverrides, CSSInterpolation>>;
  /** children to render within the ThemeProvider */
  children?: React.ReactNode;
}

const ThemeControlsBox = styled(motion.div)`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1;
`;

const INFO_COLORS = {
  errorColor: [219, 68, 55],
  warningColor: [255, 166, 0],
  successColor: [67, 160, 71],
  infoColor: [3, 155, 229],
};

const alphas = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];

const getLuminance = (rgb: number[], alpha: number): number => {
  const [r, g, b] = rgb.map((value) => {
    const channel = (value / 255) * alpha;
    return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const getContrastColor = (rgb: number[], alpha: number): string => {
  const luminance = getLuminance(rgb, alpha); // Scale luminance to 0-255 range
  return luminance > 0.3 ? "rgba(0, 0, 0, 1)" : "rgba(255, 255, 255, 1)";
};

const generateInfoColors = (): string => {
  return Object.entries(INFO_COLORS)
    .map(([name, rgb]) =>
      alphas
        .map((alpha) => {
          const suffix = alpha < 1 ? `-a${alpha * 10}` : "";
          const varName = `--ha-${name
            .replace(/([A-Z])/g, "-$1")
            .toLowerCase()
            .replace("-color", "")}-color${suffix}`;
          const contrastVarName = `${varName}-contrast`;
          const rgba = `rgba(${rgb.join(", ")}, ${alpha})`;
          const contrastColor = getContrastColor(rgb, alpha);
          return `${varName}: ${rgba};\n${contrastVarName}: ${contrastColor};`;
        })
        .join("\n"),
    )
    .join("\n");
};

// Function to generate light and dark variants
const generateVariantVars = (variants: string[], type: "Light" | "Dark", tint: number, darkMode: boolean): string => {
  return variants
    .map((variant, i) => {
      const isLight = type === "Light";
      const saturation = isLight
        ? `calc(((var(--ha-s) - var(--mtc-light-s)) * var(--mtc-s-${variant}) + var(--mtc-light-s)) * 1%)`
        : `calc(((1 - var(--mtc-s-${variant})) * 100 + var(--mtc-s-${variant}) * var(--ha-s)) * 1%)`;
      const lightness = isLight
        ? `calc(((var(--ha-l) - var(--mtc-light-l)) * var(--mtc-l-${variant}) + var(--mtc-light-l)) * 1%)`
        : `calc(((1 - var(--mtc-l-${variant})) * var(--ha-l) * var(--ha-l) / 100 + var(--mtc-l-${variant}) * var(--ha-l)) * 1%)`;
      const contrast = (alpha: number) =>
        isLight
          ? `hsla(0, 0%, calc(((((1 - var(--mtc-l-${variant})) * 100 + var(--mtc-l-${variant}) * var(--ha-l)) * 1%) - var(--ha-contrast-threshold, 50%)) * (-100)), ${alpha})`
          : `hsla(0, 0%, calc(((((1 - var(--mtc-l-${variant})) * var(--ha-l) * var(--ha-l) / 100 + var(--mtc-l-${variant}) * var(--ha-l)) * 1%) - var(--ha-contrast-threshold, 50%)) * (-100)), ${alpha})`;

      const baseLightness = darkMode ? DEFAULT_START_LIGHT : DEFAULT_START_DARK;
      const indexOffset = !isLight ? LIGHT.length + 1 : 0;
      const offsetBackground = darkMode ? baseLightness + DIFF * (i + indexOffset) : baseLightness - DIFF * (i + indexOffset);

      const baseVars = `
      --ha-${variant}-h: var(--ha-h);
      --ha-${variant}-s: ${saturation};
      --ha-${variant}-l: ${lightness};
      `;
      const varStyles = alphas
        .map((alpha) => {
          const suffix = alpha < 1 ? `-a${alpha * 10}` : "";
          return `
        --ha-${variant}${suffix}: hsla(var(--ha-${variant}-h), var(--ha-${variant}-s), var(--ha-${variant}-l), ${alpha});
        --ha-${variant}${suffix}-contrast: ${contrast(alpha)};
        --ha-S${variant}${suffix}: hsla(var(--ha-h), calc(var(--ha-${variant}-s) * ${tint}), ${offsetBackground}%, ${alpha});
        --ha-S${variant}${suffix}-contrast: hsla(var(--ha-h), calc(var(--ha-${variant}-s) * ${tint}), calc(((100% - ${offsetBackground}%) + ${indexOffset} * 10%)), ${alpha});`;
        })
        .join("");

      return `
        ${baseVars}
        ${varStyles}
        `;
    })
    .join("");
};

// Function to generate accent variants
const generateAccentVars = (variants: string[], tint: number, darkMode: boolean): string => {
  return variants
    .map((variant, i) => {
      const indexOffset = LIGHT.length + 1 + DARK.length;
      const baseLightness = darkMode ? DEFAULT_START_LIGHT : DEFAULT_START_DARK;
      const offsetBackground = darkMode ? baseLightness + DIFF * (indexOffset + i) : baseLightness - DIFF * (indexOffset + i);

      const baseVars = `
        --ha-${variant}-h: calc(var(--ha-h) * var(--mtc-h-${variant}));
        --ha-${variant}-s: calc(var(--mtc-s-${variant}) * 100%);
        --ha-${variant}-l: calc(var(--mtc-l-${variant}) * 100%);
      `;
      const varStyles = alphas
        .map((alpha) => {
          const suffix = alpha < 1 ? `-a${alpha * 10}` : "";
          return `
          --ha-${variant}${suffix}: hsla(var(--ha-${variant}-h), var(--ha-${variant}-s), var(--ha-${variant}-l), ${alpha});
          --ha-S${variant}${suffix}: hsla(var(--ha-h), calc(var(--ha-${variant}-s) * ${tint}), ${offsetBackground}%, ${alpha});
          --ha-S${variant}${suffix}-contrast: hsla(var(--ha-${variant}-s), calc(var(--ha-${variant}-s) * ${tint}), calc(((100% - ${offsetBackground}%))), ${alpha});`;
        })
        .join("");

      return `
        ${baseVars}
        ${varStyles}
        `;
    })
    .join("");
};

// Main function to generate all variables
const generateAllVars = (tint: number, darkMode: boolean): string => {
  const lightVars = generateVariantVars(LIGHT, "Light", tint, darkMode);
  const darkVars = generateVariantVars(DARK, "Dark", tint, darkMode);
  const accentVars = generateAccentVars(ACCENT, tint, darkMode);
  const baseLightness = darkMode ? DEFAULT_START_LIGHT : DEFAULT_START_DARK;
  const offsetBackground = darkMode ? baseLightness + DIFF * 5 : baseLightness - DIFF * 5;

  const varStyles = alphas
    .map((alpha) => {
      const suffix = alpha < 1 ? `-a${alpha * 10}` : "";
      return `
      --ha-500${suffix}-contrast: hsla(0, 0%, calc(((var(--ha-l) * 1%) - var(--ha-contrast-threshold, 50%)) * (-100)), ${alpha});
      --ha-S500${suffix}: hsla(var(--ha-h), calc(var(--ha-500-s) * ${tint}), ${offsetBackground}%, ${alpha});
      --ha-S500${suffix}-contrast: hsla(var(--ha-h), calc(var(--ha-500-s) * ${tint}), calc(((100% - ${offsetBackground}%))), ${alpha});
    `;
    })
    .join("");

  return `
    ${generateInfoColors()}
    ${lightVars}
    --ha-500-h: var(--ha-h);
    --ha-500-s: calc(var(--ha-s) * 1%);
    --ha-500-l: calc(var(--ha-l) * 1%);
    --ha-500: var(--ha);
    ${varStyles}
    ${darkVars}
    ${accentVars}
  `;
};

const _ThemeProvider = memo(function _ThemeProvider<T extends object>({
  theme,
  darkMode = DEFAULT_THEME_OPTIONS.darkMode,
  tint: t = DEFAULT_THEME_OPTIONS.tint,
  hue: h = DEFAULT_THEME_OPTIONS.hue,
  saturation: s = DEFAULT_THEME_OPTIONS.saturation,
  lightness: l = DEFAULT_THEME_OPTIONS.lightness,
  contrastThreshold: c = DEFAULT_THEME_OPTIONS.contrastThreshold,
  breakpoints = DEFAULT_THEME_OPTIONS.breakpoints,
  includeThemeControls = false,
  themeControlStyles,
  globalStyles,
  globalComponentStyles,
  emotionCache,
  children,
}: ThemeProviderProps<T>): React.ReactNode {
  const { useStore } = useHass();
  const setBreakpoints = useStore((store) => store.setBreakpoints);
  const setGlobalComponentStyles = useStore((store) => store.setGlobalComponentStyles);
  const _breakpoints = useStore((store) => store.breakpoints);
  const device = useBreakpoint();

  useEffect(() => {
    if (globalComponentStyles) {
      setGlobalComponentStyles(globalComponentStyles);
    }
  }, [setGlobalComponentStyles, globalComponentStyles]);

  const getTheme = useCallback(() => {
    return {
      hue: h,
      lightness: l,
      tint: t,
      saturation: s,
      darkMode: darkMode,
      contrastThreshold: c,
    } satisfies Omit<ThemeControlsProps, "onChange">;
  }, [c, darkMode, h, l, s, t]);
  const defaults = getTheme();
  const [_theme, setTheme] = useState<Omit<ThemeControlsProps, "onChange">>(defaults);
  const [open, setOpen] = useState(false);
  const colorScheme = _theme.darkMode ? "dark" : "light";

  useEffect(() => {
    setBreakpoints(breakpoints);
  }, [setBreakpoints, breakpoints]);

  useEffect(() => {
    Object.entries(device).forEach(([breakpointKey, active]) => {
      const className = `bp-${breakpointKey}`;
      if (active) {
        document.body.classList.add(className);
      } else {
        document.body.classList.remove(className);
      }
    });
  }, [device]);

  return (
    <EmotionProvider
      options={
        emotionCache ?? {
          key: "hakit",
          container: document.head,
        }
      }
    >
      <Global
        styles={css`
          :root {
            ${convertToCssVars(merge(defaultTheme, theme))}
            --is-dark-theme: ${_theme.darkMode ? "1" : "0"};
            color-scheme: ${colorScheme};
            --ha-easing: cubic-bezier(0.25, 0.46, 0.45, 0.94);
            --ha-transition-duration: 0.25s;
            --ha-area-card-expanded-offset: 0;
            --ha-background-opaque: ${_theme.darkMode
              ? `hsla(var(--ha-h), calc(var(--ha-s) * 1%), 10%, 0.9)`
              : `hsla(var(--ha-h), calc(var(--ha-s) * 1%), 20%, 0.7)`};
          }

          :root {
            --ha-h: ${_theme.hue};
            --ha-s: ${_theme.saturation};
            --ha-l: ${_theme.lightness};
            --ha-contrast-threshold: ${_theme.contrastThreshold}%;
            --ha-so: calc(var(--ha-s) * 1%);
            --ha: hsla(var(--ha-h), calc(var(--ha-s) * 1%), calc(var(--ha-l) * 1%), 100%);
            --mtc-h-A100: 1;
            --mtc-h-A200: 1;
            --mtc-h-A400: 1;
            --mtc-h-A700: 1.01;
            --mtc-s-50: 0.91;
            --mtc-s-100: 0.98;
            --mtc-s-200: 0.96;
            --mtc-s-300: 0.95;
            --mtc-s-400: 0.96;
            --mtc-s-600: 1;
            --mtc-s-700: 0.99;
            --mtc-s-800: 0.89;
            --mtc-s-900: 0.86;
            --mtc-s-A100: 0.89;
            --mtc-s-A200: 0.98;
            --mtc-s-A400: 0.97;
            --mtc-s-A700: 0.95;
            --mtc-l-50: 0.12;
            --mtc-l-100: 0.3;
            --mtc-l-200: 0.5;
            --mtc-l-300: 0.7;
            --mtc-l-400: 0.86;
            --mtc-l-600: 0.87;
            --mtc-l-700: 0.66;
            --mtc-l-800: 0.45;
            --mtc-l-900: 0.16;
            --mtc-l-A100: 0.76;
            --mtc-l-A200: 0.64;
            --mtc-l-A400: 0.49;
            --mtc-l-A700: 0.44;
            --mtc-light-h: 0;
            --mtc-light-s: 0;
            --mtc-light-l: 100;

            ${generateAllVars(_theme.tint ?? DEFAULT_THEME_OPTIONS.tint, _theme.darkMode ?? DEFAULT_THEME_OPTIONS.darkMode)}
          }

          * {
            box-sizing: border-box;
            scrollbar-width: thin;
            scrollbar-color: var(--ha-S500) var(--ha-S200);
            font-family: var(--ha-font-family);
            ::-webkit-scrollbar-corner {
              background: rgba(0, 0, 0, 0.5);
            }

            /* Works on Chrome, Edge, and Safari */
            &::-webkit-scrollbar {
              width: 12px;
              height: 12px;
            }

            &::-webkit-scrollbar-track {
              background: var(--ha-S200); // track background color
            }

            &::-webkit-scrollbar-thumb {
              background-color: var(--ha-S500);
              border-radius: 20px;
              border: 3px solid var(--ha-S200);
            }
          }

          html,
          body {
            height: 100%;
            width: 100%;
            margin: 0;
            padding: 0;
          }
          body {
            -webkit-font-smoothing: antialiased;
            -webkit-tap-highlight-color: transparent;
            -webkit-overflow-scrolling: touch;
            -moz-osx-font-smoothing: grayscale;
            scroll-behavior: smooth;
            background-color: var(--ha-S100);
            font-family: var(--ha-font-family);
            font-size: var(--ha-font-size);
            color: var(--ha-S100-contrast);
            overflow-x: hidden;
            overflow-y: var(--ha-hide-body-overflow-y);
          }
          ${generateColumnBreakpoints(_breakpoints)}
          ${globalStyles ?? ""}
        `}
      />
      {includeThemeControls && (
        <ThemeControlsBox
          style={{
            ...(themeControlStyles ?? {}),
          }}
        >
          <FabCard
            onClick={() => setOpen(true)}
            tooltipPlacement="left"
            title={localize("theme")}
            layoutId="theme-controls"
            icon="mdi:color"
          />
        </ThemeControlsBox>
      )}
      {includeThemeControls && (
        <Modal
          description="This interface showcases how the colors will behave and provides easy to access css variables"
          id="theme-controls"
          open={open}
          title={localize("theme")}
          onClose={() => {
            setOpen(false);
          }}
        >
          <ThemeControls
            {...{
              ..._theme,
            }}
            onChange={(theme) => {
              setTheme(theme);
            }}
          />
        </Modal>
      )}
      {children && children}
    </EmotionProvider>
  );
});
/**
 * A simple way of creating global styles and providing re-usable css variables to re-use across your application
 *
 * There's very little css shipped with this ThemeProvider, the main purpose of this provider is to create the css variables used for all components across @hakit/components, however it does ship with some base css to the body, html and scrollbars.
 * */
export function ThemeProvider<T extends object>(props: ThemeProviderProps<T>) {
  return (
    <ErrorBoundary {...fallback({ prefix: "ThemeProvider" })}>
      <_ThemeProvider {...props} />
    </ErrorBoundary>
  );
}
