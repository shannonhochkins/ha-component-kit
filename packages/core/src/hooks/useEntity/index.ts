import { useMemo } from "react";
import type { HassEntityWithService, HassEntityCustom, ExtractDomain, EntityName } from "@typings";
import type { HassEntity } from "home-assistant-js-websocket";
import { getCssColorValue } from "@utils/colors";
import { timeAgo } from "@utils/time/time-ago";
import { computeDomain, useStore, useSubscribeEntity, useHistory, useService, getIconByEntity, type HistoryOptions } from "@core";

export interface UseEntityOptions {
  returnNullIfNotFound?: boolean;
  historyOptions?: HistoryOptions;
}

const DEFAULT_OPTIONS: Required<UseEntityOptions> = {
  returnNullIfNotFound: false,
  historyOptions: {
    hoursToShow: 24,
    significantChangesOnly: true,
    minimalResponse: true,
    disable: true,
  },
};

export type UseEntityReturnType<E, O extends UseEntityOptions> = O["returnNullIfNotFound"] extends true
  ? HassEntityWithService<ExtractDomain<E>> | null
  : HassEntityWithService<ExtractDomain<E>>;

function formatEntity(entity: HassEntity, language: string | undefined): HassEntityCustom {
  const now = new Date();
  const then = new Date(entity.attributes.last_triggered ?? entity.last_updated);
  const relativeTime = timeAgo(then, language);
  const timeDiff = Math.abs(now.getTime() - then.getTime());
  const active = relativeTime === "just now";
  const { hexColor, rgbColor, brightness, brightnessValue, rgbaColor, color } = getCssColorValue(entity);
  const currentIcon = getIconByEntity(computeDomain(entity.entity_id as EntityName), entity);
  return {
    ...entity,
    attributes: {
      ...entity.attributes,
      icon: entity.attributes?.icon || currentIcon,
    },
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
}

export function useEntity<E extends EntityName, O extends UseEntityOptions = UseEntityOptions>(
  entity: E,
  options: O = DEFAULT_OPTIONS as O,
): UseEntityReturnType<E, O> {
  const { returnNullIfNotFound, historyOptions } = {
    ...DEFAULT_OPTIONS,
    ...options,
    historyOptions: {
      ...DEFAULT_OPTIONS.historyOptions,
      ...options.historyOptions,
    },
  };
  const getEntity = useSubscribeEntity(entity);
  const rawEntity = getEntity(returnNullIfNotFound);
  const domain = computeDomain(entity) as ExtractDomain<E>;
  const service = useService(domain, entity);
  const history = useHistory(entity, historyOptions);
  const language = useStore((state) => state.config?.language);
  const formatted = useMemo(
    () => (rawEntity ? formatEntity(rawEntity, language) : null),
    [rawEntity, language],
  );
  const entityWithHelpers = useMemo(() => {
    if (formatted == null) {
      // purposely casting here so types are correct on usage side
      // if returnNullIfNotFound is true, we return null, if not we throw an error
      return null as unknown as UseEntityReturnType<E, O>;
    }
    return { ...formatted, service, history } as UseEntityReturnType<E, O>;
  }, [formatted, service, history]);

  return entityWithHelpers;
}
