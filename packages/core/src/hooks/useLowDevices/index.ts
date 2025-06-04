import { useMemo } from "react";
import { useHass } from "@core";
import { HassEntity } from "home-assistant-js-websocket";
import { useShallow } from "zustand/shallow";

export interface LowDevicesOptions {
  /** the minimum battery percentage threshold */
  min?: number;
  /** the maximum battery percentage threshold */
  max?: number;
  /** the list of entities to ignore */
  blacklist?: string[];
  /** the list of entities to only include */
  whitelist?: string[];
}

const isBattery = (e: HassEntity) => e.attributes.unit_of_measurement === "%" && e.attributes.device_class === "battery";

export const useLowDevices = ({ blacklist = [], whitelist = [], min = 0, max = 20 }: LowDevicesOptions = {}) => {
  const { useStore } = useHass();

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
