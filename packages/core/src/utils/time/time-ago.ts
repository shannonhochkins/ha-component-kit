// English.
import en from "javascript-time-ago/locale/en.json";
import TimeAgo from "javascript-time-ago";

TimeAgo.addDefaultLocale({
  ...en,
  now: {
    now: {
      // too account for odd time differences, we set these to all be the same
      current: "just now",
      future: "just now",
      past: "just now",
    },
  },
});
// Create formatter (English).
export const timeAgo = new TimeAgo("en-US");
