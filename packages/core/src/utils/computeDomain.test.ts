import { computeDomain } from "./computeDomain";

describe("computeDomain", () => {
  it("should convert to camel case", () => {
    expect(computeDomain("mediaPlayer.test")).toEqual("media_player");
    expect(computeDomain("persistentNotification.test")).toEqual("persistent_notification");
  });
  it("should leave values alone that dont need to be converted", () => {
    expect(computeDomain("light.test")).toEqual("light");
    expect(computeDomain("persistent_notification.test")).toEqual("persistent_notification");
  });

  it("should handle entity strings that have a period in the name", () => {
    expect(computeDomain("persistent_notification.something.with.periods")).toEqual("persistent_notification");
  });
});
