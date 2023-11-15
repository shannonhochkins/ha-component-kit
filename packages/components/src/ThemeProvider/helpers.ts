import { isObject, isNumber, kebabCase } from "lodash";
import { NAMESPACE } from "./constants";


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

