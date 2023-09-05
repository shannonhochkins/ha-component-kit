import { useRef, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { Column, FabCard, Row } from "@components";
import { useEntity } from "@hakit/core";
import { useDebounce } from "react-use";
import type { MotionProps } from "framer-motion";
import { activeColors, icons } from "./shared";
import { Icon } from "@iconify/react";
import DEFAULT_IMAGE from './vacuum.svg';

type Extendable = MotionProps & React.ComponentPropsWithoutRef<"div">;

export interface VacuumControlsProps extends Extendable {
  entity: `${"vacuum"}.${string}`;
  /** provide a list of vacuumModes you want to support/display in the UI, will use all by default */
  vacuumModes?: string[];
  /** hide the current battery level @default false */
  hideCurrentBatteryLevel?: boolean;
  /** hide the fan mode fab @default false */
  hideFanMode?: boolean;
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
  position: absolute;
  top: 0;
  right: 1rem;
  font-size: 1.8rem;
  span {
    position: absolute;
    top: 0.2rem;
    right: -1rem;
    font-size: 0.8rem;
  }
`;

const Current = styled.div`
  font-size: 0.6rem;
  text-transform: uppercase;
  position: absolute;
  bottom: -0.6rem;
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
    case 'cleaning': {
      return <Row gap="0.5rem">
        <FabCard title="pause" size={35} icon="mdi:pause" onClick={() => entity.api.pause()} />
        <FabCard title="stop" size={35} icon="mdi:stop" onClick={() => entity.api.stop()} />
        <FabCard title="return to base" size={35} icon="mdi:home-map-marker"onClick={() => entity.api.returnToBase()} />
      </Row>;
    }

    case 'paused': {
      return <Row gap="0.5rem">
        <FabCard title="start" size={35} icon="mdi:play"
          onClick={() => entity.api.startPause()}
        />
        <FabCard title="return to base" size={35} icon="mdi:home-map-marker"onClick={() => entity.api.returnToBase()} />
      </Row>
    }

    case 'returning': {
      return <Row gap="0.5rem">
        <FabCard title="start" size={35} icon="mdi:play" onClick={() => entity.api.startPause()} />
        <FabCard title="pause" size={35} icon="mdi:pause" onClick={() => entity.api.pause()} />
      </Row>
    }
    case 'docked':
    case 'idle':
    default: {
      const dockButton = <FabCard title="return to base" size={35} icon="mdi:home-map-marker"onClick={() => entity.api.returnToBase()} />

      return <Row gap="0.5rem">
        <FabCard title="start" size={35} icon="mdi:play" onClick={() => entity.api.start()} />
        <FabCard title="locate" size={35} icon="mdi:map-marker" onClick={() => entity.api.locate()} />
        {entity.state === 'idle' ? dockButton : null}
      </Row>
    }
  }
}

/** This layout is shared for the popup for a buttonCard and fabCard when long pressing on a card with a vacuum entity, and also the vacuumCard, this will fill the width/height of the parent component */
export function VacuumControls({
  entity: _entity,
  vacuumModes,
  hideCurrentBatteryLevel = false,
  hideFanMode = false,
  hideState = false,
  hideUpdated = false,
  hideToolbar = false,
  customImage = DEFAULT_IMAGE,
  ...rest
}: VacuumControlsProps) {
  const entity = useEntity(_entity);
  const isDocked = entity.state === 'docked';
  // I suggest you always show the state, regardless of the icon if you don't have something supported in icons, the mode will show
  // as unknown mode instead of the actual state value, best to show a default icon in the case where you don't
  // have one set in the icons object
  const stateIcon = entity.state in icons ? icons[entity.state] : "mdi:question-box-outline";
  const { battery_level, fan_speed, fan_speed_list } = entity.attributes || {};
  const [internalFanSpeed, setInternalFanSpeed] = useState(fan_speed);
  const stateRef = useRef<HTMLDivElement>(null);
  const titleValue = useMemo(() => {
    if (isDocked) {
      return "docked";
    }
    return "cleaning";
  }, [isDocked]);

  useDebounce(
    () => {
      if (typeof internalFanSpeed === 'string') {
        entity.api.setFanSpeed({
          fan_speed: internalFanSpeed,
        });
      }
    },
    200,
    [internalFanSpeed],
  );

  return (
    <Column fullHeight fullWidth wrap="nowrap" {...rest}>
      {!hideState && <State ref={stateRef}>{titleValue}</State>}
      {!hideUpdated && <Updated>{entity.custom.relativeTime}</Updated>}
      <VacuumSize>
        <Column gap="0.5rem">
          <VacuumImage src={customImage} />
          {!hideFanMode && !isDocked && (
            <FanModeColumn gap="0.5rem">
              <FanMode
                size={40}
                disabled={isDocked}
                title="Fan Mode"
                speed={isDocked ? undefined : internalFanSpeed}
                active={!isDocked}
                icon="mdi:fan"
                onClick={() => {
                  const list = fan_speed_list ?? [];
                  const currentIndex = list.findIndex(
                    speed => speed.toLowerCase() === (internalFanSpeed ?? '').toLowerCase(),
                  );
                  const fanSpeed = list[currentIndex + 1]
                    ? list[currentIndex + 1]
                    : list[0];
                  setInternalFanSpeed(fanSpeed);
                  entity.api.setFanSpeed({
                    fan_speed: fanSpeed,
                  });
                }}
              />
              <div>Fan Mode</div>
              {internalFanSpeed}
            </FanModeColumn>
          )}
          {!hideCurrentBatteryLevel && (
            <>
              <div>Battery Level {battery_level}</div>
              <CurrentBatteryLevel>
                {battery_level}
                <span>%</span>
                <Current>CURRENT</Current>
              </CurrentBatteryLevel>
            </>
          )}
          StateIcon: <Icon icon={stateIcon} />
          State: {entity.state}
          <VacuumToolbar entity={_entity} hideToolbar={hideToolbar} />
        </Column>
      </VacuumSize>
    </Column>
  );
}
