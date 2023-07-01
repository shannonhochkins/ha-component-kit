import { useContext } from "react";
import { HassContext } from "../../components/HassConnect/Provider";
import type { HassContextProps } from "../../components/HassConnect/Provider";
import { isEmpty } from "lodash";

export function useHass(): HassContextProps {
  const context = useContext(HassContext);
  if (context === undefined || isEmpty(context)) {
    throw new Error("useHass must be used within a HassProvider, have you wrapped your application in <HassConnect hassUrl={HASS_URL} />?");
  }
  return context;
}
