import { TestWrapper, onReady, mocked, connection } from "@mocks/mockConnection";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useService } from "@core";

describe("useService", () => {
  beforeEach(() => {
    onReady.mockClear();
  });
  it("should return service object with passed entity id and call the service", async () => {
    const { result } = renderHook(() => useService("light", { entity_id: "light.kitchen" }), {
      wrapper: TestWrapper,
    });
    await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
    act(() => {
      result.current.turnOn({
        color_name: "red",
      });
    });

    expect(mocked.callService).toHaveBeenCalledWith(
      connection,
      "light",
      "turn_on",
      {
        color_name: "red",
      },
      {
        entity_id: "light.kitchen",
      },
    );
  });

  it("should return api domain object and then call the service with the matching entity & data", async () => {
    const { result } = renderHook(() => useService("light"), {
      wrapper: TestWrapper,
    });
    await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
    act(() => {
      result.current.toggle("light.kitchen", {
        transition: 10,
      });
    });

    expect(mocked.callService).toHaveBeenCalledWith(
      connection,
      "light",
      "toggle",
      {
        transition: 10,
      },
      {
        entity_id: "light.kitchen",
      },
    );
  });

  it("should return api function and then call the service with the matching entity & data", async () => {
    const { result } = renderHook(() => useService(), {
      wrapper: TestWrapper,
    });
    await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
    act(() => {
      result.current("light").turnOff("light.kitchen", {
        flash: "long",
      });
    });

    expect(mocked.callService).toHaveBeenCalledWith(
      connection,
      "light",
      "turn_off",
      {
        flash: "long",
      },
      {
        entity_id: "light.kitchen",
      },
    );
  });
});
