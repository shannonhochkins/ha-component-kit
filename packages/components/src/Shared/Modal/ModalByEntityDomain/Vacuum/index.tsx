import type { EntityName, FilterByDomain } from '@hakit/core';
import { VacuumControls } from "@components";
import type { VacuumControlsProps } from "@components";


export interface ModalVacuumControlsProps extends VacuumControlsProps {
  entity: FilterByDomain<EntityName, "vacuum">;
}

export function ModalVacuumControls(props: ModalVacuumControlsProps) {
  return (
    <VacuumControls {...props} />
  );
}
