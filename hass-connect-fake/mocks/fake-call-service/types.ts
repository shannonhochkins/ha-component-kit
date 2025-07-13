import type { HassEntities } from "home-assistant-js-websocket";

import type {
  DomainService,
  SnakeOrCamelDomains,
  ServiceData,
} from "@hakit/core";

export interface ServiceArgs<D extends SnakeOrCamelDomains, S extends DomainService<D> = DomainService<D>> {
  setEntities: (cb: (entities: HassEntities) => HassEntities) => void;
  now: string;
  target: string | string[];
  service: S;
  serviceData: ServiceData<D, S>, 
}
