import { HassEntity, Connection, type MessageBase } from "home-assistant-js-websocket";
import { computeDomain, ON, OFF, UNAVAILABLE, DOMAINS_WITH_DYNAMIC_PICTURE, UNKNOWN, type EntityName, localize } from "@core";
import { LocaleKeys } from "../useLocale/locales/types";
export const CONTINUOUS_DOMAINS = ["counter", "proximity", "sensor", "zone"];

export interface LogbookStreamMessage {
  events: LogbookEntry[];
  start_time?: number; // Start time of this historical chunk
  end_time?: number; // End time of this historical chunk
  partial?: boolean; // indicates more historical chunks are coming
}

export interface LogbookEntry {
  // Base data
  when: number; // Python timestamp. Do *1000 to get JS timestamp.
  name: string;
  message?: string;
  entity_id?: string;
  icon?: string;
  source?: string; // The trigger source
  domain?: string;
  state?: string; // The state of the entity
  // Context data
  context_id?: string;
  context_user_id?: string;
  context_event_type?: string;
  context_domain?: string;
  context_service?: string; // Service calls only
  context_entity_id?: string;
  context_entity_id_name?: string; // Legacy, not longer sent
  context_name?: string;
  context_state?: string; // The state of the entity
  context_source?: string; // The trigger source
  context_message?: string;
}
export const createHistoricState = (entity: HassEntity, state?: string): HassEntity => <HassEntity>(<unknown>{
    entity_id: entity.entity_id,
    state: state,
    attributes: {
      // Rebuild the historical state by copying static attributes only
      device_class: entity?.attributes.device_class,
      source_type: entity?.attributes.source_type,
      has_date: entity?.attributes.has_date,
      has_time: entity?.attributes.has_time,
      // We do not want to use dynamic entity pictures (e.g., from media player) for the log book rendering,
      // as they would present a false state in the log (played media right now vs actual historic data).
      entity_picture_local: DOMAINS_WITH_DYNAMIC_PICTURE.has(computeDomain(entity.entity_id as EntityName))
        ? undefined
        : entity?.attributes.entity_picture_local,
      entity_picture: DOMAINS_WITH_DYNAMIC_PICTURE.has(computeDomain(entity.entity_id as EntityName))
        ? undefined
        : entity?.attributes.entity_picture,
    },
  });

export const subscribeLogbook = (
  connection: Connection,
  callbackFunction: (message: LogbookStreamMessage) => void,
  startDate: string,
  endDate: string,
  entityIds?: string[],
  deviceIds?: string[],
): Promise<() => Promise<void>> => {
  // If all specified filters are empty lists, we can return an empty list.
  if ((entityIds || deviceIds) && (!entityIds || entityIds.length === 0) && (!deviceIds || deviceIds.length === 0)) {
    return Promise.reject(`${localize("no_matching_entities_found")}, ${localize("no_matching_devices_found")}`);
  }
  const params: MessageBase = {
    type: "logbook/event_stream",
    start_time: startDate,
    end_time: endDate,
  };
  if (entityIds?.length) {
    params.entity_ids = entityIds;
  }
  if (deviceIds?.length) {
    params.device_ids = deviceIds;
  }
  return connection.subscribeMessage<LogbookStreamMessage>((message) => callbackFunction(message), params);
};

const triggerPhrases = {
  "numeric state of": "logbook_triggered_by_numeric_state_of", // number state trigger
  "state of": "triggered_by_state_of", // state trigger
  event: "triggered_by_event", // event trigger
  time: "triggered_by_time", // time trigger
  "time pattern": "triggered_by_time_pattern", // time trigger
  "Home Assistant stopping": "logbook_triggered_by_homeassistant_stopping", // stop event
  "Home Assistant starting": "logbook_triggered_by_homeassistant_starting", // start event
} satisfies Record<string, LocaleKeys>;

export const localizeTriggerSource = (source: string) => {
  for (const triggerPhrase in triggerPhrases) {
    if (source.startsWith(triggerPhrase)) {
      return source.replace(
        triggerPhrase,
        // @ts-expect-error - this is fine, it'll return undefined
        `${localize(`${triggerPhrases[triggerPhrase]}`)}`,
      );
    }
  }
  return source;
};

export const localizeStateMessage = (state: string, stateObj: HassEntity, domain: string): string => {
  switch (domain) {
    case "device_tracker":
    case "person":
      if (state === "not_home") {
        return localize(`was_detected_away`);
      }
      if (state === "home") {
        return localize(`was_detected_at_home`);
      }
      return localize(`was_detected_at_state`, {
        search: "{state}",
        replace: state,
      });

    case "sun":
      return state === "above_horizon" ? localize(`rose`) : localize(`set`);

    case "binary_sensor": {
      const isOn = state === ON;
      const isOff = state === OFF;
      const device_class = stateObj.attributes.device_class;

      switch (device_class) {
        case "battery":
          if (isOn) {
            return localize(`was_low`);
          }
          if (isOff) {
            return localize(`was_normal`);
          }
          break;

        case "connectivity":
          if (isOn) {
            return localize(`was_connected`);
          }
          if (isOff) {
            return localize(`was_disconnected`);
          }
          break;

        case "door":
        case "garage_door":
        case "opening":
        case "window":
          if (isOn) {
            return localize(`was_opened`);
          }
          if (isOff) {
            return localize(`was_closed`);
          }
          break;

        case "lock":
          if (isOn) {
            return localize(`was_unlocked`);
          }
          if (isOff) {
            return localize(`was_locked`);
          }
          break;

        case "plug":
          if (isOn) {
            return localize(`was_plugged_in`);
          }
          if (isOff) {
            return localize(`was_unplugged`);
          }
          break;

        case "presence":
          if (isOn) {
            return localize(`was_detected_at_home`);
          }
          if (isOff) {
            return localize(`was_detected_away`);
          }
          break;

        case "safety":
          if (isOn) {
            return localize(`was_unsafe`);
          }
          if (isOff) {
            return localize(`was_safe`);
          }
          break;

        case "cold":
        case "gas":
        case "heat":
        case "moisture":
        case "motion":
        case "occupancy":
        case "power":
        case "problem":
        case "smoke":
        case "sound":
        case "vibration":
          if (isOn) {
            return localize(`detected_device_class`, {
              search: "{device_class}",
              replace: device_class,
            });
          }
          if (isOff) {
            return localize(`cleared_no_device_class_detected`, {
              search: "{device_class}",
              replace: device_class,
            });
          }
          break;

        case "tamper":
          if (isOn) {
            return localize(`detected_tampering`);
          }
          if (isOff) {
            return localize(`cleared_tampering`);
          }
          break;
      }

      break;
    }

    case "cover":
      switch (state) {
        case "open":
          return localize(`was_opened`);
        case "opening":
          return localize(`is_opening`);
        case "closing":
          return localize(`is_closing`);
        case "closed":
          return localize(`was_closed`);
      }
      break;

    case "event": {
      return localize(`detected_an_event`);
    }

    case "lock":
      switch (state) {
        case "unlocked":
          return localize(`was_unlocked`);
        case "locking":
          return localize(`is_locking`);
        case "unlocking":
          return localize(`is_unlocking`);
        case "locked":
          return localize(`was_locked`);
        case "jammed":
          return localize(`is_jammed`);
      }
      break;
  }

  if (state === ON) {
    return localize(`turned_on`);
  }

  if (state === OFF) {
    return localize(`turned_off`);
  }

  if (state === UNKNOWN) {
    return localize(`became_unknown`);
  }

  if (state === UNAVAILABLE) {
    return localize(`became_unavailable`);
  }

  return localize(`changed_to_state`, {
    search: "{state}",
    replace: stateObj ? stateObj.state : state,
  });
};
