import { type EntityName, useAreas } from "@hakit/core";
import { AreaCard, EntitiesCard, EntitiesCardRow, Row } from "@hakit/components";

export function RenderAreas() {
  const areas = useAreas();
  return (
    <Row gap="2rem">
      {areas.map((area) => {
        const hasDevices = area.devices.length > 0;
        const hasEntities = area.entities.length > 0;
        const devicesSuffix = hasDevices ? `Devices ${area.devices.length}` : "";
        const entitiesSuffix = hasEntities ? `Entities ${area.entities.length}` : "";
        const suffix = [devicesSuffix, entitiesSuffix].filter(Boolean).join(", ");
        return (
          <AreaCard
            key={area.area_id}
            title={`${area.name}${suffix ? ` - ${suffix}` : ""}`}
            image={area.picture ?? `https://picsum.photos/200/300?t=${Math.random()}`}
            hash={area.area_id}
          >
            <EntitiesCard>
              {area.entities.map((entity, index) => (
                <EntitiesCardRow key={index} entity={entity.entity_id as EntityName} />
              ))}
            </EntitiesCard>
          </AreaCard>
        );
      })}
    </Row>
  );
}
