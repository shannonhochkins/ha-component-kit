import { AlarmControls, Row, type AlarmControlsProps } from "@components";
import type { EntityName, FilterByDomain } from "@hakit/core";
export interface ModalAlarmControlsProps extends AlarmControlsProps {
  entity: FilterByDomain<EntityName, "alarm_control_panel">;
}

export function ModalAlarmControls(props: ModalAlarmControlsProps) {
  return (
    <Row fullWidth>
      <AlarmControls {...props} />
    </Row>
  );
}
