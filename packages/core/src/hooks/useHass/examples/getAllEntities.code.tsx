import { useHass } from "@hakit/core";
import { HassConnect } from "@hakit/core";

export function GetEntitiesExample() {
  const { getAllEntities } = useHass();
  const entities = getAllEntities();
  return <p>You have {Object.keys(entities).length} entities</p>;
}

export function App() {
  return (
    <HassConnect hassUrl="https://homeassistant.local:8123">
      <GetEntitiesExample />
    </HassConnect>
  );
}
