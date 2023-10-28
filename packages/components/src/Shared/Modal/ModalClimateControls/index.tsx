import { ClimateControls } from "@components";
import type { ClimateControlsProps } from "@components";

export type ModalClimateControlsProps = Omit<ClimateControlsProps, "style">;

export function ModalClimateControls({
  entity,
  hvacModes,
  hideCurrentTemperature,
  hideFanMode,
  hideState,
  hideUpdated,
}: ModalClimateControlsProps) {
  return (
    <ClimateControls
      {...{
        hvacModes,
        hideCurrentTemperature,
        hideFanMode,
        hideState,
        hideUpdated,
        entity,
      }}
    />
  );
}
