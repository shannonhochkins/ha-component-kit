import type { EntityName, FilterByDomain } from "@hakit/core";
import { VacuumControls, type VacuumControlsProps } from "../../../../Shared/Entity/Vacuum/VacuumControls";

export interface ModalVacuumControlsProps extends VacuumControlsProps {
  entity: FilterByDomain<EntityName, "vacuum">;
}

export function ModalVacuumControls(props: ModalVacuumControlsProps) {
  return <VacuumControls {...props} />;
}
export default ModalVacuumControls;
