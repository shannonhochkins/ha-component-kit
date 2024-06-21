import { PersonControls, type PersonControlsProps } from "@components";
import type { EntityName, FilterByDomain } from "@hakit/core";

export interface ModalPersonControlsProps extends PersonControlsProps {
  entity: FilterByDomain<EntityName, "person">;
  mapHeight: number;
}

export function ModalPersonControls({ entity, mapHeight, ...props }: ModalPersonControlsProps) {
  return <PersonControls entity={entity} mapHeight={mapHeight} {...props} />;
}
export default ModalPersonControls;
