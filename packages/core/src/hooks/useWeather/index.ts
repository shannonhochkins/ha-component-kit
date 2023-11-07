import { useCallback, useState, useMemo, useEffect, useRef } from "react";
import { type EntityName, type FilterByDomain, type WeatherEntity, useHass, useEntity } from "@core";
import type { Connection } from "home-assistant-js-websocket";
import { useDebouncedCallback } from "use-debounce";

import { type ModernForecastType, type ForecastEvent, getForecast, subscribeForecast } from "./helpers";

export interface UseWeatherOptions {
  type: ModernForecastType;
}

export interface WeatherEntityExtended extends WeatherEntity {
  forecast: ForecastEvent | null;
}

export function useWeather(entityId: FilterByDomain<EntityName, "weather">, options?: UseWeatherOptions) {
  const { useStore } = useHass();
  const connection = useStore((state) => state.connection);
  const _entity = useEntity(entityId);
  const [error, setError] = useState<string | null>(null);
  const [forecastEvent, setForecastEvent] = useState<ForecastEvent | null>(null);
  const _subscribed = useRef<boolean>(false);
  const _unsubscribe = useRef<void | (() => Promise<void>)>(undefined);

  const { type = "daily" } = options || {};

  const subscribeWeatherEvents = useCallback(
    (entityId: FilterByDomain<EntityName, "weather">, type: ModernForecastType) => {
      const unsubscribe = subscribeForecast(connection as Connection, entityId, type, (streamMessage) => {
        // If we receive an event after subscription if false, we most likely
        // have been unmounted and no need to set the state
        if (!_subscribed.current) return;
        setForecastEvent(streamMessage);
      }).catch((err) => {
        _subscribed.current = false;
        if (err instanceof Error) {
          setError(err.message);
        }
      });
      return unsubscribe;
    },
    [connection],
  );

  const debounceSubscribeLogbookPeriod = useDebouncedCallback(
    async (entityId: FilterByDomain<EntityName, "weather">, type: ModernForecastType) => {
      if (_unsubscribe.current) {
        const unsubscribe = await _unsubscribe.current;
        if (unsubscribe) unsubscribe();
        _unsubscribe.current = undefined;
      }
      _subscribed.current = true;
      _unsubscribe.current = await subscribeWeatherEvents(entityId, type);
    },
    100,
  );

  useEffect(() => {
    debounceSubscribeLogbookPeriod(entityId, type);

    return () => {
      _subscribed.current = false;
      if (_unsubscribe.current) {
        _unsubscribe.current();
      }
    };
  }, [type, debounceSubscribeLogbookPeriod, subscribeWeatherEvents, entityId]);

  if (error) {
    throw error;
  }

  return useMemo(() => {
    const forecastData = getForecast(_entity.attributes, forecastEvent);
    return {
      ..._entity,
      forecast: forecastData,
    };
  }, [_entity, forecastEvent]);
}
