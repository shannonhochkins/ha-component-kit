import { useContext } from "react";
import { isEmpty } from "lodash";
import { HassContext } from "@core";
import type { HassContextProps } from "@core";

export function useHass(): HassContextProps {
  const context = useContext(HassContext);
  if (context === undefined || isEmpty(context)) {
    throw new Error("useHass must be used within a HassProvider, have you wrapped your application in <HassConnect hassUrl={HASS_URL} />?");
  }
  return context;
}
