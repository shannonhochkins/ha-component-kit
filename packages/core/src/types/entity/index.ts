import type { LightEntityAttributes } from "./light";
import type { HvacMode, ClimateEntityAttributes } from "./climate";

export * from "./light";
export * from "./climate";

export interface DefinedPropertiesByDomain {
  ["light"]: {
    attributes: LightEntityAttributes;
  };
  ["climate"]: {
    attributes: ClimateEntityAttributes;
    state: HvacMode;
  };
}
