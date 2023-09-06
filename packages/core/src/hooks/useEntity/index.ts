import { useEffect, useMemo, useState, useCallback } from "react";
import { isEqual, omit } from "lodash";
import TimeAgo from "javascript-time-ago";

import type {
  HassEntityWithApi,
  HassEntityCustom,
  ExtractDomain,
  EntityName,
} from "@typings";
import type { HassEntity } from "home-assistant-js-websocket";
import { useHass, useApi } from "@core";
import { useDebouncedCallback } from "use-debounce";
import { getCssColorValue } from "@utils/colors";
import { computeDomain } from "@utils/computeDomain";

// English.
import en from "javascript-time-ago/locale/en.json";

TimeAgo.addDefaultLocale({
  ...en,
  now: {
    now: {
      // too account for odd time differences, we set these to all be the same
      current: "just now",
      future: "just now",
      past: "just now",
    },
  },
});
// Create formatter (English).
const timeAgo = new TimeAgo("en-US");

interface UseEntityOptions {
  /** The amount of time to throttle updates in milliseconds */
  throttle?: number;
  returnNullIfNotFound?: boolean;
}

const DEFAULT_OPTIONS: UseEntityOptions = {
  throttle: 150,
  returnNullIfNotFound: false,
};

type UseEntityReturnType<
  E,
  O extends UseEntityOptions,
> = O["returnNullIfNotFound"] extends true
  ? HassEntityWithApi<ExtractDomain<E>> | null
  : HassEntityWithApi<ExtractDomain<E>>;

export function useEntity<
  E extends EntityName,
  O extends UseEntityOptions = UseEntityOptions,
>(entity: E, options: O = DEFAULT_OPTIONS as O): UseEntityReturnType<E, O> {
  const { throttle, returnNullIfNotFound } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };
  const { getEntity } = useHass();
  const timeSensor = getEntity("sensor.time", true);
  const matchedEntity = getEntity(entity, returnNullIfNotFound);
  const domain = computeDomain(entity) as ExtractDomain<E>;
  const api = useApi(domain, entity);

  const formatEntity = useCallback((entity: HassEntity): HassEntityCustom => {
    const now = new Date();
    const then = new Date(
      entity.attributes.last_triggered ?? entity.last_updated,
    );
    const relativeTime = timeAgo.format(then);
    const timeDiff = Math.abs(now.getTime() - then.getTime());
    const active = relativeTime === "just now";
    const {
      hexColor,
      rgbColor,
      brightness,
      brightnessValue,
      rgbaColor,
      color,
    } = getCssColorValue(entity);
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
  const [$entity, setEntity] = useState<HassEntityCustom | null>(
    matchedEntity !== null ? formatEntity(matchedEntity) : null,
  );

  useEffect(() => {
    setEntity((entity) => (entity === null ? null : formatEntity(entity)));
  }, [formatEntity, timeSensor]);

  useEffect(() => {
    const foundEntity = getEntity(entity, true);
    if (
      foundEntity &&
      !isEqual(
        omit(foundEntity, "custom", "last_changed", "last_updated"),
        omit($entity, "custom", "last_changed", "last_updated"),
      )
    ) {
      debounceUpdate(foundEntity);
    }
  }, [$entity, matchedEntity, debounceUpdate, entity, getEntity]);

  return useMemo(() => {
    if ($entity === null) {
      // purposely casting here so types are correct on usage side
      return null as unknown as UseEntityReturnType<E, O>;
    }
    return {
      ...$entity,
      api,
    } as unknown as UseEntityReturnType<E, O>;
  }, [$entity, api]);
}
