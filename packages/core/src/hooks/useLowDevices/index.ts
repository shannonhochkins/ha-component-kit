import { useEffect, useState, useMemo } from "react";
import { useHass } from "@core";
import { HassEntity } from "home-assistant-js-websocket";

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

export const useLowDevices = ({
  blacklist = [],
  whitelist = [],
  min = 0,
  max = 20,
}: LowDevicesOptions = {}) => {
  const { getAllEntities, lastUpdated } = useHass();
  const [lowEntities, setLowEntities] = useState<HassEntity[]>([]);
  const entities = getAllEntities();

  useEffect(() => {
    const batteryEntities = Object.values(entities)
      .filter((entity) => {
        const hasBatteryProperties =
          entity.attributes.unit_of_measurement === "%" &&
          entity.attributes.device_class === "battery";
        const meetsThresholds =
          Number(entity.state) <= max && Number(entity.state) >= min;
        const isBlacklisted = !blacklist.some((blackItem) =>
          entity.entity_id.includes(blackItem),
        );
        const isWhitelisted =
          whitelist.length === 0 ||
          whitelist.some((whiteItem) => entity.entity_id.includes(whiteItem));
        return (
          hasBatteryProperties &&
          meetsThresholds &&
          isBlacklisted &&
          isWhitelisted
        );
      })
      .sort((a, b) => Number(a.state) - Number(b.state));
    if (batteryEntities.length > 0) {
      setLowEntities(batteryEntities);
    }
  }, [lastUpdated, blacklist, whitelist, entities, min, max]);
  return useMemo(() => lowEntities, [lowEntities]);
};
