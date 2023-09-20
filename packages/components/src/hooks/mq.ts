import { STANDARD_BREAKPOINTS } from "./constants";
import type { StandardResponsiveTypes } from "./constants";

export const mq = (names: StandardResponsiveTypes[], cssValues: string) => {
  return names
    .map(
      (name) => `
    @media ${STANDARD_BREAKPOINTS[name]} {
      ${cssValues}
    }
  `,
    )
    .join("\n");
};
