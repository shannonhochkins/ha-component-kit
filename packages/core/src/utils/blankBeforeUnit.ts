import { FrontendLocaleData } from "@hooks";

// Logic based on https://en.wikipedia.org/wiki/Percent_sign#Form_and_spacing
export const blankBeforePercent = (localeOptions: FrontendLocaleData): string => {
  switch (localeOptions.language) {
    case "cs":
    case "de":
    case "fi":
    case "fr":
    case "sk":
    case "sv":
      return " ";
    default:
      return "";
  }
};

export const blankBeforeUnit = (unit: string, localeOptions: FrontendLocaleData | undefined): string => {
  if (unit === "°") {
    return "";
  }
  if (localeOptions && unit === "%") {
    return blankBeforePercent(localeOptions);
  }
  return " ";
};
