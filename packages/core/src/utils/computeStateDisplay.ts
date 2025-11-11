import { localize, computeDomain, UNAVAILABLE, UNKNOWN, EntityName, LocaleKeys } from "@core";
import { HassEntity, HassConfig, HassEntities, HassEntityAttributeBase, Connection } from "home-assistant-js-websocket";

import { formatNumber, getNumberFormatOptions, isNumericFromAttributes } from "./number";
import { UNIT_TO_MILLISECOND_CONVERT, formatDuration, formatDateTime, formatDate, formatTime } from "./date";

import { EntityRegistryDisplayEntry } from "@typings";

export const computeStateDisplay = (
  entity: HassEntity,
  connection: Connection,
  config: HassConfig,
  entities: HassEntities,
  state?: string,
): string => {
  const _entity = entities?.[entity.entity_id] as EntityRegistryDisplayEntry | undefined;

  return computeStateDisplayFromEntityAttributes(
    connection,
    config,
    _entity,
    entity.entity_id,
    entity.attributes,
    state !== undefined ? state : entity.state,
  );
};

export type SensorNumericDeviceClasses = {
  numeric_device_classes: string[];
};

let sensorNumericDeviceClassesCache: Promise<SensorNumericDeviceClasses> | undefined;

const getSensorNumericDeviceClasses = async (connection: Connection): Promise<SensorNumericDeviceClasses> => {
  if (sensorNumericDeviceClassesCache) {
    return sensorNumericDeviceClassesCache;
  }
  sensorNumericDeviceClassesCache = connection.sendMessagePromise({
    type: "sensor/numeric_device_classes",
  });
  return sensorNumericDeviceClassesCache!;
};

let sensorNumericDeviceClasses: string[] = [];

export const computeStateDisplayFromEntityAttributes = (
  connection: Connection,
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
  // fallback, just in case the connection is not ready yet
  getSensorNumericDeviceClasses(connection).then((r) => (sensorNumericDeviceClasses = r?.numeric_device_classes ?? []));

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
        return formatDateTime(new Date(components.join("T")), config);
      }
      if (components.length === 1) {
        if (state.includes("-")) {
          // Date only.
          return formatDate(new Date(`${state}T00:00`), config);
        }
        if (state.includes(":")) {
          // Time only.
          const now = new Date();
          return formatTime(new Date(`${now.toISOString().split("T")[0]}T${state}`), config);
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
      return formatDateTime(new Date(state), config);
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
      return formatDateTime(new Date(state), config);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      return state;
    }
  }

  return localize(state as LocaleKeys);
};
