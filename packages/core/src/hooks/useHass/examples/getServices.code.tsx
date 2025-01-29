import { type HassServices } from "home-assistant-js-websocket";
import { useHass, HassConnect } from "@hakit/core";
import { useEffect, useState } from "react";

export function GetServicesExample() {
  const { getServices } = useHass();
  const [services, setServices] = useState<HassServices | null>(null);

  useEffect(() => {
    getServices().then((services) => setServices(services));
  }, [getServices]);
  // print the result when ready
  return <pre>{JSON.stringify(services, null, 2)}</pre>;
}

export function App() {
  return (
    <HassConnect hassUrl="https://homeassistant.local:8123">
      <GetServicesExample />
    </HassConnect>
  );
}
