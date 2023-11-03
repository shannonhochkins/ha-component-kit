import { useEffect, useState, useMemo, useRef } from "react";
import { useHass } from "@core";
import { HassEntity, HassEntities } from "home-assistant-js-websocket";
import { isEqual } from "lodash";

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

export const useLowDevices = ({ blacklist = [], whitelist = [], min = 0, max = 20 }: LowDevicesOptions = {}) => {
  const { getAllEntities } = useHass();
  const [lowEntities, setLowEntities] = useState<HassEntity[]>([]);
  const entities = getAllEntities();
  const prevEntitiesRef = useRef<null | HassEntities>(null);
  // Check if entities have actually changed meaningfully
  const haveEntitiesChanged = !isEqual(prevEntitiesRef.current, entities);
  const batteryEntities = useMemo(
    () =>
      Object.values(entities).filter((entity) => {
        const hasBatteryProperties = entity.attributes.unit_of_measurement === "%" && entity.attributes.device_class === "battery";
        const meetsThresholds = Number(entity.state) <= max && Number(entity.state) >= min;
        const isBlacklisted = !blacklist.some((blackItem) => entity.entity_id.includes(blackItem));
        const isWhitelisted = whitelist.length === 0 || whitelist.some((whiteItem) => entity.entity_id.includes(whiteItem));
        return hasBatteryProperties && meetsThresholds && isBlacklisted && isWhitelisted;
      }),
    [blacklist, entities, max, min, whitelist],
  );

  useEffect(() => {
    if (haveEntitiesChanged && !isEqual(batteryEntities, lowEntities)) {
      setLowEntities(batteryEntities);
    }
    prevEntitiesRef.current = entities;
  }, [haveEntitiesChanged, batteryEntities, lowEntities, entities]);
  return useMemo(() => lowEntities, [lowEntities]);
};
