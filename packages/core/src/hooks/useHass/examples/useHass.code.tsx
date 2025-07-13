import { useHass, HassConnect } from "@hakit/core";

function UseHassExample() {
  const { getAllEntities } = useHass();
  // this is a snapshot, it will not update automatically
  const entities = getAllEntities();
  // can now access all properties relating to the light
  return <p>You have {Object.keys(entities).length} entities!</p>;
}

export function App() {
  return (
    <HassConnect hassUrl="https://homeassistant.local:8123">
      <UseHassExample />
    </HassConnect>
  );
}
