import { HassConnect, useFloors } from "@hakit/core";

export function Component() {
  const floors = useFloors();
  return (
    <div>
      Number of floors: {floors.length}, First floor - Name: {floors[0]?.name}, Level: {floors[0]?.level}
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
