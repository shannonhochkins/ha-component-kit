import { useLowDevices, HassConnect, type EntityName } from "@hakit/core";
import { EntitiesCard, EntitiesCardRow, ThemeProvider } from "@hakit/components";

export function RenderDevices() {
  const devices = useLowDevices();
  return (
    <EntitiesCard includeLastUpdated>
      {devices.map((device) => (
        <EntitiesCardRow
          key={device.entity_id}
          entity={device.entity_id as EntityName}
          renderState={(entity) => {
            return (
              <div>
                {entity.state}
                {entity.attributes.unit_of_measurement}
              </div>
            );
          }}
        />
      ))}
    </EntitiesCard>
  );
}

export function App() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <ThemeProvider />
      <RenderDevices />
    </HassConnect>
  );
}
