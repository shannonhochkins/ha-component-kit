import { useEffect, useState } from "react";
import { useHass, HassConnect } from "@hakit/core";
import { type HassConfig } from "home-assistant-js-websocket";

export function GetConfigExample() {
  const { getConfig } = useHass();
  const [config, setConfig] = useState<HassConfig | null>(null);

  useEffect(() => {
    getConfig().then((config) => {
      if (config) {
        setConfig(config);
      }
    });
  }, [getConfig]);

  return <p>Your home assistant instance is {config?.state}</p>;
}

export function App() {
  return (
    <HassConnect hassUrl="https://homeassistant.local:8123">
      <GetConfigExample />
    </HassConnect>
  );
}
