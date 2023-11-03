import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { keyframes, css } from "@emotion/react";
import { Thermostat } from "react-thermostat";
import { Column, FabCard, Row, fallback, mq } from "@components";
import type { EntityName, FilterByDomain } from "@hakit/core";
import { useEntity, OFF, useHass, HvacMode } from "@hakit/core";
import type { HassConfig } from "home-assistant-js-websocket";
import { useDebounce } from "react-use";
import type { MotionProps } from "framer-motion";
import { colors, activeColors, icons } from "./shared";
import { ErrorBoundary } from "react-error-boundary";
import { capitalize } from "lodash";

type Extendable = Omit<MotionProps & React.ComponentPropsWithoutRef<"div">, "title">;

export interface ClimateControlsProps extends Extendable {
  /** the name of your climate entity */
  entity: FilterByDomain<EntityName, "climate">;
  /** provide a list of hvacModes you want to support/display in the UI, will use all by default */
  hvacModes?: HvacMode[];
  /** hide the current temperature */
  hideCurrentTemperature?: boolean;
  /** hide the fan mode fab */
  hideFanMode?: boolean;
  /** changed whenever the state changes */
  entityStateChanged?: (state: string) => void;
}

const ThermostatSize = styled.div`
  aspect-ratio: 1/1.7;
  height: 100%;
  max-height: 45vh;
  min-height: 300px;
  margin-bottom: 2rem;
  position: relative;
  ${mq(
    ["xxs"],
    `
    max-height: 40vh;
  `,
  )}
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

const CurrentTemperature = styled.div`
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
    const low = speed.includes("low");
    const medium = speed.includes("mid") || speed.includes("medium");
    const high = speed.includes("high");
    if (low) return "4s";
    if (medium) return "1.8s";
    if (high) return "0.7s";
    return "0s";
  }};
  animation-iteration-count: infinite;
  animation-timing-function: linear;
`;

function _ClimateControls({
  entity: _entity,
  hvacModes,
  hideCurrentTemperature,
  hideFanMode,
  entityStateChanged,
  cssStyles,
  className,
  ...rest
}: ClimateControlsProps) {
  const entity = useEntity(_entity);
  const { getConfig } = useHass();
  const [config, setConfig] = useState<HassConfig | null>(null);
  const isOff = entity.state === OFF;
  const currentMode = entity.state in icons ? entity.state : "unknown-mode";
  const {
    current_temperature,
    fan_mode,
    fan_modes = [],
    hvac_action,
    hvac_modes,
    min_temp = 6,
    max_temp = 40,
    temperature = 20,
  } = entity.attributes || {};
  const [internalFanMode, setInternalFanMode] = useState<string | undefined>(fan_mode);
  const [internalTemperature, setInternalTemperature] = useState<number>(temperature);
  useEffect(() => {
    if (!entityStateChanged) return;
    if (isOff) {
      return entityStateChanged("Off");
    }
    return entityStateChanged(hvac_action ?? "unknown");
  }, [hvac_action, entityStateChanged, isOff]);

  useEffect(() => {
    getConfig().then(setConfig);
  }, [getConfig]);

  useDebounce(
    () => {
      entity.service.setTemperature({
        temperature: internalTemperature,
      });
    },
    200,
    [internalTemperature],
  );

  return (
    <Column
      className={`${className ?? ""} climate-controls`}
      css={css`
        ${cssStyles ?? ""}
      `}
      fullHeight
      fullWidth
      wrap="nowrap"
      {...rest}
    >
      <ThermostatSize>
        <Thermostat
          className="thermostat"
          valueSuffix={config?.unit_system.temperature}
          track={{
            colors: colors[entity.state as HvacMode],
          }}
          disabled={isOff}
          min={min_temp}
          max={max_temp}
          value={internalTemperature}
          onChange={(temp) => {
            setInternalTemperature(Number(temp.toFixed(0)));
          }}
        />
        {!hideFanMode && !isOff && (
          <FanModeColumn gap="0.5rem" className="column">
            <FanMode
              className="fan-mode"
              size={40}
              disabled={isOff}
              title="Fan Mode"
              speed={isOff ? undefined : internalFanMode}
              active={!isOff}
              icon="mdi:fan"
              onClick={() => {
                const currentIndex = fan_modes.findIndex((mode) => mode === internalFanMode);
                const fanMode = fan_modes[currentIndex + 1] ? fan_modes[currentIndex + 1] : fan_modes[0];
                setInternalFanMode(fanMode);
                entity.service.setFanMode({
                  fan_mode: fanMode,
                });
              }}
            />
            {internalFanMode}
          </FanModeColumn>
        )}
        {!hideCurrentTemperature && (
          <CurrentTemperature className="current-temperature">
            {current_temperature}
            <span>{config?.unit_system.temperature}</span>
            <Current className="text">CURRENT</Current>
          </CurrentTemperature>
        )}
      </ThermostatSize>

      <Row gap="0.5rem" wrap="nowrap" className="row">
        {(hvacModes || hvac_modes || []).concat().map((mode) => (
          <FabCard
            className="mode"
            size={40}
            iconColor={currentMode === mode ? activeColors[mode] : `var(--ha-300)`}
            key={mode}
            title={capitalize(mode.replace(/_/g, " "))}
            active={currentMode === mode}
            icon={icons[mode]}
            onClick={() => {
              entity.service.setHvacMode({
                hvac_mode: mode,
              });
            }}
          />
        ))}
      </Row>
    </Column>
  );
}
/** This layout is shared for the popup for a buttonCard and fabCard when long pressing on a card with a climate entity, and also the climateCard, this will fill the width/height of the parent component */
export function ClimateControls(props: ClimateControlsProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "ClimateControls" })}>
      <_ClimateControls {...props} />
    </ErrorBoundary>
  );
}
