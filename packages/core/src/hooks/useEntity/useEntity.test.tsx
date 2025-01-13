import { TestWrapper, onReady, mocked, connection } from "@mocks/mockConnection";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useEntity } from "@core";
import { omit } from "lodash";

describe("useEntity", () => {
  beforeEach(() => {
    onReady.mockClear();
  });
  it("should allow the entity to call a service directly from the entity object", async () => {
    // TODO - the first test in this describe block will fail as the authentication process is not complete
    // and the entity is not yet available. This is a problem with the test setup, not the code.
    renderHook(() => useEntity("light.ignore"), {
      wrapper: TestWrapper,
    });
    await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
    const { result } = renderHook(() => useEntity("light.fake_light_1"), {
      wrapper: TestWrapper,
    });
    await act(async () => {
      result.current.service.turnOn({
        serviceData: {
          color_name: "red",
        },
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
        entity_id: "light.fake_light_1",
      },
    );
  });

  it("should retrieve the entity object", async () => {
    const { result } = renderHook(() => useEntity("light.fake_light_1"), {
      wrapper: TestWrapper,
    });
    await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
    act(() => {
      // omitting the service object here as the serializer doesn't like proxy objects
      const timeBasedOmit = omit(result.current.custom, ["timeDiff", "relativeTime"]);
      expect({
        ...omit(result.current, "service", "last_changed", "last_updated", "custom"),
        custom: timeBasedOmit,
      }).toMatchSnapshot();
    });
  });

  it("should return null instead of throwing an error if returnNullIfNotFound is true", async () => {
    const { result } = renderHook(
      () =>
        useEntity("light.does_not_exist", {
          returnNullIfNotFound: true,
        }),
      {
        wrapper: TestWrapper,
      },
    );
    await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
    await act(async () => {
      expect(result.current).toEqual(null);
    });
  });

  it("should throw an error when provided with a entity name that does not exist", async () => {
    // purposely call once with null so we can authenticate properly
    renderHook(
      () =>
        useEntity("light.does_not_exist", {
          returnNullIfNotFound: true,
        }),
      {
        wrapper: TestWrapper,
      },
    );
    await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
    try {
      renderHook(() => useEntity("light.does_not_exist"), {
        wrapper: TestWrapper,
      });
      // force failure if it passes for some reason...
      expect(true).toBe(false);
    } catch (e) {
      expect((e as Error).message).toEqual("Entity light.does_not_exist not found");
    }
  });
});
