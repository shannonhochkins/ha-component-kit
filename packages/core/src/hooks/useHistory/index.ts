import { useEffect, useState, useMemo, useRef } from "react";
import { useHass, useSubscribeEntity } from "@core";
import type { EntityName } from "@core";
import {
  HassEntities,
  Connection,
  HassConfig,
} from "home-assistant-js-websocket";
import { subscribeHistory, computeHistory } from "./history";
import type { TimelineState } from "./history";

export const useHistory = (entityId: EntityName) => {
  const { useStore } = useHass();
  const connection = useStore((state) => state.connection);
  const config = useStore((state) => state.config);
  const getEntity = useSubscribeEntity(entityId);
  const unsubscribe = useRef<Promise<() => Promise<void>> | null>(null);
  const [history, setHistory] = useState<TimelineState[]>([]);

  if (unsubscribe.current === null) {
    const entity = getEntity(true);
    if (entity !== null) {
      const start = new Date();
      start.setHours(start.getHours() - 1, 0, 0, 0);
      const startDate = start;

      const end = new Date();
      end.setHours(end.getHours() + 2, 0, 0, 0);
      const endDate = end;
      const entities = {
        [entityId]: entity,
      } satisfies HassEntities;
      const ids = [entityId];
      unsubscribe.current = subscribeHistory(
        connection as Connection,
        entities,
        (history) => {
          const computedHistory = computeHistory(
            config as HassConfig,
            entities,
            history,
          );
          const matchedHistory = computedHistory.timeline.filter(
            ({ entity_id }) => ids.includes(entity_id as EntityName),
          );
          if (matchedHistory.length > 0 && unsubscribe.current !== null) {
            const [entityHistory] = matchedHistory;
            setHistory(entityHistory.data);
          }
        },
        startDate,
        endDate,
        ids,
      );
      unsubscribe.current.catch(() => {
        if (unsubscribe.current) {
          unsubscribe.current.then((unsubscribe) => unsubscribe?.());
        }
      });
    }
  }

  useEffect(() => {
    return () => {
      if (unsubscribe.current !== null) {
        unsubscribe.current.then((unsubscribe) => unsubscribe?.());
        unsubscribe.current = null;
      }
    };
  }, []);

  return useMemo(() => history, [history]);
};
