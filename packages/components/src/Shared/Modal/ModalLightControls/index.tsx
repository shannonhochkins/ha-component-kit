import { LightControls } from "@components";
import type { EntityName, FilterByDomain } from "@hakit/core";
export interface ModalLightControlsProps {
  entity: FilterByDomain<EntityName, "light">;
}

export function ModalLightControls({
  entity,
}: ModalLightControlsProps) {
  return <LightControls entity={entity} />;
}
