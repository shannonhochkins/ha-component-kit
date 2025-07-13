import { useHass } from "@hakit/core";
import { HassConnect } from "@hakit/core";

export function GetEntitiesExample() {
  const { getAllEntities } = useHass();
  // this is a snapshot, it will not update automatically when an entity changes
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
