import { HassConnect, useRegistryData } from "@hakit/core";
import { isEntityRegistryEntryDisabled } from "@hakit/core/registry";

export function Component() {
  const registry = useRegistryData("entitiesRegistry");
  const firstEntity = Object.values(registry)[0];
  if (!firstEntity) return <p>Loading registry…</p>;
  const status =
    "disabled_by" in firstEntity ? (isEntityRegistryEntryDisabled(firstEntity) ? "Disabled" : "Enabled") : "Display metadata only";
  return (
    <dl>
      <dt>Entity ID</dt>
      <dd>{firstEntity.entity_id}</dd>
      <dt>Registry information</dt>
      <dd>{status}</dd>
    </dl>
  );
}

export function App() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <Component />
    </HassConnect>
  );
}
