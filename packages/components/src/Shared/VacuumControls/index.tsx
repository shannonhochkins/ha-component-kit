import { useRef, useMemo, useState, useEffect, Key } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { Column, FabCard, Row } from "@components";
import { useEntity, useHass, VacuumMode } from "@hakit/core";
import type { HassConfig } from "home-assistant-js-websocket";
import { useDebounce } from "react-use";
import type { MotionProps } from "framer-motion";
import { activeColors, icons } from "./shared";

type Extendable = MotionProps & React.ComponentPropsWithoutRef<"div">;

export interface VacuumControlsProps extends Extendable {
  entity: `${"vacuum"}.${string}`;
  /** provide a list of vacuumModes you want to support/display in the UI, will use all by default */
  VacuumModes?: VacuumMode[];
  /** hide the current battery level */
  hideCurrentBatteryLevel?: boolean;
  /** hide the fan mode fab */
  hideFanMode?: boolean;
  /** hide the state of the vacuum entity */
  hideState?: boolean;
  /** hide the last updated time */
  hideUpdated?: boolean;
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
    const silent = speed.includes("Silent");
    const standard = speed.includes("Standard");
    const medium = speed.includes("Medium");
    const turbo = speed.includes("Turbo");
    if (silent) return "4s";
    if (standard) return "2.5s";
    if (medium) return "1.8s";
    if (turbo) return "0.7s";
    return "0s";
  }};
  animation-iteration-count: infinite;
  animation-timing-function: linear;
`;
/** This layout is shared for the popup for a buttonCard and fabCard when long pressing on a card with a vacuum entity, and also the vacuumCard, this will fill the width/height of the parent component */
export function VacuumControls({
  entity: _entity,
  vacuumModes,
  hideCurrentBatteryLevel,
  hideFanMode,
  hideState,
  hideUpdated,
  ...rest
}: VacuumControlsProps) {
  const entity = useEntity(_entity);
  const { getConfig } = useHass();
  const [config, setConfig] = useState<HassConfig | null>(null);
  const isDocked = entity.state === "docked";
  const currentMode = entity.state in icons ? entity.state : "unknown-mode";
  const { battery_level, fan_speed } = entity.attributes || {};
  const [internalFanSpeed, setInternalFanSpeed] = useState<string>(fan_speed);
  const stateRef = useRef<HTMLDivElement>(null);
  const titleValue = useMemo(() => {
    if (isDocked) {
      return "docked";
    }
    return "cleaning";
  }, [isDocked]);

  useEffect(() => {
    getConfig().then(setConfig);
  }, [getConfig]);

  useDebounce(
    () => {
      entity.api.setFanSpeed({
        fan_speed: internalFanSpeed,
      });
    },
    200,
    [internalFanSpeed],
  );

  return (
    <Column fullHeight fullWidth wrap="nowrap" {...rest}>
      {!hideState && <State ref={stateRef}>{titleValue}</State>}
      {!hideUpdated && <Updated>{entity.custom.relativeTime}</Updated>}
      <VacuumSize>
        {/* <div>Vacuum Image</div> */}
        {!hideFanMode && !isDocked && (
          <FanModeColumn gap="0.5rem">
            {/* <FanMode
              size={40}
              disabled={isDocked}
              title="Fan Mode"
              speed={isDocked ? undefined : internalFanSpeed}
              active={!isDocked}
              icon="mdi:fan"
              onClick={() => {
                const currentIndex = fan_speed.findIndex(
                  (speed: string) => speed === internalFanSpeed,
                );
                const fanSpeed = fan_speed[currentIndex + 1]
                  ? fan_speed[currentIndex + 1]
                  : fan_speed[0];
                setInternalFanSpeed(fanSpeed);
                entity.api.setFanSpeed({
                  fan_speed: fanSpeed,
                });
              }}
            /> */}
            <div>Fan Mode</div>
            {internalFanSpeed}
          </FanModeColumn>
        )}
        {!hideCurrentBatteryLevel && (
          <div>Battery Level {battery_level}</div>
          // <CurrentBatteryLevel>
          //   {battery_level}
          //   {/* <span>{config?.unit_system.battery_level}</span> */}
          //   <Current>CURRENT</Current>
          // </CurrentBatteryLevel>
        )}
      </VacuumSize>

      {/* <Row gap="0.5rem" wrap="nowrap">
        {(vacuumModes || fan_speed || []).concat().map((mode) => (
          <FabCard
            size={40}
            iconColor={currentMode === mode ? activeColors[mode] : undefined}
            key={mode}
            title={mode}
            active={currentMode === mode}
            icon={icons[mode]}
            onClick={() => {
              entity.api.setFanSpeed({
                fan_speed: mode,
              });
            }}
          />
        ))}
      </Row> */}
    </Column>
  );
}
