import { ControlToggle, fallback, type ControlToggleProps } from "@components";
import { isUnavailableState, ON, useEntity } from "@hakit/core";
import type { EntityName, HassEntityWithService, FilterByDomain } from "@hakit/core";
import { ErrorBoundary } from "react-error-boundary";

export interface SwitchControlsProps extends Omit<ControlToggleProps, "disabled" | "checked" | "onChange"> {
  entity: FilterByDomain<EntityName, "switch">;
  onChange?: (entity: HassEntityWithService<"switch">, checked: boolean) => void;
}

function _SwitchControls({ entity, onChange, reversed = true, ...props }: SwitchControlsProps) {
  const _entity = useEntity(entity);
  const isUnavailable = isUnavailableState(_entity.state);
  return (
    <ControlToggle
      disabled={isUnavailable}
      {...props}
      reversed={reversed}
      checked={_entity.state === ON}
      onChange={(value) => {
        if (onChange) onChange(_entity, value);
        _entity.service.toggle();
      }}
    />
  );
}

/**
 * A simple control switch similar to home assistant switches, used in the popup for switch entities, you can reverse the order, change orientation, all you need to set is your desired width/height depending on the orientation
 * NOTE: This supports all available props from ControlToggle, so you can change the icons, colors, size and more.
 * */
export function SwitchControls(props: SwitchControlsProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "SwitchControls" })}>
      <_SwitchControls {...props} />
    </ErrorBoundary>
  );
}
