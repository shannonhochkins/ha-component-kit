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
