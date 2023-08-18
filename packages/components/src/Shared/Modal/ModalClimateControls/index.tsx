import { useRef, useMemo, useState, useEffect } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { Thermostat } from 'react-thermostat';
import {
  Modal,
  Column,
  FabCard,
  Row,
} from "@components";
import type { ModalProps } from "@components";
import {
  useEntity,
  OFF,
  HvacMode,
} from "@hakit/core";
import { useDebounce } from 'react-use';

export interface ModalClimateControlsProps extends Omit<ModalProps, "children"> {
  entity: `${"climate"}.${string}`;
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

const ThermostatSize = styled.div`
  aspect-ratio: 1/1.7;
  height: 100%;
  max-height: 45vh;
  min-height: 300px;
  margin-bottom: 2rem;
  position: relative;
`;

type HvacModeData<T> = {
  [key in HvacMode]: T;
}

const colors = {
  auto: ['#fff', '#f9f9f9'],
  heat_cool: ['#dae8eb', '#cd5401'],
  heat: ['#cfac48', '#cd5401'],
  cool: ['#dae8eb', '#2c8e98'],
  off: ['#848484', '#383838'],
  fan_only: ['#fff', '#f9f9f9'],
  dry: ['#fff', '#ffc0bd'],
} satisfies HvacModeData<string[]>;

const activeColors = {
  auto: 'var(--ha-primary-active)',
  heat_cool: 'var(--ha-primary-active)',
  heat: '#cd5401',
  cool: '#2c8e98',
  off: '#848484',
  fan_only: 'var(--ha-primary-active)',
  dry: '#ffc0bd',
} satisfies HvacModeData<string>;

const icons = {
  auto: 'mdi:thermometer-auto',
  heat_cool: 'mdi:autorenew',
  heat: 'mdi:fire',
  cool: 'mdi:snowflake',
  off: 'mdi:power',
  fan_only: 'mdi:fan',
  dry: 'mdi:water-percent',
} satisfies HvacModeData<string>;

const FanModeColumn = styled(Column)`
  position: absolute;
  top: 0%;
  left: -10%;
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



const FanMode = styled(FabCard)<{
  speed?: string;
}>`
  animation-name: ${spin};
  animation-duration: ${props => {
    const speed = (props.speed || '').toLowerCase();
    console.log('speed', speed);
    const low = speed.includes('low');
    const medium = speed.includes('mid') || speed.includes('medium');
    const high = speed.includes('high');
    if (low) return '4s';
    if (medium) return '1.8s';
    if (high) return '0.7s';
    return '0s';
  }};
  animation-iteration-count: infinite;
  animation-timing-function: linear;
`;

export function ModalClimateControls({
  entity: _entity,
  ...rest
}: ModalClimateControlsProps) {
  const entity = useEntity(_entity);
  const isOff = entity.state === OFF;
  const currentMode = entity.state in icons ? entity.state : "unknown-mode";
  const { current_temperature, fan_mode, fan_modes = [], hvac_action, hvac_modes, min_temp = 6, max_temp = 40, temperature = 20 } = entity.attributes || {};
  console.log('entity', entity);
  const [internalFanMode, setInternalFanMode] = useState<string | undefined>(fan_mode);
  const [internalTemperature, setInternalTemperature] = useState<number>(temperature);
  const stateRef = useRef<HTMLDivElement>(null);
  const titleValue = useMemo(() => {
    if (isOff) {
      return "Off";
    }
    return hvac_action;
  }, [hvac_action, isOff]);
  
  useDebounce(() => {
    entity.api.setTemperature({
      temperature: internalTemperature,
    })
  }, 200, [internalTemperature]);


  return (
    <Modal {...rest}>
      <Column fullHeight fullWidth wrap="nowrap">
        <State ref={stateRef}>{titleValue}</State>
        <Updated>{entity.custom.relativeTime}</Updated>
        <ThermostatSize>
          <Thermostat track={{
            colors: colors[entity.state],
          }} disabled={isOff} min={min_temp} max={max_temp} value={internalTemperature} onChange={(temp) => {
            setInternalTemperature(Number(temp.toFixed(0)))
          }} />
          <FanModeColumn gap="0.5rem">
            <FanMode disabled={isOff} title="Fan Mode" speed={isOff ? undefined : internalFanMode} active={!isOff} icon="mdi:fan" onClick={() => {
              const currentIndex = fan_modes.findIndex(mode => mode === internalFanMode);
              const fanMode = fan_modes[currentIndex + 1] ? fan_modes[currentIndex + 1] : fan_modes[0];
              setInternalFanMode(fanMode);
              entity.api.setFanMode({
                fan_mode: fanMode,
              });
            }} />
            {internalFanMode}
          </FanModeColumn>
        </ThermostatSize>

        <Row gap="0.5rem" wrap="nowrap">
          {(hvac_modes || [])
            .concat()
            .map((mode) => <FabCard iconColor={currentMode === mode ? activeColors[mode] : undefined} key={mode} title={mode} active={currentMode === mode} icon={icons[mode]} onClick={() => {
              entity.api.setHvacMode({
                hvac_mode: mode,
              });
            }} />)}
        </Row>
      </Column>
    </Modal>
  );
}
