import { HassConnect, useHaStatus } from "@hakit/core";

export function Component() {
  const haStatus = useHaStatus();
  return <div>Home Assistant Status: {haStatus}</div>;
}

export function App() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <Component />
    </HassConnect>
  );
}
