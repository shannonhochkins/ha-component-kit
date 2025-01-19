import { useMemo } from "react";
import { HassEntityWithAction, ON } from "@core";

export const useLightBrightness = (entity: HassEntityWithAction<"light">) => {
  return useMemo(
    () => (entity.state === ON ? Math.max(Math.round(((entity.attributes.brightness ?? 0) * 100) / 255), 1) : 0),
    [entity.attributes.brightness, entity.state],
  );
};
