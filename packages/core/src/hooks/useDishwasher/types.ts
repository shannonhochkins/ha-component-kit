import type { EntityName, FilterByDomain } from "@typings";
import type { UseEntityReturnType } from "../useEntity";

/** Bind actual entities. No suffix, model or integration-name discovery is performed. */
export interface DishwasherEntities {
  /** Entity reporting the actual operating state, rather than power consumption. */
  operationState: FilterByDomain<EntityName, "sensor" | "input_select">;
  /** Door sensor: open/on, closed/off or locked by default. */
  door?: FilterByDomain<EntityName, "sensor" | "binary_sensor">;
  /** Select for a chosen program; selecting it need not start a cycle. */
  selectedProgram?: FilterByDomain<EntityName, "select">;
  /** Active-program select. Writing to it can start a cycle in some integrations. */
  activeProgram?: FilterByDomain<EntityName, "select">;
  /** Explicit start button provided by the integration, if available. */
  start?: FilterByDomain<EntityName, "button">;
  /** Explicit stop button provided by the integration, if available. */
  stop?: FilterByDomain<EntityName, "button">;
  /** Power switch. Its state is never used to infer a running or finished cycle. */
  power?: FilterByDomain<EntityName, "switch">;
  /** Binary sensor whose on state reports remote-control permission. */
  remoteControl?: FilterByDomain<EntityName, "binary_sensor">;
  /** Binary sensor whose on state reports remote-start permission. */
  remoteStart?: FilterByDomain<EntityName, "binary_sensor">;
  /** Binary sensor whose on state reports appliance connectivity. */
  connectivity?: FilterByDomain<EntityName, "binary_sensor">;
  /** Reported cycle progress, with a % unit and value from 0 to 100. */
  progress?: FilterByDomain<EntityName, "sensor">;
  /** Reported estimated finish as an absolute timestamp with a timezone. */
  finishTime?: FilterByDomain<EntityName, "sensor">;
  /** Reported remaining duration with a unit of s, min or h. */
  remainingTime?: FilterByDomain<EntityName, "sensor">;
  /** Binary sensor whose on state means dishwasher salt needs replenishing. */
  saltLow?: FilterByDomain<EntityName, "binary_sensor">;
  /** Binary sensor whose on state means rinse aid needs replenishing. */
  rinseAidLow?: FilterByDomain<EntityName, "binary_sensor">;
}

export type DishwasherOperationState =
  | "idle"
  | "ready"
  | "scheduled"
  | "running"
  | "paused"
  | "action-required"
  | "finished"
  | "error"
  | "aborting"
  | "unknown"
  | "unavailable";
export type DishwasherDoorState = "open" | "closed" | "locked" | "unknown" | "unavailable";

export interface UseDishwasherOptions {
  /** Optional expected registry device. Mismatched/disabled bindings are excluded. */
  deviceId?: string;
  /** Raw state overrides, merged with HA Home Connect defaults. Unknown/unavailable cannot be remapped. */
  operationStates?: Readonly<Record<string, DishwasherOperationState>>;
  /** Defaults: open/on, closed/off, locked. */
  doorStates?: Readonly<Record<string, DishwasherDoorState>>;
  /** Recorder must include both operation and door entities. No browser persistence is used. */
  history?: { hoursToShow?: number; disable?: boolean };
}

export interface DishwasherBindingIssue {
  /** Configured capability whose entity could not be used. */
  role: keyof DishwasherEntities;
  /** The explicitly configured entity ID; no replacement is selected. */
  entityId: EntityName;
  /** Missing entity, disabled registry entry, mismatched device or unverifiable device constraint. */
  reason: "missing" | "disabled" | "different-device" | "unverified-device";
}

/** Timestamps are Unix milliseconds. Evidence concerns access to dishes, never proof of unloading. */
export interface DishwasherCycle {
  /** Observed start of the latest completed cycle, in Unix milliseconds. Null for an already-running baseline or missing start. */
  startedAt: number | null;
  /** Latest observed running → finished transition, in Unix milliseconds. Null when no completion was established in the history window. */
  completedAt: number | null;
  /** Milliseconds between observed start and completion, including pauses. Null when either timestamp is unknown. */
  durationMs: number | null;
  /** First observed closed/locked → open transition after completion, in Unix milliseconds. Null when no subsequent opening was established. */
  doorOpenedAt: number | null;
  /** True for an observed opening, false for a continuously known closed/locked door since completion, or null for insufficient evidence. Never proves unloading. */
  doorOpenedSinceCompletion: boolean | null;
  /** History-backed cycle/door-access evidence. A new active cycle supersedes prior access evidence; unknown covers unusable history. Never means confirmed empty/full. */
  doorAccessStatus: "cycle-active" | "awaiting-door-opening" | "door-opened" | "unknown";
}

/** Native useEntity results for every role, preserving generated domain-specific service types. */
export type DishwasherBoundEntities = {
  [Role in keyof DishwasherEntities]-?: UseEntityReturnType<NonNullable<DishwasherEntities[Role]>, { returnNullIfNotFound: true }>;
};

/** Program keys and options reported by the configured select entities, without invented labels or capabilities. */
export interface DishwasherPrograms {
  /** Selected program's raw HA state, or null when its source or appliance is unavailable/unknown. */
  selected: string | null;
  /** Active program's raw HA state during an active cycle, otherwise null. */
  active: string | null;
  /** Actual selected-program options; empty when the source is missing or unavailable. Never substituted from activeOptions. */
  selectedOptions: string[];
  /** Actual active-program options; empty when the source is missing or unavailable. Options can exist while its idle state is unknown. */
  activeOptions: string[];
}

/** Status of the native operation/door Recorder subscriptions. */
export interface DishwasherHistory {
  /** Whether history is opted in. True does not guarantee connection, Recorder coverage or recorded events. */
  enabled: boolean;
  /** Requested lookback in hours; defaults to 168 (seven days). Recorder retention can limit available data. */
  hoursToShow: number;
  /** Whether a bound native history is loading. False also applies to disabled/missing sources; inspect availability and error. */
  loading: boolean;
  /** Native Recorder subscription failure, or null. A null error does not establish complete recording coverage. */
  error: Error | null;
}
