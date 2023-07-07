import { DomainName } from "@typings";
import { snakeCase } from "lodash";

export const computeDomain = (entityId: string): DomainName =>
  snakeCase(entityId.substr(0, entityId.indexOf("."))) as DomainName;
