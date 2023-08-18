import {
  Modal,
  ClimateControls,
} from "@components";
import type { ClimateControlsProps, ModalProps } from "@components";

export type ModalClimateControlsProps = Omit<ModalProps, "children"> & ClimateControlsProps;

export function ModalClimateControls({
  entity,
  hvacModes,
  hideCurrentTemperature,
  hideFanMode,
  hideState,
  hideUpdated,
  ...rest
}: ModalClimateControlsProps) {
  return (
    <Modal {...rest}>
      <ClimateControls
      {...{
        hvacModes,
        hideCurrentTemperature,
        hideFanMode,
        hideState,
        hideUpdated,
        entity
      }} />
    </Modal>
  );
}
