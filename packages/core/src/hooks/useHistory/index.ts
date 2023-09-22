import { useEffect, useState, useMemo, useRef } from "react";
import { useHass, useSubscribeEntity } from "@core";
import type { EntityName } from "@core";
import {
  HassEntities,
  Connection,
  HassConfig,
} from "home-assistant-js-websocket";
import { subscribeHistory, computeHistory } from "./history";
import type { TimelineState, EntityHistoryState } from "./history";
import { coordinatesMinimalResponseCompressedState } from "./coordinates";


export interface HistoryOptions {
  /** the number of hours to show @default 24 */
  hoursToShow?: number;
  /** only show significant changes @default true */
  significantChangesOnly?: boolean;
  /** minimal response data @default true */
  minimalResponse?: boolean;
  /** data limits for coordinates */
  limits?: { min?: number; max?: number };
}
export const useHistory = (entityId: EntityName, options?: HistoryOptions) => {
  const { useStore } = useHass();
  const connection = useStore((state) => state.connection);
  const config = useStore((state) => state.config);
  const getEntity = useSubscribeEntity(entityId);
  const unsubscribe = useRef<Promise<() => Promise<void>> | null>(null);
  const [history, setHistory] = useState<{
    timeline: TimelineState[];
    entityHistory: EntityHistoryState[];
    coordinates: number[][]
  }>({
    timeline: [],
    entityHistory: [],
    coordinates: []
  });

  if (unsubscribe.current === null) {
    const entity = getEntity(true);
    if (entity !== null) {
      const entities = {
        [entityId]: entity,
      } satisfies HassEntities;
      unsubscribe.current = subscribeHistory({
        connection: connection as Connection,
        entities,
        significantChangesOnly: options?.significantChangesOnly,
        minimalResponse: options?.minimalResponse,
        hoursToShow: options?.hoursToShow,
        callbackFunction: (history) => {
          console.log('history', history, unsubscribe.current);
          const computedHistory = computeHistory(
            config as HassConfig,
            entities,
            history,
          );
          const matchedHistory = computedHistory.timeline.filter(
            ({ entity_id }) => entity_id === entityId,
          );
          // if (unsubscribe.current !== null) {
            const coordinates = 
            coordinatesMinimalResponseCompressedState(
              history[entityId],
              options?.hoursToShow ?? 24,
              500, // viewbox of the svgGraph
              typeof options?.significantChangesOnly === 'undefined' || options?.significantChangesOnly === true ? 1 : 2,
              options?.limits
            ) ?? [];
            console.log('coordinates', coordinates);
            setHistory({
              timeline: matchedHistory.length > 0 ? matchedHistory[0].data : [],
              entityHistory: history[entityId],
              coordinates
            });
          // }
        },
      });
      unsubscribe.current.catch(() => {
      console.log('xxxx', unsubscribe.current);
        if (unsubscribe.current) {
          unsubscribe.current.then((unsubscribe) => unsubscribe?.());
          unsubscribe.current = null;
        }
      });
    }
  }

  useEffect(() => {
    return () => {
      if (unsubscribe.current !== null) {
        console.log('xxxx2', unsubscribe.current);
        unsubscribe.current.then((unsubscribe) => unsubscribe?.());
        unsubscribe.current = null;
      }
    };
  }, []);

  return useMemo(() => history, [history]);
};
