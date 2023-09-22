import { useCallback } from "react";
import { HassEntity } from "home-assistant-js-websocket";
import { useHass } from "@core";
import type { EntityName } from "@typings";

type GetEntityFn = {
  (returnNullIfNotFound?: boolean): HassEntity | null;
  (returnNullIfNotFound?: true): HassEntity | null;
  (returnNullIfNotFound?: false): HassEntity;
};

export function useSubscribeEntity(entityId: EntityName): GetEntityFn {
  const { useStore } = useHass();
  const entity = useStore((state) => state.entities[entityId]);

  const getEntity: GetEntityFn = useCallback(
    (returnNullIfNotFound?: boolean) => {
      if (entityId === "unknown") {
        return null;
      }
      if (!entity) {
        if (returnNullIfNotFound) {
          return null;
        }
        throw new Error(`Entity ${entityId} not found`);
      }
      return entity;
    },
    [entity, entityId],
  ) as GetEntityFn;

  return getEntity;
}
