import { useMemo } from "react";
import { useStore } from "@core";
import { HassEntity } from "home-assistant-js-websocket";
import { useShallow } from "zustand/shallow";

export interface LowDevicesOptions {
  /** The minimum battery percentage to retrieve @default 0 */
  min?: number;
  /** The maximum battery percentage to retrieve @default 20 */
  max?: number;
  /** If there's entities returning in the results, that you want to exclude, you can provide a partial entity_id match to exclude it @default [] */
  blacklist?: string[];
  /** If there's entities returning in the results, but you only want certain entities, provide a partial entity_id match to include them @default [] */
  whitelist?: string[];
}

const isBattery = (e: HassEntity) => e.attributes.unit_of_measurement === "%" && e.attributes.device_class === "battery";

export const useLowDevices = ({ blacklist = [], whitelist = [], min = 0, max = 20 }: LowDevicesOptions = {}): HassEntity[] => {
  const batteries = useStore(
    useShallow((state) => {
      return Object.values(state.entities).filter(isBattery);
    }),
  );
  return useMemo(
    () =>
      batteries.filter((entity) => {
        const meetsThresholds = Number(entity.state) <= max && Number(entity.state) >= min;
        const isBlacklisted = blacklist.some((blackItem) => entity.entity_id.includes(blackItem));
        const isWhitelisted = whitelist.length === 0 || whitelist.some((whiteItem) => entity.entity_id.includes(whiteItem));
        return meetsThresholds && isWhitelisted && !isBlacklisted;
      }),
    [blacklist, batteries, max, min, whitelist],
  );
};
