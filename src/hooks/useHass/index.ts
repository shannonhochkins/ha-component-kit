import { useContext } from "react";
import { HassContext } from "../../components/HassConnect/Provider";
import type { HassContextProps } from "../../components/HassConnect/Provider";

export function useHass(): HassContextProps {
  const context = useContext(HassContext);
  if (context === undefined) {
    throw new Error("useHass must be used within a HassProvider");
  }
  return context;
}
