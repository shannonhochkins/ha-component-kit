import { isUnavailableState, localize } from "@hakit/core";
import type { EntityName, FilterByDomain } from "@hakit/core";
import { Row } from "../../../Row";
import { SwitchControls, type SwitchControlsProps } from "../../../../Shared/Entity/Switch/SwitchControls";
export interface ModalSwitchControlsProps extends Omit<SwitchControlsProps, "disabled" | "onChange" | "checked"> {
  entity: FilterByDomain<EntityName, "switch">;
  onStateChange: (state: string) => void;
}

export function ModalSwitchControls({ entity, onStateChange, ...props }: ModalSwitchControlsProps) {
  return (
    <Row fullWidth>
      <SwitchControls
        entity={entity}
        {...props}
        onChange={(_entity, value) => {
          onStateChange(isUnavailableState(_entity.state) ? localize("unavailable") : value === true ? "On" : "Off");
        }}
      />
    </Row>
  );
}
export default ModalSwitchControls;
