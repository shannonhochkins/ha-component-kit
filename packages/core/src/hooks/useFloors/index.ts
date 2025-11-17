import { useAreas, useHass, type Area } from "@core";
import { useMemo } from "react";
import type { FloorRegistryEntry } from "@utils/subscribe/floors";

export interface FloorWithAreas extends FloorRegistryEntry {
  /** Discriminator so consumers can detect synthetic unassigned bucket */
  type: "floor" | "unassigned";
  /** Areas belonging to this floor (enriched area objects) */
  areas: Area[];
}

/**
 * Hook returning an ordered list of floors, each enriched with its areas, plus a
 * synthetic trailing "Unassigned" entry (type = "unassigned") when areas exist
 * without an assigned floor.
 */
export function useFloors(): FloorWithAreas[] {
  const allAreas = useAreas();
  const floorsRecord = useHass((state) => state.floors);

  return useMemo(() => {
    const floorAreaLookup = getFloorAreaLookup(allAreas);
    const unassignedAreas = allAreas.filter((area) => !area.floor_id || !floorAreaLookup[area.floor_id]);

    const floors: FloorWithAreas[] = Object.values(floorsRecord).map((floor) => ({
      ...floor,
      type: "floor",
      areas: floorAreaLookup[floor.floor_id] || [],
    }));

    if (unassignedAreas.length) {
      floors.push({
        floor_id: "unassigned",
        name: "Unassigned",
        level: null,
        icon: null,
        aliases: [] as string[],
        created_at: Date.now(),
        modified_at: Date.now(),
        type: "unassigned",
        areas: unassignedAreas,
      });
    }

    return floors;
  }, [allAreas, floorsRecord]);
}

type FloorAreaLookup = Record<string, Area[]>;

const getFloorAreaLookup = (areas: Area[]): FloorAreaLookup => {
  const floorAreaLookup: FloorAreaLookup = {};
  for (const area of areas) {
    if (!area.floor_id) {
      continue;
    }
    if (!(area.floor_id in floorAreaLookup)) {
      floorAreaLookup[area.floor_id] = [];
    }
    floorAreaLookup[area.floor_id].push(area);
  }
  return floorAreaLookup;
};
