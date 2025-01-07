export type DatePartName = "weekday" | "year" | "month" | "lmonth" | "day" | "dayPeriod" | "hour" | "lhour" | "minute" | "second";

export type DateParts = { [k in DatePartName]: string };

export type Token = { type: DatePartName | "literal"; value: string };

export type Parser = (date: Date) => DateParts;

export type FormatterMask =
  | "YYYY"
  | "YY"
  | "MMMM"
  | "MMM"
  | "MM"
  | "DD"
  | "DDx"
  | "dd"
  | "ddx"
  | "dddd"
  | "ddd"
  | "A"
  | "a"
  | "HH"
  | "hh"
  | "mm"
  | "ss";

export type Formatter = (tokens: DateParts, date: Date) => string;

export type Formatters = { [k in FormatterMask]: Formatter };

export type CustomFormatters = { [k: string]: Formatter };

export type FormatFunction = (date: Date, format: string, options?: FormatOptions) => string;

export type FormatOptions = {
  locale?: string;
  timezone?: string;
};
