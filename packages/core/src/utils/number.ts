/**
 * Generates default options for Intl.NumberFormat
 * @param num The number to be formatted
 * @param options The Intl.NumberFormatOptions that should be included in the returned options
 */
export const getDefaultFormatOptions = (num: string | number, options?: Intl.NumberFormatOptions): Intl.NumberFormatOptions => {
  const defaultOptions: Intl.NumberFormatOptions = {
    maximumFractionDigits: 2,
    ...options,
  };

  if (typeof num !== "string") {
    return defaultOptions;
  }

  // Keep decimal trailing zeros if they are present in a string numeric value
  if (!options || (options.minimumFractionDigits === undefined && options.maximumFractionDigits === undefined)) {
    const digits = num.indexOf(".") > -1 ? num.split(".")[1].length : 0;
    defaultOptions.minimumFractionDigits = digits;
    defaultOptions.maximumFractionDigits = digits;
  }

  return defaultOptions;
};

export const round = (value: number, precision = 2): number => Math.round(value * 10 ** precision) / 10 ** precision;

/**
 * Formats a number based on the user's preference with thousands separator(s) and decimal character for better legibility.
 *
 * @param num The number to format
 * @param localeOptions The user-selected language and formatting, from `hass.locale`
 * @param options Intl.NumberFormatOptions to use
 */
export const formatNumber = (num: string | number, options?: Intl.NumberFormatOptions): string => {
  // Polyfill for Number.isNaN, which is more reliable than the global isNaN()
  Number.isNaN =
    Number.isNaN ||
    function isNaN(input): boolean {
      return typeof input === "number" && isNaN(input);
    };

  if (!Number.isNaN(Number(num)) && num !== "") {
    // If NumberFormat is none, use en-US format without grouping.
    return new Intl.NumberFormat(
      "en-US",
      getDefaultFormatOptions(num, {
        ...options,
        useGrouping: false,
      }),
    ).format(Number(num));
  }

  if (typeof num === "string") {
    return num;
  }
  return `${round(num, options?.maximumFractionDigits).toString()}${options?.style === "currency" ? ` ${options.currency}` : ""}`;
};
