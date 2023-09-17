import { useState } from "react";
import { css, Global } from "@emotion/react";
import styled from "@emotion/styled";
import { merge } from "lodash";
import { theme as defaultTheme } from "./theme";
import type { ThemeParams } from "./theme";
import { convertToCssVars } from "./helpers";
import { fallback, FabCard, Row, Column } from "@components";
import { rgbToHsl, hex2rgb } from '@hakit/core';
import { ErrorBoundary } from "react-error-boundary";
import { RangeSlider } from '../Cards/MediaPlayerCard/RangeSlider';

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export interface ThemeProviderProps<T extends object> {
  primaryColor?: string;
  contrastThreshold?: string;
  darkMode?: boolean;
  includeDarkLightToggle?: boolean;
  darkLightToggleStyles?: React.CSSProperties;
  theme?: DeepPartial<ThemeParams> & T;
}

const DarkLightToggle = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  background-color: var(--ha-50-shade);
  // TODO - revert this to 0
  z-index: 100;
`;

const variantsLight = ['50', '100', '200', '300', '400'];
const variantsDark = ['600', '700', '800', '900'];
const variantsAccent = ['A100', 'A200', 'A400', 'A700'];
const DEFAULT_START_LIGHT = 3;
const DEFAULT_START_DARK = 97;

const backgroundDiff = 60 / (variantsLight.length + 1 + variantsDark.length + variantsAccent.length);

// Function to generate light and dark variants
const generateVariantVars = (
  variants: string[],
  type: 'Light' | 'Dark',
  tint: number,
  darkMode: boolean,
): string => {
  return variants
    .map((variant, i) => {
      const isLight = type === 'Light';
      const saturation = isLight
        ? `calc(((var(--ha-s) - var(--mtc-light-s)) * var(--mtc-s-${variant}) + var(--mtc-light-s)) * 1%)`
        : `calc(((1 - var(--mtc-s-${variant})) * 100 + var(--mtc-s-${variant}) * var(--ha-s)) * 1%)`;
      const lightness = isLight
        ? `calc(((var(--ha-l) - var(--mtc-light-l)) * var(--mtc-l-${variant}) + var(--mtc-light-l)) * 1%)`
        : `calc(((1 - var(--mtc-l-${variant})) * var(--ha-l) * var(--ha-l) / 100 + var(--mtc-l-${variant}) * var(--ha-l)) * 1%)`;
      const contrast = isLight
        ? `hsl(0, 0%, calc(((((1 - var(--mtc-l-${variant})) * 100 + var(--mtc-l-${variant}) * var(--ha-l)) * 1%) - var(--ha-contrast-threshold, 50%)) * (-100)))`
        : `hsl(0, 0%, calc(((((1 - var(--mtc-l-${variant})) * var(--ha-l) * var(--ha-l) / 100 + var(--mtc-l-${variant}) * var(--ha-l)) * 1%) - var(--ha-contrast-threshold, 50%)) * (-100)))`

      const baseLightness = darkMode ? DEFAULT_START_LIGHT : DEFAULT_START_DARK;
      const indexOffset = !isLight ? variantsLight.length + 1 : 0;
      const offsetBackground = darkMode ? baseLightness + (backgroundDiff * (i + indexOffset)) : baseLightness - (backgroundDiff * (i + indexOffset));

      return `
        --ha-${variant}-h: var(--ha-h);
        --ha-${variant}-s: ${saturation};
        --ha-${variant}-l: ${lightness};
        --ha-${variant}: hsl(var(--ha-${variant}-h), var(--ha-${variant}-s), var(--ha-${variant}-l));
        --ha-${variant}-contrast: ${contrast};
        --ha-${variant}-shade: hsl(var(--ha-h), calc(var(--ha-${variant}-s) * ${tint}), ${offsetBackground}%);
        --ha-${variant}-shade-contrast: hsl(var(--ha-h), calc(var(--ha-${variant}-s) * ${tint}), calc(((100% - ${offsetBackground}%) + ${indexOffset} * 10%)));
      `;
    })
    .join('');
};

// Function to generate accent variants
const generateAccentVars = (variants: string[], tint: number, darkMode: boolean): string => {
  return variants
    .map((variant, i) => {
      const indexOffset = variantsLight.length + 1 + variantsDark.length;
      const baseLightness = darkMode ? DEFAULT_START_LIGHT : DEFAULT_START_DARK;
      const offsetBackground = darkMode ? baseLightness + (backgroundDiff * (indexOffset + i)) : baseLightness - (backgroundDiff * (indexOffset + i));

      return `
        --ha-${variant}-h: calc(var(--ha-h) * var(--mtc-h-${variant}));
        --ha-${variant}-s: calc(var(--mtc-s-${variant}) * 100%);
        --ha-${variant}-l: calc(var(--mtc-l-${variant}) * 100%);
        --ha-${variant}: hsl(var(--ha-${variant}-h), var(--ha-${variant}-s), var(--ha-${variant}-l));
        --ha-${variant}-shade: hsl(var(--ha-h), calc(var(--ha-${variant}-s) * ${tint}), ${offsetBackground}%);
        --ha-${variant}-shade-contrast: hsl(var(--ha-${variant}-s), calc(var(--ha-${variant}-s) * ${tint}), calc(((100% - ${offsetBackground}%))));
      `;
    })
    .join('');
};

// Main function to generate all variables
const generateAllVars = (tint: number, darkMode: boolean): string => {
  const lightVars = generateVariantVars(variantsLight, 'Light', tint, darkMode);
  const darkVars = generateVariantVars(variantsDark, 'Dark', tint, darkMode);
  const accentVars = generateAccentVars(variantsAccent, tint, darkMode);
  const baseLightness = darkMode ? DEFAULT_START_LIGHT : DEFAULT_START_DARK;
  const offsetBackground = darkMode ? baseLightness + (backgroundDiff * 5) : baseLightness - (backgroundDiff * 5);

  return `
    ${lightVars}
    --ha-500-h: var(--ha-h);
    --ha-500-s: calc(var(--ha-s) * 1%);
    --ha-500-l: calc(var(--ha-l) * 1%);
    --ha-500: var(--ha);
    --ha-500-contrast: hsl(0, 0%, calc(((var(--ha-l) * 1%) - var(--ha-contrast-threshold, 50%)) * (-100)));
    --ha-500-shade: hsl(var(--ha-h), calc(var(--ha-500-s) * ${tint}), ${offsetBackground}%);
    --ha-500-shade-contrast: hsl(var(--ha-h), calc(var(--ha-500-s) * ${tint}), calc(((100% - ${offsetBackground}%))));
    ${darkVars}
    ${accentVars}
  `;
};



function _ThemeProvider<T extends object>({
  theme,
  darkMode = true,
  primaryColor = '#558aba',
  includeDarkLightToggle = true,
  darkLightToggleStyles,
  contrastThreshold = '65%',
}: ThemeProviderProps<T>): JSX.Element {
  const [r, g, b] = hex2rgb(primaryColor);
  const [h, s, l] = rgbToHsl(r, g, b);
  const [hue, setHue] = useState(h);
  const [light, setLight] = useState(l);
  const [tint, setTint] = useState(1);
  const [sat, setSat] = useState(s);
  const [dark, setDark] = useState(darkMode);
  const colorScheme = dark ? 'dark' : 'light';
  return (
    <>
      <Global
        styles={css`
          :root {
            ${convertToCssVars(merge(defaultTheme, theme))}
            /* 0 for light theme, 1 for dark theme */
            --is-dark-theme: ${dark ? '1' : '0'};
            color-scheme: ${colorScheme};
            --ha-ripple-size: 50;
            --ha-ripple-duration: 0.5s;
            --ha-easing: cubic-bezier(0.25, 0.46, 0.45, 0.94);
            --ha-transition-duration: 0.25s;
            --ha-room-card-expanded-offset: 0;
            --ha-background-opaque: ${dark ? 'hsla(0, 0%, 0%, 0.5)' : 'hsla(0, 0%, 100%, 0.5)'};
          }
          
          :root {
            --ha-h: ${hue};
            --ha-s: ${sat};
            --ha-l: ${light};
            --ha-contrast-threshold: ${contrastThreshold};
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

            ${generateAllVars(tint, dark)}
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
            background-color: var(--ha-100-shade);
            font-family: var(--ha-font-family);
            font-size: var(--ha-font-size);
            color: var(--ha-100-shade-contrast);
            overflow-x: hidden;
            overflow-y: var(--ha-hide-body-overflow-y);
          }
        `}
      />
      {includeDarkLightToggle && <DarkLightToggle style={{
        ...darkLightToggleStyles ?? {}
      }} ><Column>
          Tint
          <RangeSlider min={0} max={1} step={0.05} value={tint} onChange={(value) => {
            setTint(value);
          }} />
          Hue
          <RangeSlider min={0} max={360} value={hue} onChange={(value) => {
            setHue(value);
          }} />
          Sat
          <RangeSlider min={0} max={100} value={sat} onChange={(value) => {
            setSat(value);
          }} />
          Light
          <RangeSlider min={0} max={100} value={light} onChange={(value) => {
            setLight(value);
          }} />
        </Column>
        {/* <Row wrap="nowrap" gap="0.5rem">
          {[
            '50',
            '100',
            '200',
            '300',
            '400',
            '500',
            '600',
            '700',
            '800',
            '900',
            'A100',
            'A200',
            'A400',
            'A700',
          ].map((color) => {
            return <Column gap="0.5rem" key={color}>
                <Row title={`var(--ha-${color})`} style={{
                  fontSize: '0.8rem',
                  width: '3rem',
                  height: '3rem',
                  color: `var(--ha-${color}-contrast)`,
                  backgroundColor: `var(--ha-${color})`,
                }}>TEXT</Row>
                <Row title={`var(--ha-${color}-shade)`} style={{
                  fontSize: '0.8rem',
                  width: '3rem',
                  height: '3rem',
                  color: `var(--ha-${color}-shade-contrast)`,
                  backgroundColor: `var(--ha-${color}-shade)`,
                }}>SHADE</Row>
            </Column>
          })}
        </Row> */}
        <FabCard icon={!dark ? 'ph:sun' : 'ph:moon'} onClick={() => {
          setDark(!dark);
        }} />
      </DarkLightToggle>}
    </>
  );
}
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
