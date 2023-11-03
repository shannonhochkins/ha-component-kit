import { useMemo } from "react";
import { LIGHT_COLOR_MODES, HassEntityWithService, ON } from "@core";

export const useLightTemperature = (entity: HassEntityWithService<"light">) => {
  return useMemo(() => {
    if (entity.state === ON) {
      return entity.attributes.color_mode === LIGHT_COLOR_MODES.COLOR_TEMP ? (entity.attributes.color_temp_kelvin as number) : undefined;
    } else {
      return undefined;
    }
  }, [entity.state, entity.attributes.color_mode, entity.attributes.color_temp_kelvin]);
};
