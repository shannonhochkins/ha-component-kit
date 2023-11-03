import { useMemo } from "react";
import { HassEntityWithService, ON } from "@core";

export const useLightBrightness = (entity: HassEntityWithService<"light">) => {
  return useMemo(
    () => (entity.state === ON ? Math.max(Math.round(((entity.attributes.brightness ?? 0) * 100) / 255), 1) : 0),
    [entity.attributes.brightness, entity.state],
  );
};
