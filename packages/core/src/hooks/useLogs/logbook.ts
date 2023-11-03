import { HassEntity, Connection, type MessageBase } from "home-assistant-js-websocket";
import { computeDomain, ON, OFF, UNAVAILABLE, DOMAINS_WITH_DYNAMIC_PICTURE, UNKNOWN, type EntityName } from "@core";
export const CONTINUOUS_DOMAINS = ["counter", "proximity", "sensor", "zone"];

export interface LogbookStreamMessage {
  events: LogbookEntry[];
  start_time?: number; // Start time of this historical chunk
  end_time?: number; // End time of this historical chunk
  partial?: boolean; // Indiciates more historical chunks are coming
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
    return Promise.reject("No entities or devices");
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

const locale = {
  was_away: "was detected away",
  was_at_state: "was detected at {state}",
  rose: "rose",
  set: "set",
  was_low: "was low",
  was_normal: "was normal",
  was_connected: "was connected",
  was_disconnected: "was disconnected",
  was_opened: "was opened",
  was_closed: "was closed",
  is_opening: "is opening",
  is_closing: "is closing",
  was_unlocked: "was unlocked",
  was_locked: "was locked",
  is_unlocking: "is unlocking",
  is_locking: "is locking",
  is_jammed: "is jammed",
  was_plugged_in: "was plugged in",
  was_unplugged: "was unplugged",
  was_at_home: "was detected at home",
  was_unsafe: "was unsafe",
  was_safe: "was safe",
  detected_device_class: "detected {device_class}",
  cleared_device_class: "cleared (no {device_class} detected)",
  turned_off: "turned off",
  turned_on: "turned on",
  changed_to_state: "changed to {state}",
  became_unavailable: "became unavailable",
  became_unknown: "became unknown",
  detected_tampering: "detected tampering",
  cleared_tampering: "cleared tampering",
  detected_event: "{event_type} event detected",
  detected_event_no_type: "detected an event",
  detected_unknown_event: "detected an unknown event",
  entries_not_found: "No logbook events found.",

  triggered_by: "triggered by",
  triggered_by_automation: "triggered by automation",
  triggered_by_script: "triggered by script",
  triggered_by_service: "triggered by service",
  triggered_by_numeric_state_of: "triggered by numeric state of",
  triggered_by_state_of: "triggered by state of",
  triggered_by_event: "triggered by event",
  triggered_by_time: "triggered by time",
  triggered_by_time_pattern: "triggered by time pattern",
  triggered_by_homeassistant_stopping: "triggered by Home Assistant stopping",
  triggered_by_homeassistant_starting: "triggered by Home Assistant starting",
  show_trace: "[%key:ui::panel::config::automation::editor::show_trace%]",
  retrieval_error: "Could not load logbook",
  not_loaded: "[%key:ui::dialogs::helper_settings::platform_not_loaded%]",
} as const;

export const localize = (str: keyof typeof locale, search?: string, replace?: string) => {
  if (search && replace) {
    return locale[str].replace(`{${search}}`, replace);
  }
  return locale[str];
};

const triggerPhrases = {
  "numeric state of": "triggered_by_numeric_state_of", // number state trigger
  "state of": "triggered_by_state_of", // state trigger
  event: "triggered_by_event", // event trigger
  time: "triggered_by_time", // time trigger
  "time pattern": "triggered_by_time_pattern", // time trigger
  "Home Assistant stopping": "triggered_by_homeassistant_stopping", // stop event
  "Home Assistant starting": "triggered_by_homeassistant_starting", // start event
};

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
        return localize(`was_away`);
      }
      if (state === "home") {
        return localize(`was_at_home`);
      }
      return localize(`was_at_state`, "state", state);

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
            return localize(`was_at_home`);
          }
          if (isOff) {
            return localize(`was_away`);
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
            return localize(`detected_device_class`, "device_class", device_class);
          }
          if (isOff) {
            return localize(`cleared_device_class`, "device_class", device_class);
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
      return localize(`detected_event_no_type`);
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

  return localize(`changed_to_state`, "state", stateObj ? stateObj.state : state);
};
