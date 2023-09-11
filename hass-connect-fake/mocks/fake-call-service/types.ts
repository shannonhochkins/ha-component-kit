import type { HassEntities } from "home-assistant-js-websocket";

import type {
  DomainService,
  SnakeOrCamelDomains,
  ServiceData,
} from "@hakit/core";

export interface ServiceArgs<D extends SnakeOrCamelDomains> {
  setEntities: React.Dispatch<React.SetStateAction<HassEntities>>;
  now: string;
  target: string | string[];
  service: DomainService<D>;
  serviceData: ServiceData<D, DomainService<D>>, 
}