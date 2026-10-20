import type { EntityName, FilterByDomain } from "@typings";

/** Bind actual entities. No suffix, model or integration-name discovery is performed. */
export interface DishwasherEntities {
  operationState: FilterByDomain<EntityName, "sensor" | "input_select">;
  door?: FilterByDomain<EntityName, "sensor" | "binary_sensor">;
  selectedProgram?: FilterByDomain<EntityName, "select">;
  activeProgram?: FilterByDomain<EntityName, "select">;
  start?: FilterByDomain<EntityName, "button">;
  stop?: FilterByDomain<EntityName, "button">;
  power?: FilterByDomain<EntityName, "switch">;
  remoteControl?: FilterByDomain<EntityName, "binary_sensor">;
  remoteStart?: FilterByDomain<EntityName, "binary_sensor">;
  connectivity?: FilterByDomain<EntityName, "binary_sensor">;
  progress?: FilterByDomain<EntityName, "sensor">;
  finishTime?: FilterByDomain<EntityName, "sensor">;
  remainingTime?: FilterByDomain<EntityName, "sensor">;
  saltLow?: FilterByDomain<EntityName, "binary_sensor">;
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
  role: keyof DishwasherEntities;
  entityId: EntityName;
  reason: "missing" | "disabled" | "different-device" | "unverified-device";
}

/** Timestamps are Unix milliseconds. Evidence concerns access to dishes, never proof of unloading. */
export interface DishwasherCycle {
  /** Most recent observed running → finished cycle within the requested history. */
  startedAt: number | null;
  completedAt: number | null;
  /** Only known when the start transition, rather than a running baseline, was observed. */
  durationMs: number | null;
  doorOpenedAt: number | null;
  /** Null for missing/incomplete/failed history or an uncertain door interval. */
  doorOpenedSinceCompletion: boolean | null;
  /** A new active cycle supersedes the previous cycle's unloading evidence. */
  unloadStatus: "cycle-active" | "awaiting-door-opening" | "door-opened" | "unknown";
}
