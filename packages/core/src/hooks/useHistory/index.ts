import { useEffect, useState, useMemo, useRef } from "react";
import { useHass, useSubscribeEntity } from "@core";
import type { EntityName } from "@core";
import { HassEntities, HassConfig } from "home-assistant-js-websocket";
import { subscribeHistory, computeHistory } from "./history";
import type { TimelineState, EntityHistoryState, HistoryStates } from "./history";
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
  /** disable the history subscription @default false */
  disable?: boolean;
}
export const useHistory = (entityId: EntityName, options?: HistoryOptions) => {
  const { useStore } = useHass();
  const connection = useStore((state) => state.connection);
  const config = useStore((state) => state.config);
  const subscribed = useRef(false);
  const getEntity = useSubscribeEntity(entityId);
  const [historyStates, setHistoryStates] = useState<HistoryStates>({});
  const [history, setHistory] = useState<{
    timeline: TimelineState[];
    entityHistory: EntityHistoryState[];
    coordinates: number[][];
    loading: boolean;
  }>({
    loading: options?.disable ? false : true,
    timeline: [],
    entityHistory: [],
    coordinates: [],
  });

  const memoizedOptions = useMemo(() => {
    return {
      disable: options?.disable,
      significantChangesOnly: options?.significantChangesOnly,
      minimalResponse: options?.minimalResponse,
      hoursToShow: options?.hoursToShow,
      limits: options?.limits,
    };
  }, [options?.disable, options?.significantChangesOnly, options?.minimalResponse, options?.hoursToShow, options?.limits]);

  useEffect(() => {
    if (!connection || memoizedOptions?.disable) return;
    let isMounted = true; // To check if the component is still mounted
    // Create a local variable to hold the unsubscribe function
    let localUnsubscribe: null | (() => Promise<void>) = null;
    subscribeHistory({
      connection: connection,
      entityIds: [entityId],
      significantChangesOnly: memoizedOptions?.significantChangesOnly,
      minimalResponse: memoizedOptions?.minimalResponse,
      hoursToShow: memoizedOptions?.hoursToShow,
      callbackFunction: (history) => {
        if (!isMounted) return;
        subscribed.current = true;
        setHistoryStates(history);
      },
    })
      .then((unsubscribe) => {
        localUnsubscribe = unsubscribe;
      })
      .catch(() => {
        localUnsubscribe?.();
        subscribed.current = false;
      });
    return () => {
      isMounted = false;
      localUnsubscribe?.();
      subscribed.current = false;
    };
  }, [entityId, memoizedOptions, connection]);

  useEffect(() => {
    if (memoizedOptions?.disable) return;
    if (subscribed.current) {
      const entity = getEntity(true);
      if (!entity) return;
      const entities = {
        [entityId]: entity,
      } satisfies HassEntities;
      const computedHistory = computeHistory(config as HassConfig, entities, historyStates);
      const matchedHistory = computedHistory.timeline.filter(({ entity_id }) => entity_id === entityId);
      const coordinates =
        coordinatesMinimalResponseCompressedState(
          historyStates[entityId],
          memoizedOptions?.hoursToShow ?? 24,
          500, // viewbox of the svgGraph
          typeof memoizedOptions?.significantChangesOnly === "undefined" || memoizedOptions?.significantChangesOnly === true ? 1 : 2,
          memoizedOptions?.limits,
        ) ?? [];

      setHistory({
        loading: false,
        timeline: matchedHistory.length > 0 ? matchedHistory[0].data : [],
        entityHistory: historyStates[entityId],
        coordinates,
      });
    }
  }, [entityId, config, memoizedOptions, getEntity, historyStates]);

  return useMemo(() => history, [history]);
};
