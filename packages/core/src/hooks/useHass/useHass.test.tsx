import { TestWrapper, onReady, mocked, connection } from "@mocks/mockConnection";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useHass } from "@core";

describe("useHass", () => {
  beforeEach(() => {
    onReady.mockClear();
  });
  describe("callService", () => {
    it("should allow a user to call a service with camel case values", async () => {
      const { result } = renderHook(() => useHass(), {
        wrapper: TestWrapper,
      });
      await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
      act(() => {
        result.current.callService({
          domain: "mediaPlayer",
          service: "volumeSet",
          serviceData: {
            volume_level: 10,
          },
          target: "media_player.fake_player",
        });
      });

      expect(mocked.callService).toHaveBeenCalledWith(
        connection,
        "media_player",
        "volume_set",
        {
          volume_level: 10,
        },
        {
          entity_id: "media_player.fake_player",
        },
      );
    });

    it("should allow a user to call a service with snake case values", async () => {
      const { result } = renderHook(() => useHass(), {
        wrapper: TestWrapper,
      });
      await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
      act(() => {
        result.current.callService({
          domain: "media_player",
          service: "volume_set",
          serviceData: {
            volume_level: 10,
          },
          target: "media_player.fake_player",
        });
      });

      expect(mocked.callService).toHaveBeenCalledWith(
        connection,
        "media_player",
        "volume_set",
        {
          volume_level: 10,
        },
        {
          entity_id: "media_player.fake_player",
        },
      );
    });
  });

  describe("getAllEntities", () => {
    it("should retrieve all the entities", async () => {
      const { result } = renderHook(() => useHass(), {
        wrapper: TestWrapper,
      });
      await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
      const entities = result.current.getAllEntities();
      expect(entities).toMatchSnapshot();
    });
  });
});
