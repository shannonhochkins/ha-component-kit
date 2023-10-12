import { useEffect, useState, useMemo } from "react";
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
  /** the number of hours to show
   * @minimum 0
   * @default 24
   * @TJS-type integer
   */
  hoursToShow?: number;
  /** only show significant changes @default true */
  significantChangesOnly?: boolean;
  /** minimal response data @default true */
  minimalResponse?: boolean;
  /* data limits for coordinates, this squashes the upper or lower limits of the data */
  limits?: {
    /**
     * The minimum value to show
     * @minimum 0
     * @TJS-type integer
     */
    min?: number;
    /**
     * The maximum value to show
     * @minimum 0
     * @TJS-type integer
     */
    max?: number;
  };
}
export const useHistory = (entityId: EntityName, options?: HistoryOptions) => {
  const { useStore } = useHass();
  const connection = useStore((state) => state.connection);
  const config = useStore((state) => state.config);
  const getEntity = useSubscribeEntity(entityId);
  const [history, setHistory] = useState<{
    timeline: TimelineState[];
    entityHistory: EntityHistoryState[];
    coordinates: number[][];
    loading: boolean;
  }>({
    loading: true,
    timeline: [],
    entityHistory: [],
    coordinates: [],
  });

  useEffect(() => {
    const entity = getEntity(true);
    setHistory({
      loading: true,
      timeline: [],
      entityHistory: [],
      coordinates: [],
    });
    let isMounted = true; // To check if the component is still mounted
    if (entity !== null) {
      const entities = {
        [entityId]: entity,
      } satisfies HassEntities;
      // Create a local variable to hold the unsubscribe function
      let localUnsubscribe: null | (() => Promise<void>) = null;
      subscribeHistory({
        connection: connection as Connection,
        entities,
        significantChangesOnly: options?.significantChangesOnly,
        minimalResponse: options?.minimalResponse,
        hoursToShow: options?.hoursToShow,
        callbackFunction: (history) => {
          if (!isMounted) return;
          const computedHistory = computeHistory(
            config as HassConfig,
            entities,
            history,
          );
          const matchedHistory = computedHistory.timeline.filter(
            ({ entity_id }) => entity_id === entityId,
          );
          const coordinates =
            coordinatesMinimalResponseCompressedState(
              history[entityId],
              options?.hoursToShow ?? 24,
              500, // viewbox of the svgGraph
              typeof options?.significantChangesOnly === "undefined" ||
                options?.significantChangesOnly === true
                ? 1
                : 2,
              options?.limits,
            ) ?? [];
          setHistory({
            loading: false,
            timeline: matchedHistory.length > 0 ? matchedHistory[0].data : [],
            entityHistory: history[entityId],
            coordinates,
          });
        },
      })
        .then((unsubscribe) => {
          localUnsubscribe = unsubscribe;
        })
        .catch(() => {
          localUnsubscribe?.();
        });
      return () => {
        isMounted = false;
        localUnsubscribe?.();
      };
    }
  }, [entityId, options, connection, config, getEntity]);

  return useMemo(() => history, [history]);
};
