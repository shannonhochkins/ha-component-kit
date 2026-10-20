import { HassConnect, useHistory } from "@hakit/core";

function Office() {
  const history = useHistory("light.some_light");
  if (history.error) return <p role="alert">History unavailable: {history.error.message}</p>;
  if (history.loading) return <p>Loading history…</p>;
  if (!history.timeline.length) return <p>No recorded changes.</p>;
  return (
    <ul>
      {history.timeline.map((state, index) => (
        <li key={index}>
          {state.state}: {state.last_changed}
        </li>
      ))}
    </ul>
  );
}

export function App() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <Office />
    </HassConnect>
  );
}
