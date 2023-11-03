import { ClimateControls } from "@components";
import type { ClimateControlsProps } from "@components";

export type ModalClimateControlsProps = Omit<ClimateControlsProps, "style">;

export function ModalClimateControls(props: ModalClimateControlsProps) {
  return <ClimateControls {...props} />;
}
