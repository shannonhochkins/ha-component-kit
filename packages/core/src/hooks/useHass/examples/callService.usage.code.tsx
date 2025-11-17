import { useCallback } from "react";
import { useHass } from "@hakit/core";

export function CallServiceUsageExample() {
  const { callService } = useHass.getState().helpers;
  const turnOnAC = useCallback(() => {
    callService({ domain: "climate", service: "turn_on", target: { entity_id: "climate.air_conditioner" } });
  }, [callService]);
  return <button onClick={turnOnAC}>TURN ON CONDITIONER</button>;
}
