import type { EntityName, FilterByDomain } from "@hakit/core";
import { LightControls, LightControlsProps } from "../../../../Shared/Entity/Light/LightControls";
export interface ModalLightControlsProps extends LightControlsProps {
  entity: FilterByDomain<EntityName, "light">;
}

export function ModalLightControls(props: ModalLightControlsProps) {
  return <LightControls {...props} />;
}
export default ModalLightControls;
