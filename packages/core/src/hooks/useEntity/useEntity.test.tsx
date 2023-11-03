import { TestWrapper, onReady, mocked, connection } from "@mocks/mockConnection";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useEntity } from "@core";
import { omit } from "lodash";

describe("useEntity", () => {
  beforeEach(() => {
    onReady.mockClear();
  });
  it("should allow the entity to call a service directly from the entity object", async () => {
    const { result } = renderHook(() => useEntity("light.fake_light_1"), {
      wrapper: TestWrapper,
    });
    await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
    act(() => {
      result.current.service.turnOn({
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
      // omitting the api object here as the serializer doesn't like proxy objects
      expect(omit(result.current, "api", "last_changed", "last_updated")).toMatchSnapshot();
    });
  });

  it("should throw an error when provided with a entity name that does not exist", async () => {
    await act(async () => {
      await renderHook(
        async () => {
          await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
          expect(useEntity("light.does_not_exist")).toThrowError("Entity light.does_not_exist not found");
        },
        {
          wrapper: TestWrapper,
        },
      );
    });
  });

  it("should return null instead of throwing an error if returnNullIfNotFound is true", async () => {
    await act(async () => {
      await renderHook(
        async () => {
          await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
          expect(
            useEntity("light.does_not_exist", {
              returnNullIfNotFound: true,
            }),
          ).toEqual(null);
        },
        {
          wrapper: TestWrapper,
        },
      );
    });
  });
});
