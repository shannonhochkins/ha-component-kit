import { HassConnect, useSubscribeEntity } from "@hakit/core";

function Office() {
  const getEntity = useSubscribeEntity("light.some_light");
  const entity = getEntity();
  return <div>{entity?.state}</div>;
}
export function App() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <Office />
    </HassConnect>
  );
}
