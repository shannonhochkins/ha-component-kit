import {
  localize,
  computeDomain,
  UNAVAILABLE,
  UNKNOWN,
  EntityName,
  LocaleKeys,
  EntityRegistryDisplayEntry,
  FrontendLocaleData,
} from "@core";
import { HassEntity, HassConfig, HassEntityAttributeBase } from "home-assistant-js-websocket";

import { formatNumber, getNumberFormatOptions, isNumericFromAttributes } from "./number";
import { UNIT_TO_MILLISECOND_CONVERT, formatDuration, formatDateTime, formatDate, formatTime } from "./date";

export const computeStateDisplay = (
  entity: HassEntity,
  config: HassConfig,
  entities: Record<string, EntityRegistryDisplayEntry> | undefined,
  locale: FrontendLocaleData | null,
  sensorNumericDeviceClasses: string[],
  state?: string,
): string => {
  const _entity = entities?.[entity.entity_id] as EntityRegistryDisplayEntry | undefined;
  return computeStateDisplayFromEntityAttributes(
    locale,
    sensorNumericDeviceClasses,
    config,
    _entity,
    entity.entity_id,
    entity.attributes,
    state !== undefined ? state : entity.state,
  );
};

/**
 * Compute a human‑friendly display string for an entity's PRIMARY `state` value (not a specific attribute).
 *
 * Differences vs `computeAttributeValueDisplay`:
 * - Operates on the entity `state` only; does not traverse or recursively format nested structures.
 * - Applies domain/device_class heuristics (numeric, monetary, duration, timestamp/date handling).
 * - For numeric states uses `formatNumber` and appends raw unit_of_measurement if present.
 * - Handles special date/time domains by parsing the raw state string (e.g. "2025-11-12 08:30:00").
 * - Handles timestamp-like states (device_class: `timestamp` or specific domains) by converting ISO strings.
 * - Returns a localized placeholder for `unknown` or `unavailable`.
 * - Does NOT apply attribute-specific transforms like brightness %, weather units, temperature unit selection—those are handled by `computeAttributeValueDisplay` when formatting attributes individually.
 *
 * NOTE: This signature intentionally does not take a `locale` argument directly (unlike the attribute formatter)
 * because it historically relied on Home Assistant's internal formatting helpers where needed; date/time helpers
 * invoked here already localize based on global config/locale state upstream.
 *
 * Example Usage:
 * ```ts
 * // Numeric temperature sensor
 * computeStateDisplayFromEntityAttributes(conn, config, entry, 'sensor.living_room_temp', { unit_of_measurement: '°C', state_class: 'measurement' } as any, '21.56');
 * // => "21.56°C"
 *
 * // Duration sensor (device_class: duration, seconds)
 * computeStateDisplayFromEntityAttributes(conn, config, entry, 'sensor.timer', { device_class: 'duration', unit_of_measurement: 's' } as any, '3600');
 * // => "1:00:00"
 *
 * // input_datetime entity with date + time
 * computeStateDisplayFromEntityAttributes(conn, config, entry, 'input_datetime.event', {}, '2025-11-12 08:30:00');
 * // => "Nov 12, 2025, 8:30 AM" (example – actual formatting depends on locale)
 *
 * // Timestamp sensor
 * computeStateDisplayFromEntityAttributes(conn, config, entry, 'sensor.last_update', { device_class: 'timestamp' } as any, '2025-11-12T07:45:00.000Z');
 * // => Localized date/time string
 * ```
 */
export const computeStateDisplayFromEntityAttributes = (
  locale: FrontendLocaleData | null,
  sensorNumericDeviceClasses: string[],
  config: HassConfig,
  entity: EntityRegistryDisplayEntry | undefined,
  entityId: string,
  attributes: HassEntityAttributeBase,
  state: string,
): string => {
  if (state === UNKNOWN || state === UNAVAILABLE) {
    return localize(state);
  }

  const domain = computeDomain(entityId as EntityName);
  const is_number_domain = domain === "counter" || domain === "number" || domain === "input_number";

  // Entities with a `unit_of_measurement` or `state_class` are numeric values and should use `formatNumber`
  if (isNumericFromAttributes(attributes, domain === "sensor" ? sensorNumericDeviceClasses : []) || is_number_domain) {
    const key = attributes.unit_of_measurement as keyof typeof UNIT_TO_MILLISECOND_CONVERT;
    // state is duration
    if (
      attributes.device_class === "duration" &&
      attributes.unit_of_measurement &&
      UNIT_TO_MILLISECOND_CONVERT[key] &&
      entity?.display_precision === undefined
    ) {
      try {
        return formatDuration(state, key);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_err) {
        // fallback to default
      }
    }
    if (attributes.device_class === "monetary") {
      try {
        return formatNumber(state, {
          style: "currency",
          currency: attributes.unit_of_measurement,
          minimumFractionDigits: 2,
          // Override monetary options with number format
          ...getNumberFormatOptions({ state, attributes } as HassEntity, entity),
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_err) {
        // fallback to default
      }
    }

    const value = formatNumber(state, getNumberFormatOptions({ state, attributes } as HassEntity, entity));

    const unit = attributes.unit_of_measurement;

    if (unit) {
      return `${value}${unit}`;
    }

    return value;
  }

  if (["date", "input_datetime", "time"].includes(domain)) {
    // If trying to display an explicit state, need to parse the explicit state to `Date` then format.
    // Attributes aren't available, we have to use `state`.

    // These are timezone agnostic, so we should NOT use the system timezone here.
    try {
      const components = state.split(" ");
      if (components.length === 2) {
        // Date and time.
        if (locale) return formatDateTime(new Date(components.join("T")), config, locale);
        return new Date(components.join("T")).toLocaleString();
      }
      if (components.length === 1) {
        if (state.includes("-")) {
          // Date only.
          if (locale) return formatDate(new Date(`${state}T00:00`), config, locale);
          return new Date(`${state}T00:00`).toLocaleDateString();
        }
        if (state.includes(":")) {
          // Time only.
          const now = new Date();
          if (locale) return formatTime(new Date(`${now.toISOString().split("T")[0]}T${state}`), config, locale);
          return new Date(`${now.toISOString().split("T")[0]}T${state}`).toLocaleTimeString();
        }
      }
      return state;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_e) {
      // Formatting methods may throw error if date parsing doesn't go well,
      // just return the state string in that case.
      return state;
    }
  }

  // state is a timestamp
  if (
    [
      "ai_task",
      "button",
      "conversation",
      "event",
      "image",
      "input_button",
      "notify",
      "scene",
      "stt",
      "tag",
      "tts",
      "wake_word",
      "datetime",
    ].includes(domain) ||
    (domain === "sensor" && attributes.device_class === "timestamp")
  ) {
    try {
      if (locale) return formatDateTime(new Date(state), config, locale);
      return new Date(state).toLocaleString();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      return state;
    }
  }

  // state is a timestamp
  if (
    ["button", "conversation", "event", "image", "input_button", "notify", "scene", "stt", "tag", "tts", "wake_word"].includes(domain) ||
    (domain === "sensor" && attributes.device_class === "timestamp")
  ) {
    try {
      if (locale) return formatDateTime(new Date(state), config, locale);
      return new Date(state).toLocaleString();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      return state;
    }
  }

  return localize(state as LocaleKeys);
};
