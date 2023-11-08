import { isObject, isNumber, kebabCase } from "lodash";
import { LIGHT, DARK, ACCENT, DEFAULT_START_LIGHT, DEFAULT_START_DARK, DIFF, NAMESPACE } from "./constants";


export function convertToCssVars(obj: object, prefix = "") {
  return Object.entries(obj)
    .reduce((acc, [key, value]): string => {
      const name = `${prefix ? `${prefix}-` : ""}${kebabCase(key)}`;
      return `
      ${acc}
      ${isObject(value) ? convertToCssVars(value, name) : `--${NAMESPACE}-${name}: ${isNumber(value) ? `${value}` : value};`}
    `;
    }, "")
    .replace(/^\s*[\r\n]/gm, "");
}

type AvailableColors = 

export function getThemeColor() {


}


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
      const contrast = isLight
        ? `hsl(0, 0%, calc(((((1 - var(--mtc-l-${variant})) * 100 + var(--mtc-l-${variant}) * var(--ha-l)) * 1%) - var(--ha-contrast-threshold, 50%)) * (-100)))`
        : `hsl(0, 0%, calc(((((1 - var(--mtc-l-${variant})) * var(--ha-l) * var(--ha-l) / 100 + var(--mtc-l-${variant}) * var(--ha-l)) * 1%) - var(--ha-contrast-threshold, 50%)) * (-100)))`;

      const baseLightness = darkMode ? DEFAULT_START_LIGHT : DEFAULT_START_DARK;
      const indexOffset = !isLight ? LIGHT.length + 1 : 0;
      const offsetBackground = darkMode ? baseLightness + DIFF * (i + indexOffset) : baseLightness - DIFF * (i + indexOffset);

      return `
        --ha-${variant}-h: var(--ha-h);
        --ha-${variant}-s: ${saturation};
        --ha-${variant}-l: ${lightness};
        --ha-${variant}: hsl(var(--ha-${variant}-h), var(--ha-${variant}-s), var(--ha-${variant}-l));
        --ha-${variant}-contrast: ${contrast};
        --ha-S${variant}: hsl(var(--ha-h), calc(var(--ha-${variant}-s) * ${tint}), ${offsetBackground}%);
        --ha-S${variant}-contrast: hsl(var(--ha-h), calc(var(--ha-${variant}-s) * ${tint}), calc(((100% - ${offsetBackground}%) + ${indexOffset} * 10%)));
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

      return `
        --ha-${variant}-h: calc(var(--ha-h) * var(--mtc-h-${variant}));
        --ha-${variant}-s: calc(var(--mtc-s-${variant}) * 100%);
        --ha-${variant}-l: calc(var(--mtc-l-${variant}) * 100%);
        --ha-${variant}: hsl(var(--ha-${variant}-h), var(--ha-${variant}-s), var(--ha-${variant}-l));
        --ha-S${variant}: hsl(var(--ha-h), calc(var(--ha-${variant}-s) * ${tint}), ${offsetBackground}%);
        --ha-S${variant}-contrast: hsl(var(--ha-${variant}-s), calc(var(--ha-${variant}-s) * ${tint}), calc(((100% - ${offsetBackground}%))));
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

  return `
    ${lightVars}
    --ha-500-h: var(--ha-h);
    --ha-500-s: calc(var(--ha-s) * 1%);
    --ha-500-l: calc(var(--ha-l) * 1%);
    --ha-500: var(--ha);
    --ha-500-contrast: hsl(0, 0%, calc(((var(--ha-l) * 1%) - var(--ha-contrast-threshold, 50%)) * (-100)));
    --ha-S500: hsl(var(--ha-h), calc(var(--ha-500-s) * ${tint}), ${offsetBackground}%);
    --ha-S500-contrast: hsl(var(--ha-h), calc(var(--ha-500-s) * ${tint}), calc(((100% - ${offsetBackground}%))));
    ${darkVars}
    ${accentVars}
  `;
};