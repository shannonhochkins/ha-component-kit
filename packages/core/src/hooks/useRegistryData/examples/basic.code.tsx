import { HassConnect, useRegistryData } from "@hakit/core";

export function Component() {
  const entitiesRegistry = useRegistryData("entitiesRegistry");
  const firstEntity = Object.values(entitiesRegistry)[0];
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
