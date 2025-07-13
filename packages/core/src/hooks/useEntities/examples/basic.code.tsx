import { HassConnect, useEntities } from "@hakit/core";

function Office() {
  const lights = useEntities(["light.office_striplight", "light.office_roof", "light.office_striplight"]);
  // can now access all properties relating to the light
  return lights.some((light) => light.state === "on") ? "Some lights are on" : "No lights are on";
}

export function App() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <Office />
    </HassConnect>
  );
}
