import { css, Global } from "@emotion/react";
import { merge } from "lodash";
import { theme as defaultTheme } from "./theme";
import type { ThemeParams } from "./theme";
import { convertToCssVars } from "./helpers";
import { fallback } from "@components";
import { ErrorBoundary } from "react-error-boundary";

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export interface ThemeProviderProps<T extends object> {
  theme?: DeepPartial<ThemeParams> & T;
}

function _ThemeProvider<T extends object>({
  theme,
}: ThemeProviderProps<T>): JSX.Element {
  return (
    <>
      <Global
        styles={css`
          :root {
            ${convertToCssVars(merge(defaultTheme, theme))}
            --ha-ripple-size: 50;
            --ha-ripple-duration: 0.5s;
            --ha-easing: cubic-bezier(0.25, 0.46, 0.45, 0.94);
            --ha-transition-duration: 0.25s;
            --ha-room-card-expanded-offset: 0;
            color-scheme: dark;
          }
          ::-webkit-scrollbar {
            width: 8px;
            height: 3px;
          }
          ::-webkit-scrollbar-button {
            background-color: var(--ha-scrollbar-button);
          }
          ::-webkit-scrollbar-track {
            background-color: var(--ha-scrollbar-track);
          }
          ::-webkit-scrollbar-track-piece {
            background-color: var(--ha-scrollbar-track-piece);
          }
          ::-webkit-scrollbar-thumb {
            height: 50px;
            background-color: var(--ha-scrollbar-thumb);
            border-radius: 3px;
          }
          ::-webkit-scrollbar-corner {
            background-color: var(--ha-scrollbar-corner);
          }
          ::-webkit-resizer {
            background-color: var(--ha-scrollbar-resizer);
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
            overflow-x: hidden;
            overflow-y: var(--ha-hide-body-overflow-y);
          }
        `}
      />
    </>
  );
}
/** A simple way of creating global styles and providing re-usable css variables to re-use across your application */
export function ThemeProvider<T extends object>(props: ThemeProviderProps<T>) {
  return (
    <ErrorBoundary {...fallback({ prefix: "ThemeProvider" })}>
      <_ThemeProvider {...props} />
    </ErrorBoundary>
  );
}
