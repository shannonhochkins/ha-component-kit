import { LightEntityAttributes } from "./light";

export interface DefinedPropertiesByDomain {
  ["light"]: {
    attributes: LightEntityAttributes;
  };
}
