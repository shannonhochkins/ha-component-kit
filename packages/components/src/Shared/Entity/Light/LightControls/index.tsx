import { useMemo, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { ControlSlider, Column, FabCard, ColorTempPicker, ColorPicker, useBreakpoint, fallback } from "@components";
import { AnimatePresence } from "framer-motion";
import {
  useEntity,
  LIGHT_COLOR_MODES,
  OFF,
  ON,
  isUnavailableState,
  useLightBrightness,
  lightSupportsBrightness,
  lightSupportsColorMode,
  lightSupportsColor,
} from "@hakit/core";
import type { EntityName, FilterByDomain } from "@hakit/core";
import colorWheel from "./color_wheel.png";
import { ErrorBoundary } from "react-error-boundary";

const ButtonBar = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 56px;
  border-radius: 28px;
  background-color: rgba(120, 120, 120, 0.1);
  box-sizing: border-box;
  width: auto;
  padding: 4px;
  gap: 4px;
  margin-top: 24px;
`;

const Separator = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  width: 1px;
  height: 40px;
`;

type MainControl = "brightness" | "color_temp" | "color";

const FabCardColor = styled(FabCard)`
  position: relative;
  .icon {
    background-color: transparent;
    transition: background var(--ha-transition-duration) var(--ha-easing);
  }
  &:after {
    content: "";
    position: absolute;
    inset: 0px;
    border-radius: 50%;
    border: 0px;
    background-image: url(${colorWheel});
    background-size: 101%;
    transition: var(--ha-transition-duration) var(--ha-easing);
    transition-property: inset, border;
    pointer-events: none;
  }
  ${(props) =>
    props.active &&
    `
    .icon {
      background-color: white;
      transition: background var(--ha-transition-duration) var(--ha-easing);
    }
    &:after {
      inset: 2px;
      border: 2px solid var(--ha-S200);
    }
  `}
  svg {
    display: none;
  }
`;

const FabCardTemp = styled(FabCard)`
  position: relative;
  .icon {
    background-color: transparent;
    transition: background var(--ha-transition-duration) var(--ha-easing);
  }
  &:after {
    content: "";
    position: absolute;
    inset: 0px;
    border-radius: 50%;
    border: 0px;
    pointer-events: none;
    background: linear-gradient(0deg, rgb(166, 209, 255) 0%, rgb(255, 255, 255) 50%, rgb(255, 160, 0) 100%);
    transition: var(--ha-transition-duration) var(--ha-easing);
    transition-property: inset, border;
  }
  ${(props) =>
    props.active &&
    `
    .icon {
      background-color: white;
    }
    &:after {
      inset: 2px;
      border: 2px solid var(--ha-S200);
    }
  `}
  svg {
    display: none;
  }
`;

export interface LightControlsProps {
  entity: FilterByDomain<EntityName, "light">;
  onStateChange?: (state: string) => void;
}

function _LightControls({ entity: _entity, onStateChange }: LightControlsProps) {
  const [control, setControl] = useState<MainControl>("brightness");
  const entity = useEntity(_entity);
  const brightnessValue = useLightBrightness(entity);
  const device = useBreakpoint();
  const isUnavailable = isUnavailableState(entity.state);
  const titleValue = useMemo(() => {
    if (entity.state === OFF) {
      return "Off";
    }
    if (entity.state === ON) {
      return `${brightnessValue}%`;
    }
    return "Unavailable";
  }, [brightnessValue, entity.state]);

  useEffect(() => {
    if (onStateChange) {
      onStateChange(titleValue);
    }
  }, [titleValue, onStateChange]);

  const supportsColorTemp = lightSupportsColorMode(entity, LIGHT_COLOR_MODES.COLOR_TEMP);
  const supportsColor = lightSupportsColor(entity);
  const supportsBrightness = lightSupportsBrightness(entity);

  return (
    <Column
      fullHeight
      fullWidth
      wrap="nowrap"
      justifyContent={device.xxs ? "flex-start" : "center"}
      style={{
        padding: device.xxs ? "1rem" : "0",
      }}
    >
      <Column>
        {supportsColorTemp || supportsColor || supportsBrightness ? (
          <>
            {control === "color_temp" && (
              <ColorTempPicker
                onChange={(kelvin) => {
                  if (kelvin === null) {
                    if (onStateChange) onStateChange(`${titleValue}`);
                  } else {
                    if (onStateChange) onStateChange(`${kelvin}K`);
                  }
                }}
                onChangeApplied={() => {
                  if (onStateChange) onStateChange(`${titleValue}`);
                }}
                entity={_entity}
                disabled={isUnavailable || entity.state === OFF}
              />
            )}
            {control === "color" && <ColorPicker entity={_entity} />}
            {supportsBrightness && control === "brightness" && (
              <ControlSlider
                sliderColor={entity.custom.color}
                min={1}
                max={100}
                thickness={device.xxs ? 70 : 100}
                borderRadius={24}
                value={brightnessValue}
                disabled={isUnavailable || entity.state === OFF}
                onChange={(value) => {
                  if (onStateChange) onStateChange(`${Math.round(value)}%`);
                }}
                onChangeApplied={(value) => {
                  entity.service.turnOn({
                    brightness_pct: value,
                  });
                  if (onStateChange) onStateChange(`${Math.round(value)}%`);
                }}
              />
            )}
          </>
        ) : null}
      </Column>

      <ButtonBar>
        <FabCard
          icon="mdi:power"
          onClick={() => {
            entity.service.toggle();
          }}
        />
        {supportsColorTemp || supportsColor || (supportsBrightness && <Separator />)}
        <AnimatePresence>
          {supportsBrightness && <FabCard key={`${_entity}-brightness`} icon="mdi:brightness-6" onClick={() => setControl("brightness")} />}
          {supportsColor && <FabCardColor key={`${_entity}-color`} active={control === "color"} onClick={() => setControl("color")} />}
          {supportsColorTemp && (
            <FabCardTemp key={`${_entity}-color-temp`} active={control === "color_temp"} onClick={() => setControl("color_temp")} />
          )}
        </AnimatePresence>
      </ButtonBar>
    </Column>
  );
}

/** A component that will render the controls for a light, this is currently used by the popup for buttons */
export function LightControls(props: LightControlsProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "LightControls" })}>
      <_LightControls {...props} />
    </ErrorBoundary>
  );
}
