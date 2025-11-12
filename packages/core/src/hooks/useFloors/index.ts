import { FloorRegistryEntry, useStore } from "@core";
import { useMemo } from "react";

export function useFloors(): FloorRegistryEntry[] {
  const floorsRecord = useStore.getState().floors;
  return useMemo(() => Object.values(floorsRecord), [floorsRecord]);
}
