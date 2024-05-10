import React, { useRef, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { ButtonBarButton, ButtonBar, Column, FabCard, Row, ButtonBarButtonProps } from "@components";
import { useEntity, type HassEntityWithService, type EntityName, batteryIconByLevel } from "@hakit/core";
import { useDebounce } from "react-use";
import type { MotionProps } from "framer-motion";
import { icons } from "./shared";
import { Icon } from "@iconify/react";
import DEFAULT_IMAGE from './vacuum.svg';

type Extendable = MotionProps & React.ComponentPropsWithoutRef<"div">;

interface Shortcut extends Omit<ButtonBarButtonProps<EntityName>, 'onClick'> {
  onClick: (entity: HassEntityWithService<'vacuum'>) => void;
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
  /** change the default custom image to display @default vacuum svg */
  customImage?: string;
}

const State = styled.div`
  font-weight: 400;
  font-size: 36px;
  line-height: 44px;
  user-select: none;
  text-transform: capitalize;
`;

const Updated = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.1px;
  padding: 4px 0px;
  margin-bottom: 20px;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  margin-bottom: 2rem;
`;

const VacuumSize = styled.div`
  aspect-ratio: 1/1.7;
  height: 100%;
  max-height: 45vh;
  min-height: 300px;
  margin-bottom: 2rem;
  position: relative;
`;

const VacuumImage = styled.img`
  width: 60%;
`;

// .vacuum.on,
// .vacuum.cleaning,
// .vacuum.mowing,
// .vacuum.edgecut,
// .vacuum.auto,
// .vacuum.spot,
// .vacuum.edge,
// .vacuum.single_room {
//   animation: cleaning 5s linear infinite;
// }

const FanModeColumn = styled(Column)`
  position: absolute;
  top: 0%;
  left: 0%;
  font-size: 0.8rem;
`;

const spin = keyframes`
  from {
    transform:rotate(0deg);
  }
  to {
    transform:rotate(360deg);
  }
`;

const CurrentBatteryLevel = styled.div`
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 1rem 0;
  span {
    padding-bottom: 0.8rem;
    font-size: 0.8rem;
  }
`;

const Current = styled.div`
  font-size: 0.6rem;
  text-transform: uppercase;
  padding-bottom: 0.5rem;
`;

const FanMode = styled(FabCard)<{
  speed?: string;
}>`
  animation-name: ${spin};
  animation-duration: ${(props) => {
    const speed = (props.speed || "").toLowerCase();
    const silent = speed.includes("silent");
    const standard = speed.includes("standard");
    const medium = speed.includes("medium");
    const turbo = speed.includes("turbo");
    if (silent) return "4s";
    if (standard) return "2.5s";
    if (medium) return "1.8s";
    if (turbo) return "0.7s";
    return "0s";
  }};
  animation-iteration-count: infinite;
  animation-timing-function: linear;
`;

export function VacuumToolbar({
  entity: _entity,
  hideToolbar = false,
}: {
  entity: `${"vacuum"}.${string}`;
  hideToolbar?: boolean;
}) {
  const entity = useEntity(_entity);

  if (hideToolbar) {
    return null;
  }
  switch (entity.state) {
    case 'on':
    case 'auto':
    case 'spot':
    case 'edge':
    case 'single_room':
    case 'mowing':
    case 'edgecut':
    case 'cleaning': {
      return <Row gap="0.5rem">
        <ButtonBar>
          <ButtonBarButton
            size={35}
            rippleProps={{
              preventPropagation: true,
            }}
            title="Play"
            icon={icons['on']}
            onClick={() => entity.service.pause()} />
          <ButtonBarButton
            size={35}
            rippleProps={{
              preventPropagation: true,
            }}
            title="Stop"
            icon={icons['stop']}
            onClick={() => entity.service.stop()} />
          <ButtonBarButton
            size={35}
            rippleProps={{
              preventPropagation: true,
            }}
            title="Return to base"
            icon={icons['returning']}
            onClick={() => entity.service.returnToBase()} />
        </ButtonBar>
      </Row>;
    }

    case 'paused': {
      return <Row gap="0.5rem">
        <ButtonBar>
          <ButtonBarButton
            size={35}
            rippleProps={{
              preventPropagation: true,
            }}
            title="Play"
            icon={icons['on']}
            onClick={() => entity.service.pause()} />
          <ButtonBarButton
            size={35}
            rippleProps={{
              preventPropagation: true,
            }}
            title="Return to base"
            icon={icons['returning']}
            onClick={() => entity.service.returnToBase()} />
        </ButtonBar>
      </Row>
    }

    case 'returning': {
      return <Row gap="0.5rem">
        <ButtonBar>
          <ButtonBarButton
            size={35}
            rippleProps={{
              preventPropagation: true,
            }}
            title="Play"
            icon={icons['on']}
            onClick={() => entity.service.pause()} />
          <ButtonBarButton
            size={35}
            rippleProps={{
              preventPropagation: true,
            }}
            title="Stop"
            icon={icons['stop']}
            onClick={() => entity.service.stop()} />
        </ButtonBar>
      </Row>
    }
    case 'docked':
    case 'idle':
    default: {
      return <Row gap="0.5rem">
        <ButtonBar>
          <ButtonBarButton
            size={35}
            rippleProps={{
              preventPropagation: true,
            }}
            title="Play"
            icon={icons['on']}
            onClick={() => entity.service.pause()} />
          <ButtonBarButton
            size={35}
            rippleProps={{
              preventPropagation: true,
            }}
            title="Locate"
            icon={'mdi:map-marker'}
            onClick={() => entity.service.locate()} />
          {entity.state === 'idle' && <ButtonBarButton
            size={35}
            rippleProps={{
              preventPropagation: true,
            }}
            title="Return to base"
            icon={icons['returning']}
            onClick={() => entity.service.returnToBase()} />}
        </ButtonBar>
      </Row>
    }
  }
}

/** TODO TODO */
export function VacuumControls({
  entity: _entity,
  hideCurrentBatteryLevel = false,
  hideFanModes = false,
  hideToolbar = false,
  customImage = DEFAULT_IMAGE,
  ...rest
}: VacuumControlsProps) {
  const entity = useEntity(_entity);
  const isDocked = entity.state === 'docked';
  const { battery_level, fan_speed, fan_speed_list } = entity.attributes || {};
  const [internalFanSpeed, setInternalFanSpeed] = useState(fan_speed);

  useDebounce(
    () => {
      if (typeof internalFanSpeed === 'string') {
        entity.service.setFanSpeed({
          fan_speed: internalFanSpeed,
        });
      }
    },
    200,
    [internalFanSpeed],
  );
  const fanSpeedList = fan_speed_list ?? [];

  return (
    <Column fullHeight fullWidth wrap="nowrap" {...rest}>
      <VacuumSize>
        <Column gap="0.5rem">
          <VacuumImage src={customImage} />
          {!hideFanModes && !isDocked && fanSpeedList.length > 0 && (
            <FanModeColumn gap="0.5rem">
              <FanMode
                size={40}
                disabled={isDocked}
                title={internalFanSpeed}
                speed={isDocked ? undefined : internalFanSpeed}
                active={!isDocked}
                icon="mdi:fan"
                onClick={() => {
                  const currentIndex = fanSpeedList.findIndex(
                    speed => speed.toLowerCase() === (internalFanSpeed ?? '').toLowerCase(),
                  );
                  const fanSpeed = fanSpeedList[currentIndex + 1]
                    ? fanSpeedList[currentIndex + 1]
                    : fanSpeedList[0];
                  setInternalFanSpeed(fanSpeed);
                  entity.service.setFanSpeed({
                    fan_speed: fanSpeed,
                  });
                }}
              />
              <div>Fan Mode</div>
              {internalFanSpeed}
            </FanModeColumn>
          )}
          {!hideCurrentBatteryLevel && typeof battery_level === 'number' && (
            <CurrentBatteryLevel>
              <Current>BATTERY LEVEL</Current>
              <Row>
                <Icon icon={batteryIconByLevel(battery_level)} />
                {battery_level}
                <span>%</span>
              </Row>
            </CurrentBatteryLevel>
          )}
          <VacuumToolbar entity={_entity} hideToolbar={hideToolbar} />
        </Column>
      </VacuumSize>
    </Column>
  );
}
