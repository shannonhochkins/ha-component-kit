import { HassConnect, useConfig } from "@hakit/core";

export function Component() {
  const config = useConfig();
  return <div>Home Assistant Version: {config?.version}</div>;
}

export function App() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <Component />
    </HassConnect>
  );
}
