import { HassConnect, useLogs } from "@hakit/core";

function Office() {
  const logs = useLogs("light.some_light");
  // can now access all properties relating to the logs for this light.
  return (
    <div>
      There are {logs.length} logs for this light.
      {JSON.stringify(logs, null, 2)}
    </div>
  );
}

export function App() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <Office />
    </HassConnect>
  );
}
