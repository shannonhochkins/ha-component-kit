import { AlarmControls, type AlarmControlsProps } from "../../../../Shared/Entity/Alarm/AlarmControls";

export type ModalAlarmControlsProps = AlarmControlsProps;

export function ModalAlarmControls(props: ModalAlarmControlsProps) {
  return <AlarmControls {...props} />;
}
export default ModalAlarmControls;
