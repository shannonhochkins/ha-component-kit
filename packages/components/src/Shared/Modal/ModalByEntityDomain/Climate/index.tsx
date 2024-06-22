import { ClimateControls, ClimateControlsProps } from "../../../Entity/Climate/ClimateControls";
export type ModalClimateControlsProps = Omit<ClimateControlsProps, "style">;

export function ModalClimateControls(props: ModalClimateControlsProps) {
  return <ClimateControls {...props} />;
}
export default ModalClimateControls;
