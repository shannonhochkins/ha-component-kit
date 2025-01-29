import { HassConnect, useEntity } from "@hakit/core";

function Office() {
  const lightStrip = useEntity("light.office_striplight");
  // can now access all properties relating to the light
  return lightStrip.state;
}

export function App() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <Office />
    </HassConnect>
  );
}
