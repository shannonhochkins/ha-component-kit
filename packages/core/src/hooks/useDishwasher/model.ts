import type { HassEntity } from "home-assistant-js-websocket";
import type { EntityHistoryState } from "../useHistory/history";
import type { DishwasherCycle, DishwasherDoorState, DishwasherOperationState, UseDishwasherOptions } from "./types";

const OPERATION_STATES: Readonly<Record<string, DishwasherOperationState>> = {
  inactive: "idle",
  ready: "ready",
  delayedstart: "scheduled",
  run: "running",
  pause: "paused",
  actionrequired: "action-required",
  finished: "finished",
  error: "error",
  aborting: "aborting",
};
const DOOR_STATES: Readonly<Record<string, DishwasherDoorState>> = {
  open: "open",
  on: "open",
  closed: "closed",
  off: "closed",
  locked: "locked",
};

const ownValue = <T>(values: Readonly<Record<string, T>> | undefined, key: string): T | undefined =>
  values && Object.prototype.hasOwnProperty.call(values, key) ? values[key] : undefined;

export function operationState(raw: string | undefined, overrides?: UseDishwasherOptions["operationStates"]): DishwasherOperationState {
  if (raw === "unavailable") return "unavailable";
  if (!raw || raw === "unknown") return "unknown";
  return ownValue(overrides, raw) ?? ownValue(OPERATION_STATES, raw) ?? "unknown";
}
export function doorState(raw: string | undefined, overrides?: UseDishwasherOptions["doorStates"]): DishwasherDoorState {
  if (raw === "unavailable") return "unavailable";
  if (!raw || raw === "unknown") return "unknown";
  return ownValue(overrides, raw) ?? ownValue(DOOR_STATES, raw) ?? "unknown";
}
export const isActive = (state: DishwasherOperationState) =>
  ["running", "paused", "scheduled", "action-required", "aborting"].includes(state);
export const available = (entity: HassEntity | null) => entity != null && !["unknown", "unavailable"].includes(entity.state);
export const binaryValue = (entity: HassEntity | null): boolean | null =>
  entity?.state === "on" ? true : entity?.state === "off" ? false : null;

export function numericValue(entity: HassEntity | null): number | null {
  if (!available(entity) || !entity?.state.trim()) return null;
  const value = Number(entity.state);
  return Number.isFinite(value) ? value : null;
}
export function finishTimestamp(entity: HassEntity | null): number | null {
  if (!available(entity) || !/(?:Z|[+-]\d{2}:\d{2})$/i.test(entity!.state)) return null;
  const value = Date.parse(entity!.state);
  return Number.isFinite(value) ? value : null;
}
export function remainingSeconds(entity: HassEntity | null): number | null {
  const value = numericValue(entity);
  const unit: unknown = entity?.attributes.unit_of_measurement;
  const factor = unit === "s" ? 1 : unit === "min" ? 60 : unit === "h" ? 3600 : null;
  return value != null && value >= 0 && factor ? value * factor : null;
}
export function programOptions(entity: HassEntity | null): string[] {
  if (!entity || entity.state === "unavailable") return [];
  const options: unknown = entity.attributes.options;
  return Array.isArray(options)
    ? [...new Set(options.filter((option): option is string => typeof option === "string" && option.length > 0))]
    : [];
}

/** Preserve observation order (lu), not old lc values repeated by attribute-only updates. */
function events(history: EntityHistoryState[], current: HassEntity | null, now: number) {
  const sorted = history
    .filter((event) => typeof event.s === "string" && Number.isFinite(event.lu) && event.lu * 1000 <= now)
    .map((event) => ({ state: event.s, at: event.lu * 1000, changedAt: (event.lc ?? event.lu) * 1000 }))
    .sort((a, b) => a.at - b.at);
  // Live state can bridge Recorder delivery latency, but cannot fabricate history coverage.
  if (current && sorted.length) {
    const at = Date.parse(current.last_updated);
    if (Number.isFinite(at) && at <= now && at >= sorted[sorted.length - 1].at) {
      sorted.push({ state: current.state, at, changedAt: Date.parse(current.last_changed) });
    }
  }
  return sorted
    .filter((event, index) => index === 0 || event.state !== sorted[index - 1].state)
    .map((event) => ({ ...event, at: Number.isFinite(event.changedAt) && event.changedAt <= event.at ? event.changedAt : event.at }));
}

export function deriveCycle({
  operation,
  door,
  operationHistory,
  doorHistory,
  options,
  usable,
  now = Date.now(),
}: {
  operation: HassEntity | null;
  door: HassEntity | null;
  operationHistory: EntityHistoryState[];
  doorHistory: EntityHistoryState[];
  options: UseDishwasherOptions;
  usable: boolean;
  now?: number;
}): DishwasherCycle {
  const result: DishwasherCycle = {
    startedAt: null,
    completedAt: null,
    durationMs: null,
    doorOpenedAt: null,
    doorOpenedSinceCompletion: null,
    doorAccessStatus: "unknown",
  };
  const currentState = operationState(operation?.state, options.operationStates);
  if (!usable) return result;
  const operations = events(operationHistory, operation, now);
  let startedAt: number | null = null;
  let knownStart = false;
  let running = false;
  let previous: DishwasherOperationState = "unknown";
  for (const event of operations) {
    const state = operationState(event.state, options.operationStates);
    if (state === previous) continue;
    if (state === "running") {
      if (!running) {
        startedAt = event.at;
        knownStart = previous === "ready" || previous === "idle" || previous === "scheduled" || previous === "finished";
      }
      running = true;
    } else if (state === "finished" && running) {
      result.startedAt = knownStart ? startedAt : null;
      result.completedAt = event.at;
      result.durationMs = knownStart && startedAt != null ? event.at - startedAt : null;
      running = false;
    } else if (state !== "paused" && state !== "action-required") {
      running = false;
    }
    previous = state;
  }
  if (isActive(currentState)) {
    result.doorAccessStatus = "cycle-active";
    return result;
  }
  // Unknown current operation/door or a new cycle after completion invalidates a negative claim.
  if (result.completedAt == null || !["idle", "ready", "finished"].includes(currentState) || !available(operation) || !door) return result;
  const completedAt = result.completedAt;
  const newerRun = operations.some(
    (event) =>
      event.at > completedAt && ["running", "unknown", "unavailable"].includes(operationState(event.state, options.operationStates)),
  );
  if (newerRun) return result;
  const doors = events(doorHistory, door, now);
  // Negative evidence needs a known baseline at/before completion; a later observed opening is still positive evidence.
  const baseline = doors.filter((event) => event.at <= completedAt).pop();
  let previousDoor = doorState(baseline?.state, options.doorStates);
  let continuous = previousDoor === "closed" || previousDoor === "locked";
  for (const event of doors.filter((event) => event.at > completedAt)) {
    const state = doorState(event.state, options.doorStates);
    if (state === "open" && (previousDoor === "closed" || previousDoor === "locked")) {
      result.doorOpenedAt = event.at;
      result.doorOpenedSinceCompletion = true;
      result.doorAccessStatus = "door-opened";
      return result;
    }
    if (state === "unknown" || state === "unavailable") continuous = false;
    previousDoor = state;
  }
  if (continuous && ["closed", "locked"].includes(doorState(door.state, options.doorStates))) {
    result.doorOpenedSinceCompletion = false;
    result.doorAccessStatus = "awaiting-door-opening";
  }
  return result;
}
