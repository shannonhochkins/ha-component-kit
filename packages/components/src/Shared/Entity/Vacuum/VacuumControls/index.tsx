import React, { useState } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { ButtonBarButton, ButtonBar, Column, FabCard, Row, ButtonBarButtonProps } from "@components";
import { useEntity, type HassEntityWithService, type EntityName, batteryIconByLevel, localize } from "@hakit/core";
import { useDebounce } from "react-use";
import type { MotionProps } from "framer-motion";
import { icons } from "./shared";
import { VacuumImage } from "./VacuumImage";

type Extendable = MotionProps & React.ComponentPropsWithoutRef<"div">;

interface Shortcut extends Omit<ButtonBarButtonProps<EntityName>, "onClick"> {
  onClick: (entity: HassEntityWithService<"vacuum">) => void;
}
export interface VacuumControlsProps extends Extendable {
  entity: `${"vacuum"}.${string}`;
  /** provide a list of shorts you want to support/display in the UI, you can call your own service if need be! */
  shortcuts?: Shortcut[];
  /** hide the fan mode shown in the popup @default false */
  hideFanModes?: boolean;
  /** hide the current battery level @default false */
  hideCurrentBatteryLevel?: boolean;
  /** hide the state of the vacuum entity @default false */
  hideState?: boolean;
  /** hide the last updated time @default false */
  hideUpdated?: boolean;
  /** hide the toolbar @default false */
  hideToolbar?: boolean;
  /** change the default custom image to display @default vacuum.png */
  customImage?: string;
  /** the text/node to render when locating @default 'Locate...' in preferred language */
  locatingNode?: React.ReactNode;
}

const VacuumSize = styled.div`
  aspect-ratio: 1/1.7;
  height: 100%;
  max-height: 45vh;
  min-height: 300px;
  margin-bottom: 2rem;
  position: relative;
`;

const ModeColumn = styled(Column)`
  font-size: 0.8rem;
`;

const Push = styled.span`
  padding: 1rem;
`;

const spin = keyframes`
  from {
    transform:rotate(0deg);
  }
  to {
    transform:rotate(360deg);
  }
`;

const FanMode = styled(FabCard)<{
  speed?: string;
}>`
  animation-name: ${spin};
  animation-duration: ${(props) => {
    const speed = (props.speed || "").toLowerCase().trim();
    const silent = speed.includes("silent");
    const standard = speed.includes("standard");
    const medium = speed.includes("medium");
    const turbo = speed.includes("turbo");
    if (silent) return "4s";
    if (standard) return "2.5s";
    if (medium) return "1.8s";
    if (turbo) return "0.7s";
    return "2s";
  }};
  animation-iteration-count: infinite;
  animation-timing-function: linear;
`;

interface VacuumToolbarProps {
  /** the vacuum entity to control */
  entity: `${"vacuum"}.${string}`;
  /** hide the toolbar @default false */
  hideToolbar?: boolean;
  /** provide a list of shorts you want to support/display in the UI, you can call your own service if need be! */
  shortcuts?: Shortcut[];
  /** a callback when the locate button is clicked */
  onLocate?: () => void;
}

function Shortcuts({
  shortcuts,
  entity,
}: {
  shortcuts?: Shortcut[];
  entity: HassEntityWithService<"vacuum">;
}): React.ReactElement<typeof ButtonBarButton>[] {
  return (shortcuts ?? [])
    .concat()
    .filter((x) => !!x)
    .map(({ onClick, active, ...rest }, index) => (
      <ButtonBarButton
        size={35}
        iconColor={active ? "var(--ha-300)" : undefined}
        rippleProps={{
          preventPropagation: true,
        }}
        key={index}
        active={active}
        onClick={() => onClick(entity)}
        {...rest}
      />
    )) as React.ReactElement<typeof ButtonBarButton>[];
}

export function VacuumToolbar({ entity: _entity, shortcuts, onLocate, hideToolbar = false }: VacuumToolbarProps) {
  const entity = useEntity(_entity);

  if (hideToolbar) {
    return null;
  }
  switch (entity.state) {
    case "on":
    case "auto":
    case "spot":
    case "edge":
    case "single_room":
    case "mowing":
    case "edgecut":
    case "cleaning": {
      return (
        <Row gap="0.5rem">
          <ButtonBar>
            <ButtonBarButton
              size={35}
              rippleProps={{
                preventPropagation: true,
              }}
              title={localize("start")}
              icon={icons["pause"]}
              onClick={() => entity.service.pause()}
            />
            <ButtonBarButton
              size={35}
              rippleProps={{
                preventPropagation: true,
              }}
              title={localize("stop")}
              icon={icons["stop"]}
              onClick={() => entity.service.stop()}
            />
            <ButtonBarButton
              size={35}
              rippleProps={{
                preventPropagation: true,
              }}
              title={localize("return_home")}
              icon={icons["returning"]}
              onClick={() => entity.service.returnToBase()}
            />
            <Shortcuts shortcuts={shortcuts} entity={entity} />
          </ButtonBar>
        </Row>
      );
    }

    case "paused": {
      return (
        <Row gap="0.5rem">
          <ButtonBar>
            <ButtonBarButton
              size={35}
              rippleProps={{
                preventPropagation: true,
              }}
              title={localize("start")}
              icon={icons["on"]}
              onClick={() => entity.service.start()}
            />
            <ButtonBarButton
              size={35}
              rippleProps={{
                preventPropagation: true,
              }}
              title={localize("return_home")}
              icon={icons["returning"]}
              onClick={() => entity.service.returnToBase()}
            />
            <Shortcuts shortcuts={shortcuts} entity={entity} />
          </ButtonBar>
        </Row>
      );
    }

    case "returning": {
      return (
        <Row gap="0.5rem">
          <ButtonBar>
            <ButtonBarButton
              size={35}
              rippleProps={{
                preventPropagation: true,
              }}
              title={localize("start")}
              icon={icons["on"]}
              onClick={() => entity.service.start()}
            />
            <ButtonBarButton
              size={35}
              rippleProps={{
                preventPropagation: true,
              }}
              title={localize("pause")}
              icon={icons["pause"]}
              onClick={() => entity.service.pause()}
            />
            <Shortcuts shortcuts={shortcuts} entity={entity} />
          </ButtonBar>
        </Row>
      );
    }
    case "docked":
    case "idle":
    default: {
      return (
        <Row gap="0.5rem">
          <ButtonBar>
            <ButtonBarButton
              size={35}
              rippleProps={{
                preventPropagation: true,
              }}
              title={localize("start")}
              icon={icons["on"]}
              onClick={() => entity.service.start()}
            />
            <ButtonBarButton
              size={35}
              rippleProps={{
                preventPropagation: true,
              }}
              title={localize("locate")}
              icon={"mdi:map-marker"}
              onClick={() => {
                entity.service.locate();
                if (typeof onLocate === "function") {
                  onLocate();
                }
              }}
            />
            {entity.state === "idle" && (
              <ButtonBarButton
                size={35}
                rippleProps={{
                  preventPropagation: true,
                }}
                title={localize("return_home")}
                icon={icons["returning"]}
                onClick={() => entity.service.returnToBase()}
              />
            )}
            <Shortcuts shortcuts={shortcuts} entity={entity} />
          </ButtonBar>
        </Row>
      );
    }
  }
}

/** The VacuumControls component can be used in isolation of the VacuumCard and will display the some information that's displayed
 * in the more info panel when the component expands.
 */
export function VacuumControls({
  entity: _entity,
  hideCurrentBatteryLevel = false,
  hideFanModes = false,
  hideToolbar = false,
  customImage,
  shortcuts,
  ...rest
}: VacuumControlsProps) {
  const entity = useEntity(_entity);
  const isDocked = entity.state === "docked";
  const { battery_level, fan_speed, fan_speed_list } = entity.attributes || {};
  const [internalFanSpeed, setInternalFanSpeed] = useState(fan_speed);

  useDebounce(
    () => {
      if (typeof internalFanSpeed === "string") {
        entity.service.setFanSpeed({
          fan_speed: internalFanSpeed,
        });
      }
    },
    200,
    [internalFanSpeed],
  );
  const fanSpeedList = fan_speed_list ?? [];
  const shouldShowFanControls = !hideFanModes && !isDocked && fanSpeedList.length > 0;
  const shouldShowBatteryLevel = !hideCurrentBatteryLevel && typeof battery_level === "number";

  return (
    <Column fullHeight fullWidth wrap="nowrap" {...rest}>
      <VacuumSize>
        <Column gap="0.5rem">
          <VacuumImage src={customImage} className={entity.state} />
          {(shouldShowBatteryLevel || shouldShowFanControls) && (
            <Row
              style={{
                padding: "1rem 0",
              }}
            >
              {shouldShowFanControls && (
                <ModeColumn gap="0.5rem">
                  <FanMode
                    size={40}
                    disabled={isDocked}
                    title={internalFanSpeed}
                    speed={isDocked ? undefined : internalFanSpeed}
                    active={!isDocked}
                    icon="mdi:fan"
                    onClick={() => {
                      const currentIndex = fanSpeedList.findIndex(
                        (speed) => speed.toLowerCase() === (internalFanSpeed ?? "").toLowerCase(),
                      );
                      const fanSpeed = fanSpeedList[currentIndex + 1] ? fanSpeedList[currentIndex + 1] : fanSpeedList[0];
                      setInternalFanSpeed(fanSpeed);
                      entity.service.setFanSpeed({
                        fan_speed: fanSpeed,
                      });
                    }}
                  />
                  <div>{localize("fan_speed")}</div>
                  {internalFanSpeed}
                </ModeColumn>
              )}
              {shouldShowBatteryLevel && shouldShowFanControls && (
                <>
                  <Push />
                </>
              )}
              {shouldShowBatteryLevel && (
                <ModeColumn gap="0.5rem">
                  <FabCard size={40} disabled={isDocked} title={`${battery_level}%`} icon={batteryIconByLevel(battery_level)} />
                  <div>{localize("battery_level")}</div>
                  {`${battery_level}%`}
                </ModeColumn>
              )}
            </Row>
          )}
          <VacuumToolbar entity={_entity} hideToolbar={hideToolbar} shortcuts={shortcuts} />
        </Column>
      </VacuumSize>
    </Column>
  );
}
