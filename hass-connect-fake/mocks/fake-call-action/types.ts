import type { HassEntities } from "home-assistant-js-websocket";

import type {
  DomainAction,
  SnakeOrCamelDomains,
  ActionData,
} from "@hakit/core";

export interface ActionArgs<D extends SnakeOrCamelDomains> {
  setEntities: (cb: (entities: HassEntities) => HassEntities) => void;
  now: string;
  target: string | string[];
  action: DomainAction<D>;
  actionData: ActionData<D, DomainAction<D>>, 
}