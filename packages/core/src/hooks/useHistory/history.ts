import { Connection, HassEntity, HassEntityAttributeBase, MessageBase } from "home-assistant-js-websocket";
import { computeDomain, computeStateNameFromEntityAttributes, localize, useStore } from "@core";
import type { EntityName } from "@core";

const DOMAINS_USE_LAST_UPDATED = ["climate", "humidifier", "water_heater"];
const NEED_ATTRIBUTE_DOMAINS = ["climate", "humidifier", "input_datetime", "water_heater", "person", "device_tracker"];
const LINE_ATTRIBUTES_TO_KEEP = [
  "temperature",
  "current_temperature",
  "target_temp_low",
  "target_temp_high",
  "hvac_action",
  "humidity",
  "mode",
  "action",
  "current_humidity",
];

export interface LineChartState {
  state: string;
  last_changed: number;
  attributes?: HassEntity["attributes"];
}

export interface LineChartEntity {
  domain: string;
  name: string;
  entity_id: string;
  states: LineChartState[];
  statistics?: LineChartState[];
}

export interface LineChartUnit {
  unit: string;
  device_class?: string;
  identifier: string;
  data: LineChartEntity[];
}

export interface HistoryStreamMessage {
  states: HistoryStates;
  start_time?: number; // Start time of this historical chunk
  end_time?: number; // End time of this historical chunk
}

export interface TimelineState {
  state_localize: string;
  state: string;
  last_changed: number;
}

export interface TimelineEntity {
  name: string;
  entity_id: string;
  data: TimelineState[];
}

export interface HistoryResult {
  line: LineChartUnit[];
  timeline: TimelineEntity[];
}

export interface HistoryStates {
  [entityId: string]: EntityHistoryState[];
}

export interface EntityHistoryState {
  /** state */
  s: string;
  /** attributes */
  a: HassEntity["attributes"];
  /** last_changed; if set, also applies to lu */
  lc?: number;
  /** last_updated */
  lu: number;
}

const entityIdHistoryNeedsAttributes = (entityId: EntityName) => NEED_ATTRIBUTE_DOMAINS.includes(computeDomain(entityId));
interface SubscribeOptions {
  connection: Connection;
  entityIds: EntityName[];
  callbackFunction: (data: HistoryStates) => void;
  hoursToShow?: number;
  minimalResponse?: boolean;
  significantChangesOnly?: boolean;
  noAttributes?: boolean;
}

export const subscribeHistory = ({
  connection,
  entityIds,
  callbackFunction,
  hoursToShow = 24,
  minimalResponse = true,
  significantChangesOnly = true,
  noAttributes,
}: SubscribeOptions): Promise<() => Promise<void>> => {
  const params: MessageBase = {
    type: "history/stream",
    entity_ids: entityIds,
    start_time: new Date(new Date().getTime() - 60 * 60 * hoursToShow * 1000).toISOString(),
    minimal_response: minimalResponse,
    significant_changes_only: significantChangesOnly,
    no_attributes: noAttributes ?? !entityIds.some((entityId) => entityIdHistoryNeedsAttributes(entityId)),
  };
  const stream = new HistoryStream(hoursToShow);
  return connection.subscribeMessage<HistoryStreamMessage>((message) => callbackFunction(stream.processMessage(message)), params);
};

class HistoryStream {
  hoursToShow?: number;

  combinedHistory: HistoryStates;

  constructor(hoursToShow?: number) {
    this.hoursToShow = hoursToShow;
    this.combinedHistory = {};
  }

  processMessage(streamMessage: HistoryStreamMessage): HistoryStates {
    if (!this.combinedHistory || !Object.keys(this.combinedHistory).length) {
      this.combinedHistory = streamMessage.states;
      return this.combinedHistory;
    }
    if (!Object.keys(streamMessage.states).length) {
      // Empty messages are still sent to
      // indicate no more historical events
      return this.combinedHistory;
    }
    const purgeBeforePythonTime = this.hoursToShow ? (new Date().getTime() - 60 * 60 * this.hoursToShow * 1000) / 1000 : undefined;
    const newHistory: HistoryStates = {};
    for (const entityId of Object.keys(this.combinedHistory)) {
      newHistory[entityId] = [];
    }
    for (const entityId of Object.keys(streamMessage.states)) {
      newHistory[entityId] = [];
    }
    for (const entityId of Object.keys(newHistory)) {
      if (entityId in this.combinedHistory && entityId in streamMessage.states) {
        const entityCombinedHistory = this.combinedHistory[entityId];
        const lastEntityCombinedHistory = entityCombinedHistory[entityCombinedHistory.length - 1];
        newHistory[entityId] = entityCombinedHistory.concat(streamMessage.states[entityId]);
        if (streamMessage.states[entityId][0].lu < lastEntityCombinedHistory.lu) {
          // If the history is out of order we have to sort it.
          newHistory[entityId] = newHistory[entityId].sort((a, b) => a.lu - b.lu);
        }
      } else if (entityId in this.combinedHistory) {
        newHistory[entityId] = this.combinedHistory[entityId];
      } else {
        newHistory[entityId] = streamMessage.states[entityId];
      }
      // Remove old history
      if (purgeBeforePythonTime && entityId in this.combinedHistory) {
        const expiredStates = newHistory[entityId].filter((state) => state.lu < purgeBeforePythonTime);
        if (!expiredStates.length) {
          continue;
        }
        newHistory[entityId] = newHistory[entityId].filter((state) => state.lu >= purgeBeforePythonTime);
        if (newHistory[entityId].length && newHistory[entityId][0].lu === purgeBeforePythonTime) {
          continue;
        }
        // Update the first entry to the start time state
        // as we need to preserve the start time state and
        // only expire the rest of the history as it ages.
        const lastExpiredState = expiredStates[expiredStates.length - 1];
        lastExpiredState.lu = purgeBeforePythonTime;
        newHistory[entityId].unshift(lastExpiredState);
      }
    }
    this.combinedHistory = newHistory;
    return this.combinedHistory;
  }
}

const equalState = (obj1: LineChartState, obj2: LineChartState) =>
  obj1.state === obj2.state &&
  // Only compare attributes if both states have an attributes object.
  // When `minimal_response` is sent, only the first and last state
  // will have attributes except for domains in DOMAINS_USE_LAST_UPDATED.
  (!obj1.attributes || !obj2.attributes || LINE_ATTRIBUTES_TO_KEEP.every((attr) => obj1.attributes![attr] === obj2.attributes![attr]));

const processLineChartEntities = (unit: string, device_class: string | undefined, entities: HistoryStates): LineChartUnit => {
  const hassEntities = useStore.getState().entities;
  const data: LineChartEntity[] = [];

  Object.keys(entities).forEach((entityId) => {
    const states = entities[entityId];
    const first: EntityHistoryState = states[0];
    const domain = computeDomain(entityId as EntityName);
    const processedStates: LineChartState[] = [];

    for (const state of states) {
      let processedState: LineChartState;

      if (DOMAINS_USE_LAST_UPDATED.includes(domain)) {
        processedState = {
          state: state.s,
          last_changed: state.lu * 1000,
          attributes: {},
        };

        for (const attr of LINE_ATTRIBUTES_TO_KEEP) {
          if (attr in state.a) {
            processedState.attributes![attr] = state.a[attr];
          }
        }
      } else {
        processedState = {
          state: state.s,
          // lc (last_changed) may be omitted if its the same
          // as lu (last_updated).
          last_changed: (state.lc ? state.lc : state.lu) * 1000,
          attributes: {},
        };
      }

      if (
        processedStates.length > 1 &&
        equalState(processedState, processedStates[processedStates.length - 1]) &&
        equalState(processedState, processedStates[processedStates.length - 2])
      ) {
        continue;
      }

      processedStates.push(processedState);
    }

    const attributes = entityId in hassEntities ? hassEntities[entityId].attributes : "friendly_name" in first.a ? first.a : undefined;

    data.push({
      domain,
      name: computeStateNameFromEntityAttributes(entityId, attributes || {}),
      entity_id: entityId,
      states: processedStates,
    });
  });

  return {
    unit,
    device_class,
    identifier: Object.keys(entities).join(""),
    data,
  };
};

const processTimelineEntity = (entityId: string, states: EntityHistoryState[], current_state: HassEntity | undefined): TimelineEntity => {
  const data: TimelineState[] = [];
  const first: EntityHistoryState = states[0];
  const formatter = useStore.getState().formatter;
  const entities = useStore.getState().entities;
  for (const state of states) {
    if (data.length > 0 && state.s === data[data.length - 1].state) {
      continue;
    }

    const currentAttributes: HassEntityAttributeBase = {};
    if (current_state?.attributes.device_class) {
      currentAttributes.device_class = current_state?.attributes.device_class;
    }
    const entity = entities[entityId];

    data.push({
      state_localize: formatter.attributeValue(
        {
          ...entity,
          attributes: {
            ...(state.a || first.a),
            ...currentAttributes,
          },
        },
        state.s,
      ),
      state: state.s,
      // lc (last_changed) may be omitted if its the same
      // as lu (last_updated).
      last_changed: (state.lc ? state.lc : state.lu) * 1000,
    });
  }

  return {
    name: computeStateNameFromEntityAttributes(entityId, current_state?.attributes || first.a),
    entity_id: entityId,
    data,
  };
};

const NUMERICAL_DOMAINS = ["counter", "input_number", "number"];

const isNumericFromDomain = (domain: string) => NUMERICAL_DOMAINS.includes(domain);

const isNumericFromAttributes = (attributes: Record<string, unknown>) => "unit_of_measurement" in attributes || "state_class" in attributes;

const isNumericSensorEntity = (stateObj: HassEntity, sensorNumericalDeviceClasses: string[]) =>
  stateObj.attributes.device_class != null && sensorNumericalDeviceClasses.includes(stateObj.attributes.device_class);

const isNumericEntity = (
  domain: string,
  currentState: HassEntity | undefined,
  numericStateFromHistory: EntityHistoryState | undefined,
  sensorNumericalDeviceClasses: string[],
  forceNumeric = false,
): boolean =>
  forceNumeric ||
  isNumericFromDomain(domain) ||
  (currentState != null && isNumericFromAttributes(currentState.attributes)) ||
  (currentState != null && domain === "sensor" && isNumericSensorEntity(currentState, sensorNumericalDeviceClasses)) ||
  numericStateFromHistory != null;

const BLANK_UNIT = " ";

const computeGroupKey = (unit: string | undefined, device_class: string | undefined, splitDeviceClasses: boolean) =>
  splitDeviceClasses ? `${unit}_${device_class || ""}` : unit;

export const computeHistory = (
  entity: HassEntity,
  stateHistory: HistoryStates,
  forceNumeric = false,
  splitDeviceClasses = false,
): HistoryResult => {
  const lineChartDevices: { [unit: string]: HistoryStates } = {};
  const timelineDevices: TimelineEntity[] = [];
  const localStateHistory: HistoryStates = {};
  const sensorNumericalDeviceClasses = useStore.getState().sensorNumericDeviceClasses;
  const config = useStore.getState().config;
  const entities = useStore.getState().entities;

  if (entity.entity_id in stateHistory) {
    localStateHistory[entity.entity_id] = stateHistory[entity.entity_id];
  } else if (entities[entity.entity_id]) {
    localStateHistory[entity.entity_id] = [
      {
        s: entities[entity.entity_id].state,
        a: entities[entity.entity_id].attributes,
        lu: new Date(entities[entity.entity_id].last_updated).getTime() / 1000,
      },
    ];
  }

  if (!localStateHistory) {
    return { line: [], timeline: [] };
  }
  Object.keys(stateHistory).forEach((entityId) => {
    const stateInfo = localStateHistory[entityId];
    if (stateInfo.length === 0) {
      return;
    }

    const domain = computeDomain(entityId as EntityName);

    const currentState = entityId in entities ? entities[entityId] : undefined;
    const numericStateFromHistory =
      currentState || isNumericFromDomain(domain) ? undefined : stateInfo.find((state) => state.a && isNumericFromAttributes(state.a));

    const isNumeric = isNumericEntity(domain, currentState, numericStateFromHistory, sensorNumericalDeviceClasses, forceNumeric);

    let unit: string | undefined;

    if (isNumeric) {
      unit = currentState?.attributes.unit_of_measurement || numericStateFromHistory?.a.unit_of_measurement || BLANK_UNIT;
    } else {
      if (domain === "zone") {
        unit = localize("people_in_zone");
      } else if (domain === "climate" || domain === "water_heater") {
        unit = config?.unit_system.temperature;
      } else if (domain === "humidifier") {
        unit = "%";
      }
    }

    let deviceClassSpecial: string | undefined;

    if (domain === "climate") {
      deviceClassSpecial = "temperature";
    } else if (domain === "humidifier") {
      deviceClassSpecial = "humidity";
    } else if (domain === "water_heater") {
      deviceClassSpecial = "temperature";
    }

    const deviceClass: string | undefined = deviceClassSpecial || (currentState?.attributes || numericStateFromHistory?.a)?.device_class;

    const key = computeGroupKey(unit, deviceClass, splitDeviceClasses);

    if (!unit) {
      timelineDevices.push(processTimelineEntity(entityId, stateInfo, currentState));
    } else if (key && key in lineChartDevices && entityId in lineChartDevices[key]) {
      lineChartDevices[key][entityId].push(...stateInfo);
    } else if (key) {
      if (!(key in lineChartDevices)) {
        lineChartDevices[key] = {};
      }
      lineChartDevices[key][entityId] = stateInfo;
    }
  });

  const unitStates = Object.keys(lineChartDevices).map((key) => {
    const splitKey = key.split("_");
    const unit = splitKey[0];
    const deviceClass = splitKey.slice(1).join("_") || undefined;
    return processLineChartEntities(unit, deviceClass, lineChartDevices[key]);
  });

  return { line: unitStates, timeline: timelineDevices };
};
