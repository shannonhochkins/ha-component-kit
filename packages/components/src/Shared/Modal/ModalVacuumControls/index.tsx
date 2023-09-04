import { Modal, VacuumControls } from "@components";
import type { VacuumControlsProps, ModalProps } from "@components";

export type ModalVacuumControlsProps = Omit<ModalProps, "children"> &
  VacuumControlsProps;

export function ModalVacuumControls({
  entity,
  vacuumModes,
  hideCurrentBatteryLevel,
  hideState,
  hideUpdated,
  ...rest
}: ModalVacuumControlsProps) {
  return (
    <Modal {...rest}>
      <VacuumControls
        {...{
          vacuumModes,
          hideCurrentBatteryLevel,
          hideState,
          hideUpdated,
          entity,
        }}
      />
    </Modal>
  );
}
