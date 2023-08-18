import { useRef, useMemo, useState } from "react";
import styled from "@emotion/styled";
import {
  Modal,
  ControlSlider,
  Column,
  FabCard,
  ColorTempPicker,
  ColorPicker,
} from "@components";
import type { ModalProps } from "@components";
import { AnimatePresence } from "framer-motion";
import {
  useEntity,
  LIGHT_COLOR_MODES,
  OFF,
  ON,
  useLightBrightness,
  lightSupportsBrightness,
  lightSupportsColorMode,
  lightSupportsColor,
} from "@hakit/core";
import colorWheel from "./color_wheel.png";

export interface ModalLightControlsProps extends Omit<ModalProps, "children"> {
  entity: `${"light"}.${string}`;
}

const State = styled.div`
  font-weight: 400;
  font-size: 36px;
  line-height: 44px;
  user-select: none;
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
  margin-bottom: 24px;
`;

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
  background-color: transparent;
  transition: background var(--ha-transition-duration) var(--ha-easing);
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
  }
  ${(props) =>
    props.active &&
    `
    background-color: white;
    &:after {
      inset: 2px;
      border: 2px solid var(--ha-primary-background);
    }
  `}
  svg {
    display: none;
  }
`;

const FabCardTemp = styled(FabCard)`
  background-color: transparent;
  transition: background var(--ha-transition-duration) var(--ha-easing);
  &:after {
    content: "";
    position: absolute;
    inset: 0px;
    border-radius: 50%;
    border: 0px;
    background: linear-gradient(
      0deg,
      rgb(166, 209, 255) 0%,
      rgb(255, 255, 255) 50%,
      rgb(255, 160, 0) 100%
    );
    transition: var(--ha-transition-duration) var(--ha-easing);
    transition-property: inset, border;
  }
  ${(props) =>
    props.active &&
    `
    background-color: white;
    &:after {
      inset: 2px;
      border: 2px solid var(--ha-primary-background);
    }
  `}
  svg {
    display: none;
  }
`;

export function ModalLightControls({
  entity: _entity,
  ...rest
}: ModalLightControlsProps) {
  const [control, setControl] = useState<MainControl>("brightness");
  const entity = useEntity(_entity);
  const stateRef = useRef<HTMLDivElement>(null);
  const brightnessValue = useLightBrightness(entity);
  const titleValue = useMemo(() => {
    if (entity.state === OFF) {
      return "Off";
    }
    if (entity.state === ON) {
      return `${brightnessValue}%`;
    }
    return "Unavailable";
  }, [brightnessValue, entity.state]);

  const supportsColorTemp = lightSupportsColorMode(
    entity,
    LIGHT_COLOR_MODES.COLOR_TEMP
  );
  const supportsColor = lightSupportsColor(entity);
  const supportsBrightness = lightSupportsBrightness(entity);

  return (
    <Modal {...rest}>
      <Column fullHeight fullWidth wrap="nowrap">
        <State ref={stateRef}>{titleValue}</State>
        <Updated>{entity.custom.relativeTime}</Updated>
        <Column>
          {supportsColorTemp || supportsColor || supportsBrightness ? (
            <>
              {control === "color_temp" && (
                <ColorTempPicker
                  onChange={(kelvin) => {
                    if (stateRef.current) {
                      if (kelvin === null) {
                        stateRef.current.innerText = `${titleValue}`;
                      } else {
                        stateRef.current.innerText = `${kelvin}K`;
                      }
                    }
                  }}
                  onChangeApplied={() => {
                    if (stateRef.current) {
                      stateRef.current.innerText = `${titleValue}`;
                    }
                  }}
                  entity={_entity}
                />
              )}
              {control === "color" && <ColorPicker entity={_entity} />}
              {supportsBrightness && control === "brightness" && (
                <ControlSlider
                  sliderColor={entity.custom.color}
                  min={1}
                  max={100}
                  thickness={100}
                  borderRadius={24}
                  value={brightnessValue}
                  disabled={entity.state === "off"}
                  onChange={(value) => {
                    if (!stateRef.current) return;
                    stateRef.current.innerText = `${Math.round(value)}%`;
                  }}
                  onChangeApplied={(value) => {
                    entity.api.turnOn({
                      brightness_pct: value,
                    });
                    if (!stateRef.current) return;
                    stateRef.current.innerText = `${Math.round(value)}%`;
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
              entity.api.toggle();
            }}
          />
          {supportsColorTemp ||
            supportsColor ||
            (supportsBrightness && <Separator />)}
          <AnimatePresence>
            {supportsBrightness && (
              <FabCard
                key={`${_entity}-brightness`}
                icon="mdi:brightness-6"
                onClick={() => setControl("brightness")}
              />
            )}
            {supportsColor && (
              <FabCardColor
                key={`${_entity}-color`}
                active={control === "color"}
                onClick={() => setControl("color")}
              />
            )}
            {supportsColorTemp && (
              <FabCardTemp
                key={`${_entity}-color-temp`}
                active={control === "color_temp"}
                onClick={() => setControl("color_temp")}
              />
            )}
          </AnimatePresence>
        </ButtonBar>
      </Column>
    </Modal>
  );
}
