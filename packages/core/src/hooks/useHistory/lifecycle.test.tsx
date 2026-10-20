import { act, renderHook, waitFor } from "@testing-library/react";
import { useHass, useHistory } from "@core";
import { subscribeHistory } from "./history";
import type { Connection } from "home-assistant-js-websocket";
jest.mock("./history", () => ({ ...jest.requireActual("./history"), subscribeHistory: jest.fn() }));
const subscribe = jest.mocked(subscribeHistory);
beforeEach(() => {
  subscribe.mockReset();
  useHass.setState({ connection: {} as Connection });
});
it("exposes subscription errors and clears them for a new connection", async () => {
  subscribe.mockRejectedValueOnce(new Error("Recorder unavailable"));
  const { result } = renderHook(() => useHistory("sensor.fixture"));
  await waitFor(() => expect(result.current.error?.message).toBe("Recorder unavailable"));
  expect(result.current.loading).toBe(false);
  subscribe.mockImplementationOnce(() => new Promise(() => {}));
  act(() => useHass.setState({ connection: {} as Connection }));
  await waitFor(() => expect(result.current.error).toBe(null));
  expect(result.current.loading).toBe(true);
});
it("releases a subscription that finishes opening after unmount", async () => {
  let finish!: (stop: () => Promise<void>) => void;
  subscribe.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  const { unmount } = renderHook(() => useHistory("sensor.fixture"));
  unmount();
  const stop = jest.fn(async () => {});
  await act(async () => {
    finish(stop);
    await Promise.resolve();
  });
  expect(stop).toHaveBeenCalledTimes(1);
});

it("keeps inline limits stable across renders and applies changed limit values", async () => {
  const stop = jest.fn(async () => {});
  const states = {
    "sensor.fixture": [{ s: "50", a: {}, lu: Date.now() / 1000 - 600 }],
  };
  useHass.setState({
    entities: {
      "sensor.fixture": {
        entity_id: "sensor.fixture",
        state: "50",
        attributes: {},
        last_changed: new Date().toISOString(),
        last_updated: new Date().toISOString(),
        context: { id: "fixture", parent_id: null, user_id: null },
      },
    },
  });
  subscribe.mockImplementation(async ({ callbackFunction }) => {
    callbackFunction(states);
    return stop;
  });
  let renders = 0;
  const { result, rerender, unmount } = renderHook(
    ({ min, max }) => {
      // Bound a regression so a render loop fails promptly rather than hanging Jest.
      if (++renders > 20) throw new Error("Inline limits caused a render loop");
      return useHistory("sensor.fixture", { limits: { min, max }, forceNumeric: true });
    },
    { initialProps: { min: 0, max: 100 } },
  );
  await waitFor(() => expect(result.current.loading).toBe(false));
  const initialHistory = result.current;
  expect(initialHistory.coordinates.length).toBeGreaterThan(0);
  await act(async () => rerender({ min: 0, max: 100 }));
  expect(subscribe).toHaveBeenCalledTimes(1);
  expect(stop).not.toHaveBeenCalled();
  expect(result.current).toBe(initialHistory);

  await act(async () => rerender({ min: 0, max: 200 }));
  expect(result.current.coordinates).not.toEqual(initialHistory.coordinates);
  expect(subscribe).toHaveBeenCalledTimes(2);
  expect(stop).toHaveBeenCalledTimes(1);
  const expandedCoordinates = result.current.coordinates;
  await act(async () => rerender({ min: 25, max: 200 }));
  expect(result.current.coordinates).not.toEqual(expandedCoordinates);
  expect(subscribe).toHaveBeenCalledTimes(3);
  expect(stop).toHaveBeenCalledTimes(2);
  unmount();
  expect(stop).toHaveBeenCalledTimes(3);
});
