import { useEntity } from "../useEntity";
import { useHass } from "../useHass";
import { isEntityRegistryEntryDisabled } from "../../utils/entity_registry_state";
import type { EntityName } from "@typings";
import type { HistoryOptions } from "../useHistory";
import type { DishwasherBindingIssue, DishwasherEntities, UseDishwasherOptions } from "./types";
import {
  available,
  binaryValue,
  deriveCycle,
  doorState,
  finishTimestamp,
  isActive,
  numericValue,
  operationState,
  programOptions,
  remainingSeconds,
} from "./model";
export type * from "./types";

// Called in a fixed order, including absent optional bindings: never subscribe to a guessed entity.
function useBoundEntity<E extends EntityName>(
  id: E | undefined,
  role: keyof DishwasherEntities,
  deviceId: string | undefined,
  historyOptions?: HistoryOptions,
) {
  const entry = useHass((state) => (id ? state.entitiesRegistry[id] : undefined));
  const reason: DishwasherBindingIssue["reason"] | undefined =
    entry && isEntityRegistryEntryDisabled(entry)
      ? "disabled"
      : deviceId && !entry?.device_id
        ? "unverified-device"
        : deviceId && entry?.device_id !== deviceId
          ? "different-device"
          : undefined;
  const entity = useEntity(id && !reason ? id : "unknown", {
    returnNullIfNotFound: true,
    historyOptions: { ...historyOptions, disable: !id || !!reason || (historyOptions?.disable ?? true) },
  });
  const issue: DishwasherBindingIssue | null = id && (reason || !entity) ? { role, entityId: id, reason: reason ?? "missing" } : null;
  return { entity, issue };
}

/**
 * Composes native entities/services and Recorder history for an explicitly bound dishwasher.
 * No discovery, writes, retries, power-based cycle detection, or background persistence.
 */
export function useDishwasher(bindings: DishwasherEntities, options: UseDishwasherOptions = {}) {
  const registryDeviceId = useHass((state) => state.entitiesRegistry[bindings.operationState]?.device_id);
  const ready = useHass((state) => state.ready);
  const hasConnection = useHass((state) => !!state.connection && state.connection.connected !== false);
  const connectionStatus = useHass((state) => state.connectionStatus);
  const deviceId = options.deviceId ?? registryDeviceId ?? undefined;
  const connected = hasConnection && ready && !["disconnected", "suspended"].includes(connectionStatus);
  const hoursToShow = options.history?.hoursToShow ?? 168;
  if (!Number.isFinite(hoursToShow) || hoursToShow <= 0)
    throw new Error("useDishwasher history.hoursToShow must be a positive finite number");
  const historyEnabled = !options.history?.disable;
  const historyOptions: HistoryOptions = {
    hoursToShow,
    disable: !historyEnabled || !connected,
    significantChangesOnly: false,
    minimalResponse: true,
  };
  const operation = useBoundEntity(bindings.operationState, "operationState", deviceId, historyOptions);
  const door = useBoundEntity(bindings.door, "door", deviceId, historyOptions);
  const selectedProgram = useBoundEntity(bindings.selectedProgram, "selectedProgram", deviceId);
  const activeProgram = useBoundEntity(bindings.activeProgram, "activeProgram", deviceId);
  const start = useBoundEntity(bindings.start, "start", deviceId);
  const stop = useBoundEntity(bindings.stop, "stop", deviceId);
  const power = useBoundEntity(bindings.power, "power", deviceId);
  const remoteControl = useBoundEntity(bindings.remoteControl, "remoteControl", deviceId);
  const remoteStart = useBoundEntity(bindings.remoteStart, "remoteStart", deviceId);
  const connectivity = useBoundEntity(bindings.connectivity, "connectivity", deviceId);
  const progress = useBoundEntity(bindings.progress, "progress", deviceId);
  const finishTime = useBoundEntity(bindings.finishTime, "finishTime", deviceId);
  const remainingTime = useBoundEntity(bindings.remainingTime, "remainingTime", deviceId);
  const saltLow = useBoundEntity(bindings.saltLow, "saltLow", deviceId);
  const rinseAidLow = useBoundEntity(bindings.rinseAidLow, "rinseAidLow", deviceId);
  const roleResults = {
    operationState: operation,
    door,
    selectedProgram,
    activeProgram,
    start,
    stop,
    power,
    remoteControl,
    remoteStart,
    connectivity,
    progress,
    finishTime,
    remainingTime,
    saltLow,
    rinseAidLow,
  };
  const issues: DishwasherBindingIssue[] = Object.values(roleResults).flatMap(({ issue }) => (issue ? [issue] : []));
  const applianceConnected = bindings.connectivity ? binaryValue(connectivity.entity) : true;
  const state = operationState(operation.entity?.state, options.operationStates);
  const availability = !connected
    ? ("disconnected" as const)
    : !operation.entity
      ? ("missing" as const)
      : state === "unavailable" || applianceConnected === false
        ? ("unavailable" as const)
        : state === "unknown" || applianceConnected === null
          ? ("unknown" as const)
          : ("available" as const);
  const isAvailable = availability === "available";
  const active = isAvailable && isActive(state);
  const operationHistory = operation.entity?.history;
  const doorHistory = door.entity?.history;
  const historyLoading = historyEnabled && (operationHistory?.loading === true || (!!bindings.door && doorHistory?.loading === true));
  const historyError = operationHistory?.error ?? doorHistory?.error ?? null;
  const cycle = deriveCycle({
    operation: operation.entity,
    door: door.entity,
    operationHistory: operationHistory?.entityHistory ?? [],
    doorHistory: doorHistory?.entityHistory ?? [],
    options,
    usable: isAvailable && historyEnabled && !historyLoading && !historyError,
  });
  const progressValue = numericValue(progress.entity);
  return {
    deviceId: deviceId ?? null,
    availability,
    state,
    doorState: isAvailable ? doorState(door.entity?.state, options.doorStates) : ("unknown" as const),
    isRunning: isAvailable && state === "running",
    isPaused: isAvailable && state === "paused",
    isFinished: isAvailable && state === "finished",
    progressPercent:
      active &&
      progress.entity?.attributes.unit_of_measurement === "%" &&
      progressValue != null &&
      progressValue >= 0 &&
      progressValue <= 100
        ? progressValue
        : null,
    estimatedFinish: active ? finishTimestamp(finishTime.entity) : null,
    remainingSeconds: active ? remainingSeconds(remainingTime.entity) : null,
    programs: {
      selected: isAvailable && available(selectedProgram.entity) ? selectedProgram.entity!.state : null,
      active: active && available(activeProgram.entity) ? activeProgram.entity!.state : null,
      selectedOptions: isAvailable ? programOptions(selectedProgram.entity) : [],
      activeOptions: isAvailable ? programOptions(activeProgram.entity) : [],
    },
    remoteControlEnabled: isAvailable ? binaryValue(remoteControl.entity) : null,
    remoteStartEnabled: isAvailable ? binaryValue(remoteStart.entity) : null,
    saltLow: isAvailable ? binaryValue(saltLow.entity) : null,
    rinseAidLow: isAvailable ? binaryValue(rinseAidLow.entity) : null,
    cycle,
    history: { enabled: historyEnabled, hoursToShow, loading: !!historyLoading, error: historyError },
    issues,
    /** Native entities retain typed .service methods and .history, without inventing integration-specific actions. */
    entities: {
      operationState: operation.entity,
      door: door.entity,
      selectedProgram: selectedProgram.entity,
      activeProgram: activeProgram.entity,
      start: start.entity,
      stop: stop.entity,
      power: power.entity,
      remoteControl: remoteControl.entity,
      remoteStart: remoteStart.entity,
      connectivity: connectivity.entity,
      progress: progress.entity,
      finishTime: finishTime.entity,
      remainingTime: remainingTime.entity,
      saltLow: saltLow.entity,
      rinseAidLow: rinseAidLow.entity,
    },
  };
}

export type UseDishwasherReturn = ReturnType<typeof useDishwasher>;
