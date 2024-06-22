import { useEffect, useMemo, useState, useCallback } from "react";
import { cloneDeep, isEmpty, omit } from "lodash";
import type { HassEntityWithService, HassEntityCustom, ExtractDomain, EntityName } from "@typings";
import type { HassEntity } from "home-assistant-js-websocket";
import { useSubscribeEntity } from "../useSubscribeEntity";
import { useService } from "../useService";
import { useHistory } from "../useHistory";
import { getIconByEntity } from "../useIcon";
import { useDebouncedCallback } from "use-debounce";
import { getCssColorValue } from "@utils/colors";
import { computeDomain } from "@utils/computeDomain";
import { diff } from "deep-object-diff";
import type { HistoryOptions } from "../useHistory";
import { timeAgo } from "@utils/time/time-ago";
import { useHass } from "../useHass";

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
  const { useStore } = useHass();
  const language = useStore((state) => state.config?.language);

  const formatEntity = useCallback(
    (entity: HassEntity): HassEntityCustom => {
      const now = new Date();
      const then = new Date(entity.attributes.last_triggered ?? entity.last_updated);
      const relativeTime = timeAgo(then, language);
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
    },
    [language],
  );
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
      // have to omit attributes.icon here as the original icon may not contain any icon,
      // however there's custom functionality to determine icon based on state which needs to be omitted from
      // this check to avoid recursive updates
      const diffed = diff(
        omit(foundEntity, "custom", "last_changed", "last_updated", "context", "attributes.icon"),
        omit($entity, "custom", "last_changed", "last_updated", "context", "attributes.icon"),
      );
      const clonedEntity = cloneDeep(foundEntity);
      // Check for icon differences
      const haHasCustomIcon = typeof clonedEntity.attributes.icon === "string";
      const derivedIcon = typeof $entity.attributes.icon === "string";
      // Logic for handling icon comparison and updates
      let shouldUpdate = !isEmpty(diffed);
      if (haHasCustomIcon && derivedIcon && clonedEntity.attributes.icon !== $entity.attributes.icon) {
        // Condition 1: Both icons are strings and differ
        shouldUpdate = true;
      } else if (!haHasCustomIcon) {
        // Condition 2: clonedEntity's icon is not a string, compute and compare
        const currentIcon = getIconByEntity(computeDomain(clonedEntity.entity_id as EntityName), clonedEntity);
        if (currentIcon !== $entity.attributes.icon) {
          // Replace clonedEntity's icon with the computed icon and mark for update
          clonedEntity.attributes.icon = currentIcon;
          shouldUpdate = true;
        }
      }
      if (shouldUpdate) {
        debounceUpdate(clonedEntity);
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
    } as unknown as UseEntityReturnType<E, O>;
  }, [$entity, history, service]);
}
