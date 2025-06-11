import { useAreas, type EntityName } from '@hakit/core';
import { AreaCard, EntitiesCard, EntitiesCardRow } from '@hakit/components';


export function RenderAreas() {
  const areas = useAreas();
  return areas.map(area => <AreaCard key={area.area_id} title={area.name} image={area.picture as string} hash={area.area_id}>
    <EntitiesCard>
      {area.entities.map((entity, index) => (
        <EntitiesCardRow key={index} entity={entity.entity_id as EntityName} />
      ))}
    </EntitiesCard>
  </AreaCard>)
} 