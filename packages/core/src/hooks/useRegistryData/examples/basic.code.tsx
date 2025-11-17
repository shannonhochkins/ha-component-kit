import { HassConnect, useRegistryData } from "@hakit/core";

export function Component() {
  const entitiesRegistryDisplay = useRegistryData("entitiesRegistryDisplay");
  const firstEntity = Object.values(entitiesRegistryDisplay)[0];
  return (
    <div>
      Entity ID: {firstEntity?.entity_id}, platform: {firstEntity?.platform}
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
