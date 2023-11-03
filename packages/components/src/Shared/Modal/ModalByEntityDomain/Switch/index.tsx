import { SwitchControls, Row, type SwitchControlsProps } from "@components";
import { isUnavailableState } from "@hakit/core";
import type { EntityName, FilterByDomain } from "@hakit/core";
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
          onStateChange(isUnavailableState(_entity.state) ? "Unavailable" : value === true ? "On" : "Off");
        }}
      />
    </Row>
  );
}
