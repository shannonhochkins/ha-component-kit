import type { HassEntity } from "home-assistant-js-websocket";
import type { EntityHistoryState } from "../useHistory/history";
import { deriveCycle, doorState, finishTimestamp, numericValue, operationState, programOptions, remainingSeconds } from "./model";

const base = Date.parse("2026-10-20T00:00:00Z");
const time = (minute: number) => base + minute * 60000;
const history = (...states: [number, string][]): EntityHistoryState[] =>
  states.map(([minute, s]) => ({ s, lu: time(minute) / 1000, a: {} }));
const entity = (state: string, minute = 120, attributes = {}): HassEntity => ({
  entity_id: "sensor.fixture",
  state,
  attributes,
  last_changed: new Date(time(minute)).toISOString(),
  last_updated: new Date(time(minute)).toISOString(),
  context: { id: "fixture", parent_id: null, user_id: null },
});
const cycle = (
  operations = history([0, "ready"], [10, "run"], [100, "finished"]),
  doors = history([0, "closed"]),
  currentOperation = "finished",
  currentDoor = "closed",
) =>
  deriveCycle({
    operation: entity(currentOperation),
    door: entity(currentDoor),
    operationHistory: operations,
    doorHistory: doors,
    options: {},
    usable: true,
    now: time(130),
  });

it("reports a completed cycle with a continuously closed door, including its actual duration", () => {
  expect(cycle()).toEqual({
    startedAt: time(10),
    completedAt: time(100),
    durationMs: 90 * 60000,
    doorOpenedAt: null,
    doorOpenedSinceCompletion: false,
    unloadStatus: "awaiting-door-opening",
  });
});
it("retains an observed opening after the door closes again, without claiming unloading", () => {
  expect(cycle(undefined, history([0, "locked"], [110, "open"], [115, "closed"]))).toMatchObject({
    doorOpenedAt: time(110),
    doorOpenedSinceCompletion: true,
    unloadStatus: "door-opened",
  });
});
it("does not confuse an opening before completion with access after completion", () => {
  expect(cycle(undefined, history([0, "closed"], [50, "open"], [60, "closed"])).doorOpenedSinceCompletion).toBe(false);
  expect(cycle(undefined, history([0, "closed"], [90, "open"]), "finished", "open").unloadStatus).toBe("unknown");
});
it("reports unknown with missing history, a window beginning finished, or a ready transition without finished", () => {
  expect(cycle([], []).unloadStatus).toBe("unknown");
  expect(cycle(history([0, "finished"])).completedAt).toBeNull();
  expect(cycle(history([0, "run"], [100, "ready"]), undefined, "ready").completedAt).toBeNull();
  expect(cycle(undefined, []).doorOpenedSinceCompletion).toBeNull();
});
it("does not use power, an aborted cycle, a fault, or an unknown operation interval to infer completion", () => {
  for (const interrupted of ["unknown", "unavailable", "aborting", "error", "ready"]) {
    expect(cycle(history([0, "run"], [50, interrupted], [100, "finished"])).completedAt).toBeNull();
  }
});
it("preserves pauses, ignores duplicate/attribute updates, and sorts out-of-order samples", () => {
  const operations = history([100, "finished"], [0, "ready"], [10, "run"], [20, "run"], [30, "pause"], [40, "run"]);
  operations[0].lc = time(100) / 1000;
  expect(cycle(operations)).toMatchObject({ startedAt: time(10), completedAt: time(100), durationMs: 90 * 60000 });
});
it("does not invent a start time from an already-running history baseline", () => {
  expect(cycle(history([0, "run"], [100, "finished"]))).toMatchObject({ startedAt: null, completedAt: time(100), durationMs: null });
});
it("unknown/unavailable door intervals prevent negative claims, but later observed openings are useful evidence", () => {
  for (const gap of ["unknown", "unavailable"]) {
    expect(cycle(undefined, history([0, "closed"], [105, gap], [110, "closed"])).unloadStatus).toBe("unknown");
    expect(cycle(undefined, history([0, "closed"], [105, gap], [110, "closed"], [115, "open"]), "finished", "open").unloadStatus).toBe(
      "door-opened",
    );
  }
});
it("can observe a later opening without assuming an earlier missing door baseline", () => {
  expect(cycle(undefined, history([110, "closed"], [115, "open"]), "finished", "open").doorOpenedSinceCompletion).toBe(true);
  expect(cycle(undefined, history([110, "closed"])).doorOpenedSinceCompletion).toBeNull();
});
it("a second cycle replaces the prior cycle and a live running state supersedes unloading evidence", () => {
  const operations = history([0, "ready"], [10, "run"], [50, "finished"], [60, "run"], [100, "finished"]);
  expect(cycle(operations, history([0, "closed"], [55, "open"], [58, "closed"]))).toMatchObject({
    completedAt: time(100),
    doorOpenedSinceCompletion: false,
  });
  expect(cycle(undefined, undefined, "run").unloadStatus).toBe("cycle-active");
  expect(cycle(history([0, "run"], [50, "finished"], [60, "run"], [70, "ready"]), undefined, "ready").unloadStatus).toBe("unknown");
});
it("bridges live entity updates arriving before the Recorder stream", () => {
  expect(cycle(history([0, "ready"], [10, "run"]))).toMatchObject({ completedAt: time(120), doorOpenedSinceCompletion: false });
  expect(cycle(undefined, undefined, "finished", "open")).toMatchObject({ doorOpenedSinceCompletion: true, doorOpenedAt: time(120) });
});
it("ignores future/invalid history and exposes no evidence when disabled, loading or failed", () => {
  expect(cycle(history([0, "run"], [140, "finished"]), undefined, "unknown").completedAt).toBeNull();
  expect(
    deriveCycle({
      operation: entity("finished"),
      door: entity("closed"),
      operationHistory: history([0, "run"], [100, "finished"]),
      doorHistory: history([0, "closed"]),
      options: {},
      usable: false,
    }).unloadStatus,
  ).toBe("unknown");
});
it("supports explicit raw state mappings while preserving HA unknown/unavailable", () => {
  expect(operationState("washing", { washing: "running" })).toBe("running");
  expect(operationState("unknown", { unknown: "finished" })).toBe("unknown");
  expect(doorState("unavailable", { unavailable: "closed" })).toBe("unavailable");
  expect(doorState("off")).toBe("closed");
});
it("validates actual metrics and units, timestamp timezone and native program options", () => {
  expect(numericValue(entity(""))).toBeNull();
  expect(numericValue(entity("unavailable"))).toBeNull();
  expect(remainingSeconds(entity("30", 120, { unit_of_measurement: "min" }))).toBe(1800);
  expect(remainingSeconds(entity("30"))).toBeNull();
  expect(remainingSeconds(entity("-1", 120, { unit_of_measurement: "s" }))).toBeNull();
  expect(finishTimestamp(entity("2026-10-20T02:00:00Z"))).toBe(time(120));
  expect(finishTimestamp(entity("2026-10-20T02:00:00"))).toBeNull();
  expect(programOptions(entity("unknown", 120, { options: ["eco", "auto", "eco", 42] }))).toEqual(["eco", "auto"]);
  expect(programOptions(entity("unavailable", 120, { options: ["eco"] }))).toEqual([]);
});

it("uses last_changed for transitions with later attribute-update timestamps", () => {
  const operations = history([0, "ready"], [10, "run"], [100, "finished"]);
  operations[2].lc = time(90) / 1000;
  const doors = history([0, "closed"], [110, "open"]);
  doors[1].lc = time(85) / 1000;
  expect(cycle(operations, doors, "finished", "open")).toMatchObject({
    completedAt: time(90),
    durationMs: 80 * 60000,
    doorOpenedSinceCompletion: null,
  });
});
