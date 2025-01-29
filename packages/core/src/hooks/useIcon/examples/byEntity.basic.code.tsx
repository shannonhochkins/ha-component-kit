import { HassConnect, useIconByEntity } from "@hakit/core";

function IconExample() {
  const icon = useIconByEntity("light.fake_light_1");
  return <div>{icon}</div>;
}

export function App() {
  return (
    <HassConnect hassUrl="https://homeassistant.local:8123">
      <IconExample />
    </HassConnect>
  );
}
