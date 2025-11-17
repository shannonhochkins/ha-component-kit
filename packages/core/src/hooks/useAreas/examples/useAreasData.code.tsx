import { HassConnect, useAreas } from "@hakit/core";

export function Component() {
  const areas = useAreas();
  return (
    <ul>
      {areas.map((area) => (
        <li key={area.area_id}>
          <strong>{area.name}</strong> — devices: {area.devices.length}, entities: {area.entities.length}
        </li>
      ))}
    </ul>
  );
}

export function App() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <Component />
    </HassConnect>
  );
}
