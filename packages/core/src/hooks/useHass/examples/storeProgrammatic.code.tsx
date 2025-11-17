import { useHass } from "@hakit/core";

// Programmatic access pattern (non-hook usage inside an event handler or util)
export function StoreProgrammaticExample() {
  const user = useHass((s) => s.user);
  const routes = useHass((s) => s.routes);

  function addDemoRoute() {
    const state = useHass.getState();
    const existing = state.routes.find((r) => r.hash === "demo");
    if (!existing) {
      state.setRoutes([...state.routes, { hash: "demo", name: "Demo", icon: "mdi:test-tube", active: false }]);
    }
  }

  return (
    <div>
      <p>User: {user?.name}</p>
      <button onClick={addDemoRoute}>Add Demo Route (programmatic)</button>
      <pre>{JSON.stringify(routes, null, 2)}</pre>
    </div>
  );
}
