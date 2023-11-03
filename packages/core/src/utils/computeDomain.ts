import { AllDomains, EntityName, CamelToSnake } from "@typings";
import { snakeCase } from "lodash";

export const computeDomain = <E extends EntityName | "unknown">(entityId: E): CamelToSnake<AllDomains> =>
  snakeCase(entityId.substr(0, entityId.indexOf("."))) as CamelToSnake<AllDomains>;
