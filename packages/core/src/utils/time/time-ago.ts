/**
 * Converts an ISO formatted timestamp
 * into a relative time string
 */
export function timeAgo(date: Date, languageCode: string | undefined): string {
  const dateTime = date.getTime();

  if (isNaN(dateTime)) {
    console.error("Invalid timestamp");
    return "unknown";
  }

  const formatter = new Intl.RelativeTimeFormat(languageCode, { numeric: "auto" });

  let index;

  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["second", 60],
    ["minute", 60],
    ["hour", 24],
    ["day", 30],
    ["month", 12],
    ["year", Infinity],
  ];

  const now = new Date();
  const diff = (dateTime - now.getTime()) / 1000;

  let diffUnit = Math.abs(diff);
  for (index = 0; index < units.length; index++) {
    if (diffUnit < units[index][1]) break;
    diffUnit /= units[index][1];
  }

  const output = formatter.format(Math.round(diffUnit) * (diff < 0 ? -1 : 1), units[index][0]);
  if (output === "now") {
    return "just now";
  }
  return output;
}
