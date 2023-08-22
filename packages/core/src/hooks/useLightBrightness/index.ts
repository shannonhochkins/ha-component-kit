import { useMemo } from "react";
import { HassEntityWithApi, ON } from "@core";

export const useLightBrightness = (entity: HassEntityWithApi<"light">) => {
  return useMemo(
    () =>
      entity.state === ON
        ? Math.max(
            Math.round(((entity.attributes.brightness ?? 0) * 100) / 255),
            1,
          )
        : 0,
    [entity.attributes.brightness, entity.state],
  );
};
