import { useEffect } from "react";
import { css, Global } from "@emotion/react";
import { merge } from "lodash";
import { theme as defaultTheme } from "./theme";
import type { ThemeParams } from "./theme";
import { convertToCssVars } from "./helpers";
import { NAMESPACE } from "./constants";

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export interface ThemeProviderProps<T extends object> {
  theme?: DeepPartial<ThemeParams> & T;
}
/** A simple way of creating global styles and providing re-usable css variables to re-use across your application */
export function ThemeProvider<T extends object>({
  theme,
}: ThemeProviderProps<T>): JSX.Element {
  useEffect(() => {
    const updateCursorPosition = (e: MouseEvent) => {
      document.documentElement.style.setProperty(
        `--${NAMESPACE}-cursor-x`,
        `${e.clientX}px`
      );
      document.documentElement.style.setProperty(
        `--${NAMESPACE}-cursor-y`,
        `${e.clientY}px`
      );
    };
    window.addEventListener("mousemove", updateCursorPosition);
    return () => {
      window.removeEventListener("mousemove", updateCursorPosition);
    };
  }, []);
  return (
    <Global
      styles={css`
        :root {
          ${convertToCssVars(merge(defaultTheme, theme))}
          --ha-ripple-size: 50;
          --ha-ripple-duration: 0.5s;
          --ha-easing: cubic-bezier(0.25, 0.46, 0.45, 0.94);
          --ha-transition-duration: 0.25s;
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
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          -webkit-overflow-scrolling: touch;
          -moz-osx-font-smoothing: grayscale;
          scroll-behavior: smooth;
          background-color: var(--ha-background);
          font-family: var(--ha-font-family);
          font-size: var(--ha-font-size);
          color: var(--ha-color);
        }
      `}
    />
  );
}
