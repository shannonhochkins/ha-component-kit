import { useEffect, useMemo, useState, useCallback } from "react";
import { isEmpty, omit } from "lodash";
import type { HassEntityWithService, HassEntityCustom, ExtractDomain, EntityName } from "@typings";
import type { HassEntity } from "home-assistant-js-websocket";
import { useService, useHistory, useSubscribeEntity } from "@core";
import { useDebouncedCallback } from "use-debounce";
import { getCssColorValue } from "@utils/colors";
import { computeDomain } from "@utils/computeDomain";
import { diff } from "deep-object-diff";
import type { HistoryOptions } from "../useHistory";
import { timeAgo } from "@utils/time/time-ago";

interface UseEntityOptions {
  /** The amount of time to throttle updates in milliseconds */
  throttle?: number;
  returnNullIfNotFound?: boolean;
  historyOptions?: HistoryOptions;
}

const DEFAULT_OPTIONS: UseEntityOptions = {
  throttle: 150,
  returnNullIfNotFound: false,
  historyOptions: {
    hoursToShow: 24,
    significantChangesOnly: true,
    minimalResponse: true,
    disable: true,
  },
};

type UseEntityReturnType<E, O extends UseEntityOptions> = O["returnNullIfNotFound"] extends true
  ? HassEntityWithService<ExtractDomain<E>> | null
  : HassEntityWithService<ExtractDomain<E>>;

export function useEntity<E extends EntityName, O extends UseEntityOptions = UseEntityOptions>(
  entity: E,
  options: O = DEFAULT_OPTIONS as O,
): UseEntityReturnType<E, O> {
  const { throttle, returnNullIfNotFound, historyOptions } = {
    ...DEFAULT_OPTIONS,
    ...options,
    historyOptions: {
      ...DEFAULT_OPTIONS.historyOptions,
      ...options.historyOptions,
    },
  };
  const getEntity = useSubscribeEntity(entity);
  const matchedEntity = getEntity(returnNullIfNotFound);
  const domain = computeDomain(entity) as ExtractDomain<E>;
  const service = useService(domain, entity);
  const history = useHistory(entity, historyOptions);
  const formatEntity = useCallback((entity: HassEntity): HassEntityCustom => {
    const now = new Date();
    const then = new Date(entity.attributes.last_triggered ?? entity.last_updated);
    const relativeTime = timeAgo.format(then);
    const timeDiff = Math.abs(now.getTime() - then.getTime());
    const active = relativeTime === "just now";
    const { hexColor, rgbColor, brightness, brightnessValue, rgbaColor, color } = getCssColorValue(entity);
    return {
      ...entity,
      custom: {
        color,
        relativeTime,
        timeDiff,
        active,
        hexColor,
        rgbColor,
        brightness,
        brightnessValue,
        rgbaColor,
      },
    };
  }, []);
  const debounceUpdate = useDebouncedCallback((entity: HassEntity) => {
    setEntity(formatEntity(entity));
  }, throttle);
  const [$entity, setEntity] = useState<HassEntityCustom | null>(matchedEntity !== null ? formatEntity(matchedEntity) : null);

  useEffect(() => {
    setEntity((entity) => (entity === null ? null : formatEntity(entity)));
  }, [formatEntity]);

  useEffect(() => {
    const foundEntity = getEntity(true);
    if (foundEntity && $entity) {
      const diffed = diff(
        omit(foundEntity, "custom", "last_changed", "last_updated", "context"),
        omit($entity, "custom", "last_changed", "last_updated", "context"),
      );
      if (!isEmpty(diffed)) {
        debounceUpdate(foundEntity);
      }
    }
  }, [$entity, debounceUpdate, getEntity]);

  return useMemo(() => {
    if ($entity === null) {
      // purposely casting here so types are correct on usage side
      return null as unknown as UseEntityReturnType<E, O>;
    }
    return {
      ...$entity,
      history,
      service,
      api: service,
    } as unknown as UseEntityReturnType<E, O>;
  }, [$entity, history, service]);
}
