import {
  CustomFormatters,
  DateParts,
  Formatters,
  FormatterMask,
  DatePartName,
  FormatOptions,
  FormatFunction,
  Parser,
  Token,
} from "./types";
import { AmOrPm } from "./shared";
import { Fragment, cloneElement, isValidElement } from "react";

const parsers: Map<string, Parser> = new Map();

const intlFormattersOptions = [
  {
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  },
  {
    month: "long",
    hour: "2-digit",
    hour12: false,
  },
] satisfies Partial<Intl.DateTimeFormatOptions>[];

export function createDateFormatter(customFormatters: CustomFormatters): FormatFunction {
  return function intlFormatDate(date: Date, format: string, options?: FormatOptions): React.ReactNode {
    const tokens = parseDate(date, options);
    const output = formatDate(customFormatters, format, tokens, date);
    return output;
  };
}

const createIntlFormatterWith = (options: FormatOptions): Intl.DateTimeFormat[] =>
  intlFormattersOptions.map(
    (intlFormatterOptions) =>
      new Intl.DateTimeFormat(options.locale, {
        ...intlFormatterOptions,
        timeZone: options.timezone,
      }),
  );

const longTokensTransformer = (token: Token): Token =>
  (token.type !== "literal" ? { type: `l${token.type}`, value: token.value } : token) as Token;

const datePartsReducer = (parts: DateParts, token: Token): DateParts => {
  parts[token.type as DatePartName] = token.value;
  return parts;
};

const tokenize = (intlFormatter: Intl.DateTimeFormat, date: Date): Token[] =>
  intlFormatter.formatToParts(date).filter((token) => token.type !== "literal") as Token[];

const normalize = (parts: DateParts): DateParts => {
  // Chrome <= 71 and Node >= 10 incorrectly case `dayperiod` (#4)
  // dayPeriod will be undefined for 24 hour clocks so fall back to empty string
  parts.dayPeriod =
    parts.dayPeriod ||
    // @ts-expect-error - see note above
    parts.dayperiod ||
    "";
  // @ts-expect-error - see note above
  delete parts.dayperiod;

  // Chrome >= 80 has a bug going over 24h
  parts.lhour = ("0" + (Number(parts.lhour) % 24)).slice(-2);

  return parts;
};

const createParser = (options: FormatOptions): Parser => {
  const [intlFormatter, intlFormatterLong] = createIntlFormatterWith(options);

  return function parseDateImpl(date: Date): DateParts {
    const tokens = tokenize(intlFormatter, date);
    const longTokens = tokenize(intlFormatterLong, date).map(longTokensTransformer);
    const allTokens = [...tokens, ...longTokens];
    const parts = allTokens.reduce(datePartsReducer, {} as DateParts);

    return normalize(parts);
  };
};

function parseDate(date: Date, options: FormatOptions = {}): DateParts {
  const key = `${options.locale}${options.timezone}`;

  let parser = parsers.get(key);
  if (!parser) {
    parser = createParser(options);
    parsers.set(key, parser);
  }

  return parser(date);
}

export function daySuffix(day: number) {
  let suffix = "";
  switch (day) {
    case 1:
    case 21:
    case 31:
      suffix = "st";
      break;
    case 2:
    case 22:
      suffix = "nd";
      break;
    case 3:
    case 23:
      suffix = "rd";
      break;
    default:
      suffix = "th";
  }
  return suffix;
}

const defaultPattern = "[YMDxdAaHhms]+";

const formatters: Formatters = {
  YYYY: (parts) => parts.year,
  YY: (parts) => parts.year.slice(-2),
  MMMM: (parts) => parts.lmonth,
  MMM: (parts) => parts.lmonth.slice(0, 3),
  MM: (parts) => parts.month,
  DD: (parts) => parts.day,
  DDx: (parts) => `${parts.day}${daySuffix(parseInt(parts.day))}`,
  dd: (parts) => `${parseInt(parts.day, 10)}`,
  ddx: (parts) => `${parseInt(parts.day, 10)}${daySuffix(parseInt(parts.day))}`,
  dddd: (parts) => parts.weekday,
  ddd: (parts) => parts.weekday.slice(0, 3),
  A: (parts) => <AmOrPm className="time-suffix">{parts.dayPeriod}</AmOrPm>,
  a: (parts) => <AmOrPm className="time-suffix">{parts.dayPeriod.toLowerCase()}</AmOrPm>,
  // XXX: fix Chrome 80+ bug going over 24h
  HH: (parts) => ("0" + (Number(parts.lhour) % 24)).slice(-2),
  hh: (parts) => parts.hour,
  mm: (parts) => parts.minute,
  ss: (parts) => parts.second,
};

const createCustomPattern = (customFormatters: CustomFormatters) => Object.keys(customFormatters).reduce((_, key) => `|${key}`, "");

function formatDate(customFormatters: CustomFormatters, format: string, parts: DateParts, date: Date): React.ReactNode {
  const literalPattern = "\\[([^\\]]+)\\]|";
  const customPattern = createCustomPattern(customFormatters);
  const patternRegexp = new RegExp(`${literalPattern}${defaultPattern}${customPattern}`, "g");

  const allFormatters = { ...formatters, ...customFormatters };
  // We'll accumulate text/JSX in an array
  const tokens: React.ReactNode[] = [];
  let lastIndex = 0;
  // @ts-expect-error - will fix later
  format.replace(patternRegexp, (mask: FormatterMask, literal: string, offset: number) => {
    // 'offset' is the index of this match within the full format string

    // Push any text that occurs before this match
    if (offset > lastIndex) {
      const val = format.slice(lastIndex, offset);
      if (val.length > 0 && val.trim().length === 0) {
        // whitespace char
        tokens.push(<span className="whitespace">&nbsp;</span>);
      } else {
        tokens.push(val);
      }
    }
    lastIndex = offset + mask.length;

    if (literal) {
      // If we matched [literal text], just push that as plain text
      tokens.push(literal);
    } else {
      // Everything else just push normally
      tokens.push(allFormatters[mask](parts, date));
    }
    // Return an empty string to discard the normal replace output
    return "";
  });
  // If there's still text remaining after the last match, push it
  if (lastIndex < format.length) {
    tokens.push(format.slice(lastIndex));
  }
  // Finally, render the HTML string inside React. We must do dangerouslySetInnerHTML
  // so that <div> ... </div> is recognized as HTML, not plain text:
  return (
    <>
      {tokens.map((tok, i) => {
        // Strings need to be wrapped so they can carry a key
        if (typeof tok === "string") {
          return <Fragment key={i}>{tok}</Fragment>;
        }

        // Valid elements: clone to add/override the key
        if (isValidElement(tok)) {
          return cloneElement(tok, { key: i });
        }

        // Anything else (null, boolean) can be returned as-is
        return tok;
      })}
    </>
  );
}
