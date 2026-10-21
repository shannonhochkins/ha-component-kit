import { act, renderHook } from "@testing-library/react";
import { useHass, useService, useEntity } from "@core";
import { callService } from "home-assistant-js-websocket";
import type { Connection } from "home-assistant-js-websocket";
jest.mock("home-assistant-js-websocket", () => ({ ...jest.requireActual("home-assistant-js-websocket"), callService: jest.fn() }));
const send = jest.mocked(callService);
const connection = {} as Connection;
beforeEach(() => {
  send.mockReset();
  useHass.setState({ connection, ready: true });
});
it("awaits the ordinary acknowledgement without requesting service response data", async () => {
  let resolve!: (value: unknown) => void;
  send.mockReturnValue(
    new Promise((done) => {
      resolve = done;
    }),
  );
  const { result } = renderHook(() => useService("light", "light.kitchen"));
  let settled = false;
  const request = result.current.turnOn().then(() => {
    settled = true;
  });
  await Promise.resolve();
  expect(settled).toBe(false);
  expect(send).toHaveBeenCalledWith(connection, "light", "turn_on", {}, { entity_id: "light.kitchen" }, undefined);
  await act(async () => {
    resolve({ context: {} });
    await request;
  });
  expect(settled).toBe(true);
});
it("propagates ordinary service failures with explicit targets", async () => {
  send.mockRejectedValue(new Error("Permission denied"));
  const { result } = renderHook(() => useService("light"));
  await expect(result.current.turnOff({ target: "light.kitchen" })).rejects.toThrow("Permission denied");
});
it("preserves response data only when requested", async () => {
  const response = { context: {}, response: { answer: 42 } };
  send.mockResolvedValue(response);
  const { result } = renderHook(() => useService("light"));
  await expect(result.current.turnOn({ target: "light.kitchen", returnResponse: true })).resolves.toBe(response);
  expect(send.mock.calls[0][5]).toBe(true);
});
it("rejects disconnected calls rather than silently succeeding", async () => {
  useHass.setState({ connection: null, ready: false });
  const { result } = renderHook(() => useService("light"));
  await expect(result.current.turnOff({ target: "light.kitchen" })).rejects.toThrow("connection not established");
  expect(send).not.toHaveBeenCalled();
});

it("rejects an offline retained connection even when cached entities are ready", async () => {
  useHass.setState({ connection: { connected: false } as Connection, ready: true });
  const { result } = renderHook(() => useService("light"));
  await expect(result.current.turnOff({ target: "light.kitchen" })).rejects.toThrow("connection not established");
  expect(send).not.toHaveBeenCalled();
});
it("passes explicit false and generated payload fields without requesting a response", async () => {
  send.mockResolvedValue({ context: {} } as never);
  const { result } = renderHook(() => useService("light"));
  await expect(
    result.current.turnOn({ target: "light.kitchen", serviceData: { brightness_pct: 50 }, returnResponse: false }),
  ).resolves.toBeUndefined();
  expect(send).toHaveBeenCalledWith(connection, "light", "turn_on", { brightness_pct: 50 }, { entity_id: "light.kitchen" }, false);
});

it("returns the acknowledgement through entity-service access", async () => {
  send.mockResolvedValue({ context: {} } as never);
  useHass.setState({
    entities: {
      "light.kitchen": {
        entity_id: "light.kitchen",
        state: "on",
        attributes: { friendly_name: "Kitchen" },
        last_changed: new Date().toISOString(),
        last_updated: new Date().toISOString(),
        context: { id: "test", parent_id: null, user_id: null },
      },
    },
  });
  const { result } = renderHook(() => useEntity("light.kitchen", { historyOptions: { disable: true } }));
  await expect(result.current.service.turnOff()).resolves.toBeUndefined();
  expect(send).toHaveBeenCalledWith(connection, "light", "turn_off", {}, { entity_id: "light.kitchen" }, undefined);
});
