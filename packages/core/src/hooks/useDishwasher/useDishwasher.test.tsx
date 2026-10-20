import { act, renderHook, waitFor } from "@testing-library/react";
import type { Connection, HassEntity } from "home-assistant-js-websocket";
import { callService } from "home-assistant-js-websocket";
import { useDishwasher, useHass, type DishwasherEntities, type EntityHistoryState, type HistoryStreamMessage } from "@core";

jest.mock("home-assistant-js-websocket", () => ({ ...jest.requireActual("home-assistant-js-websocket"), callService: jest.fn() }));
const send = jest.mocked(callService);
const base = Date.parse("2026-10-20T00:00:00Z");
let clock: jest.SpyInstance;
const bindings: DishwasherEntities = {
  operationState: "sensor.wash_state",
  door: "sensor.wash_door",
  selectedProgram: "select.wash_selected",
  activeProgram: "select.wash_active",
  stop: "button.wash_stop",
  progress: "sensor.wash_progress",
  finishTime: "sensor.wash_finish",
  remainingTime: "sensor.wash_remaining",
  remoteStart: "binary_sensor.wash_remote",
  connectivity: "binary_sensor.wash_connected",
};
const streams = new Map<string, (message: HistoryStreamMessage) => void>();
const stops: jest.Mock[] = [];
const state = (entity_id: string, value: string, attributes = {}, minute = 120): HassEntity => ({
  entity_id,
  state: value,
  attributes,
  last_changed: new Date(base + minute * 60000).toISOString(),
  last_updated: new Date(base + minute * 60000).toISOString(),
  context: { id: "fixture", parent_id: null, user_id: null },
});
const samples = (...values: [number, string][]): EntityHistoryState[] =>
  values.map(([minute, s]) => ({ s, a: {}, lu: (base + minute * 60000) / 1000 }));
const emit = (id: string, samples: EntityHistoryState[]) => act(() => streams.get(id)!({ states: { [id]: samples } }));
const subscribe = async (callback: (message: HistoryStreamMessage) => void, message: { entity_ids: string[] }) => {
  streams.set(message.entity_ids[0], callback);
  const stop = jest.fn(async () => {});
  stops.push(stop);
  return stop;
};
const connection = { connected: true, subscribeMessage: jest.fn(subscribe) } as unknown as Connection;

beforeEach(() => {
  clock = jest.spyOn(Date, "now").mockReturnValue(base + 3 * 60 * 60000);
  streams.clear();
  stops.length = 0;
  jest.clearAllMocks();
  const entities = Object.fromEntries(
    [
      state("sensor.wash_state", "finished"),
      state("sensor.wash_door", "closed"),
      state("select.wash_selected", "eco", { options: ["eco", "auto"] }),
      state("select.wash_active", "unknown", { options: ["eco", "auto"] }),
      state("button.wash_stop", "unknown"),
      state("sensor.wash_progress", "75", { unit_of_measurement: "%" }),
      state("sensor.wash_finish", "2026-10-20T03:00:00Z"),
      state("sensor.wash_remaining", "20", { unit_of_measurement: "min" }),
      state("binary_sensor.wash_remote", "on"),
      state("binary_sensor.wash_connected", "on"),
    ].map((entity) => [entity.entity_id, entity]),
  );
  useHass.setState({
    connection,
    ready: true,
    connectionStatus: "connected",
    entities,
    entitiesRegistry: Object.fromEntries(
      Object.keys(entities).map((id) => [id, { entity_id: id, device_id: "dishwasher", disabled_by: null }]),
    ) as never,
  });
  send.mockResolvedValue({ context: {} } as never);
});
afterEach(() => {
  clock.mockRestore();
  useHass.setState({ connection: null, ready: false, entities: {}, entitiesRegistry: {} });
});

it("composes two native history streams, derives completion and responds to live door updates", async () => {
  const { result } = renderHook(() => useDishwasher(bindings));
  expect(result.current.history.loading).toBe(true);
  expect(result.current.cycle.doorAccessStatus).toBe("unknown");
  expect(streams.size).toBe(2);
  emit(bindings.operationState, samples([0, "ready"], [10, "run"], [100, "finished"]));
  emit(bindings.door!, samples([0, "closed"]));
  await waitFor(() => expect(result.current.cycle.doorAccessStatus).toBe("awaiting-door-opening"));
  expect(result.current.cycle.completedAt).toBe(base + 100 * 60000);
  act(() =>
    useHass.setState(({ entities }) => ({ entities: { ...entities, "sensor.wash_door": state("sensor.wash_door", "open", {}, 125) } })),
  );
  expect(result.current.cycle.doorAccessStatus).toBe("door-opened");
  expect(result.current.issues).toEqual([]);
});
it("retains native generated service types and acknowledges only after transport completion", async () => {
  const { result } = renderHook(() => useDishwasher(bindings, { history: { disable: true } }));
  let finish!: (response: unknown) => void;
  send.mockReturnValue(
    new Promise((resolve) => {
      finish = resolve;
    }),
  );
  let settled = false;
  const acknowledgement: Promise<void> = result.current.entities.selectedProgram!.service.selectOption({ serviceData: { option: "auto" } });
  const request = acknowledgement.then(() => {
    settled = true;
  });
  await Promise.resolve();
  expect(settled).toBe(false);
  expect(send).toHaveBeenCalledWith(
    connection,
    "select",
    "select_option",
    { option: "auto" },
    { entity_id: "select.wash_selected" },
    undefined,
  );
  await act(async () => {
    finish({ context: {} });
    await request;
  });
  expect(settled).toBe(true);
  send.mockRejectedValueOnce(new Error("Denied"));
  await expect(result.current.entities.stop!.service.press()).rejects.toThrow("Denied");
  expect(result.current.operationState).toBe("finished");
  expect(streams.size).toBe(0);
});
it("includes only explicitly bound, existing entities from the expected device", () => {
  useHass.setState(({ entitiesRegistry }) => ({
    entitiesRegistry: {
      ...entitiesRegistry,
      "select.wash_selected": { ...entitiesRegistry["select.wash_selected"], device_id: "other" },
      "button.wash_stop": { ...entitiesRegistry["button.wash_stop"], disabled_by: "user" },
    } as never,
  }));
  const { result } = renderHook(() => useDishwasher({ ...bindings, saltLow: "binary_sensor.missing" }, { history: { disable: true } }));
  expect(result.current.entities.selectedProgram).toBeNull();
  expect(result.current.entities.stop).toBeNull();
  expect(result.current.entities.saltLow).toBeNull();
  expect(result.current.issues).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ role: "selectedProgram", reason: "different-device" }),
      expect.objectContaining({ role: "stop", reason: "disabled" }),
      expect.objectContaining({ role: "saltLow", reason: "unverified-device" }),
    ]),
  );
});
it("keeps unregistered explicit bindings readable, but rejects an unverified explicit device constraint", () => {
  useHass.setState({ entitiesRegistry: {} });
  const { result, rerender } = renderHook(
    ({ deviceId }: { deviceId?: string }) => useDishwasher(bindings, { deviceId, history: { disable: true } }),
    { initialProps: { deviceId: undefined } as { deviceId?: string } },
  );
  expect(result.current.entities.operationState?.state).toBe("finished");
  rerender({ deviceId: "expected" });
  expect(result.current.entities.operationState).toBeNull();
  expect(result.current.availability).toBe("missing");
});
it("keeps reported active metrics separate from stale idle measurements and validates availability", () => {
  const { result } = renderHook(() => useDishwasher(bindings, { history: { disable: true } }));
  expect(result.current.progressPercent).toBeNull();
  expect(result.current.estimatedFinishAt).toBeNull();
  act(() =>
    useHass.setState(({ entities }) => ({
      entities: {
        ...entities,
        "sensor.wash_state": state("sensor.wash_state", "run"),
        "select.wash_active": state("select.wash_active", "eco"),
      },
    })),
  );
  expect(result.current.isRunning).toBe(true);
  expect(result.current.progressPercent).toBe(75);
  expect(result.current.remainingSeconds).toBe(1200);
  expect(result.current.estimatedFinishAt).toBe(Date.parse("2026-10-20T03:00:00Z"));
  act(() =>
    useHass.setState(({ entities }) => ({
      entities: { ...entities, "binary_sensor.wash_connected": state("binary_sensor.wash_connected", "off") },
    })),
  );
  expect(result.current.availability).toBe("unavailable");
  expect(result.current.progressPercent).toBeNull();
  expect(result.current.programs.selectedOptions).toEqual([]);
  act(() => useHass.setState({ connection: null, ready: false }));
  expect(result.current.availability).toBe("disconnected");
  expect(result.current.isRunning).toBe(false);
});
it("propagates Recorder failures and recovers without leaking evidence or subscriptions across source changes", async () => {
  const fail = jest.spyOn(connection, "subscribeMessage").mockRejectedValueOnce(new Error("Recorder denied"));
  const { result, rerender, unmount } = renderHook(({ value }) => useDishwasher(value), { initialProps: { value: bindings } });
  await waitFor(() => expect(result.current.history.error?.message).toBe("Recorder denied"));
  expect(result.current.cycle.doorAccessStatus).toBe("unknown");
  fail.mockReset();
  fail.mockImplementation(subscribe as never);
  const other = { operationState: "sensor.other_state", door: "binary_sensor.other_door" } as const;
  act(() =>
    useHass.setState(({ entities, entitiesRegistry }) => ({
      entities: {
        ...entities,
        "sensor.other_state": state("sensor.other_state", "ready"),
        "binary_sensor.other_door": state("binary_sensor.other_door", "off"),
      },
      entitiesRegistry: {
        ...entitiesRegistry,
        "sensor.other_state": { entity_id: "sensor.other_state", device_id: "other" },
        "binary_sensor.other_door": { entity_id: "binary_sensor.other_door", device_id: "other" },
      } as never,
    })),
  );
  rerender({ value: other });
  expect(result.current.history.error).toBeNull();
  expect(result.current.cycle.completedAt).toBeNull();
  emit(other.operationState, samples([0, "ready"]));
  emit(other.door, samples([0, "off"]));
  await waitFor(() => expect(result.current.history.loading).toBe(false));
  unmount();
  await waitFor(() => expect(stops.every((stop) => stop.mock.calls.length === 1)).toBe(true));
});

it("reacts to native disconnected status even when cached entities and connection remain", () => {
  const { result } = renderHook(() => useDishwasher(bindings, { history: { disable: true } }));
  act(() => useHass.setState({ connectionStatus: "disconnected" }));
  expect(result.current.availability).toBe("disconnected");
  expect(result.current.remoteStartEnabled).toBeNull();
});
