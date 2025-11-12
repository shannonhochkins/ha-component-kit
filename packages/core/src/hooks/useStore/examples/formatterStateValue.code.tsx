import { useEntity, useStore } from "@hakit/core";

// Display a formatted state and a couple of formatted attributes.
export function FormatterStateValueExample() {
  const entity = useEntity("light.living_room");
  const formatter = useStore((s) => s.formatter);
  const stateText = formatter.stateValue(entity);
  const battery = formatter.attributeValue(entity, "battery_level");
  const lastChanged = formatter.formatShortDateTime(entity.last_changed);
  return (
    <div>
      <h4>{entity.entity_id}</h4>
      <p>State: {stateText}</p>
      {battery && <p>Battery: {battery}</p>}
      <p>Last Changed: {lastChanged}</p>
    </div>
  );
}
