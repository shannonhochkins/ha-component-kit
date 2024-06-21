import { AlarmControls, type AlarmControlsProps } from "@components";

export type ModalAlarmControlsProps = AlarmControlsProps;

export function ModalAlarmControls(props: ModalAlarmControlsProps) {
  return <AlarmControls {...props} />;
}
export default ModalAlarmControls;