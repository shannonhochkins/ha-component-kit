import { useHass, HassConnect } from "@hakit/core";

function UseHassExample() {
  // reactive subscriptions
  const entities = useHass((s) => s.entities);
  const connection = useHass((s) => s.connection);
  const config = useHass((s) => s.config);
  const auth = useHass((s) => s.auth);
  const user = useHass((s) => s.user);
  console.debug("data", {
    entities,
    connection,
    config,
    auth,
  });
  // or access the state programmatically
  const state = useHass.getState();
  console.debug("state", state.entities);
  return <p>{JSON.stringify(user, null, 2)}</p>;
}

export function App() {
  return (
    <HassConnect hassUrl="https://homeassistant.local:8123">
      <UseHassExample />
    </HassConnect>
  );
}
