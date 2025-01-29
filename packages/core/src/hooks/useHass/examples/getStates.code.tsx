import { type HassEntity } from "home-assistant-js-websocket";
import { useHass, HassConnect } from "@hakit/core";
import { useEffect, useState } from "react";

export function GetStatesExample() {
  const { getStates } = useHass();
  const [states, setStates] = useState<HassEntity[] | null>(null);
  useEffect(() => {
    getStates().then((states) => setStates(states));
  }, [getStates]);
  return <p>{JSON.stringify(states, null, 2)}</p>;
}

export function App() {
  return (
    <HassConnect hassUrl="https://homeassistant.local:8123">
      <GetStatesExample />
    </HassConnect>
  );
}
