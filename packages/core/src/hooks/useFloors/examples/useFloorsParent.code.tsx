import { HassConnect, useFloors } from "@hakit/core";

export function Component() {
  const floors = useFloors();
  return (
    <div>
      {floors.map((floor) => (
        <section key={floor.floor_id}>
          <h3>
            {floor.type === "unassigned" ? "Unassigned Areas" : `${floor.name}${floor.level != null ? ` (Level ${floor.level})` : ""}`}
          </h3>
          <ul>
            {floor.areas.map((area) => (
              <li key={area.area_id}>
                <strong>{area.name}</strong> — devices: {area.devices.length}, entities: {area.entities.length}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function App() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <Component />
    </HassConnect>
  );
}
