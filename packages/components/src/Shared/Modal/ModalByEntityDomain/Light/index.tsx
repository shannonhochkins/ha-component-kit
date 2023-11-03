import { LightControls, type LightControlsProps } from "@components";
import type { EntityName, FilterByDomain } from "@hakit/core";
export interface ModalLightControlsProps extends LightControlsProps {
  entity: FilterByDomain<EntityName, "light">;
}

export function ModalLightControls(props: ModalLightControlsProps) {
  return <LightControls {...props} />;
}
