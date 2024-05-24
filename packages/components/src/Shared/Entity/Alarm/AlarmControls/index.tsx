import { useMemo, useEffect } from "react";
import { Column, Row, useBreakpoint, fallback, ButtonGroup, ButtonGroupButton } from "@components";
import { useEntity } from "@hakit/core";
import type { EntityName, FilterByDomain } from "@hakit/core";
import { ErrorBoundary } from "react-error-boundary";

type Orientation = "vertical" | "horizontal";

export interface AlarmControlsProps {
  entity: FilterByDomain<EntityName, "alarm_control_panel">;
  onStateChange?: (state: string) => void;
  /** the orientation of the buttons */
  orientation?: Orientation;
}

function _AlarmControls({ entity: _entity, orientation = "vertical", onStateChange }: AlarmControlsProps) {
  const entity = useEntity(_entity);

  const device = useBreakpoint();
  const titleValue = useMemo(() => {
    return entity.state;
  }, [entity]);

  useEffect(() => {
    if (onStateChange) {
      onStateChange(titleValue);
    }
  }, [titleValue, onStateChange]);

  const armed_home = useMemo(() => {
    return entity.state === "armed_home";
  }, [entity]);
  const armed_away = useMemo(() => {
    return entity.state === "armed_away";
  }, [entity]);
  const disarmed = useMemo(() => {
    return entity.state === "disarmed";
  }, [entity]);

  const showTitle = !device.xxs;
  const red = "#F18B82";
  const green = "#80C994";

  return (
    <Column
      fullHeight
      wrap="nowrap"
      justifyContent={device.xxs ? "flex-start" : "center"}
      style={{
        padding: device.xxs ? "1rem" : "0",
      }}
    >
      <Column>
        <Row
          gap="1rem"
          style={{
            flexDirection: orientation === "vertical" ? "row" : "column",
          }}
        >
          <Column>
            <ButtonGroup thickness={device.xxs ? 70 : 150} orientation={orientation}>
              <ButtonGroupButton
                title="Arm - Home"
                entity={_entity}
                showTitle={showTitle}
                active={armed_home}
                service="alarmArmHome"
                icon={"mdi:home"}
                activeColor={red}
              />
              <ButtonGroupButton
                title="Arm - Away"
                entity={_entity}
                showTitle={showTitle}
                active={armed_away}
                service="alarmArmAway"
                icon={"mdi:lock"}
                activeColor={red}
              />
              <ButtonGroupButton
                title="Disarm"
                entity={_entity}
                showTitle={showTitle}
                active={disarmed}
                service="alarmDisarm"
                icon={"mdi:shield-off"}
                activeColor={green}
              />
            </ButtonGroup>
          </Column>
        </Row>
      </Column>
    </Column>
  );
}

/** This component will render controls for a cover, it supports tilt & position sliders, as well as a button mode
 *
 * The below demos show how different cover entities will render based on what they support, this is automatic and no need to configure anything.
 */
export function AlarmControls(props: AlarmControlsProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "AlarmControls" })}>
      <_AlarmControls {...props} />
    </ErrorBoundary>
  );
}
