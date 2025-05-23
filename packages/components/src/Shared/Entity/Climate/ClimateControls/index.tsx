import { Menu, FabCard, ButtonBar, ButtonBarButton, fallback } from "@components";
import type { EntityName, FilterByDomain } from "@hakit/core";
import { useEntity, useHass, HvacMode, toReadableString, OFF, localize, supportsFeatureFromAttributes, UNAVAILABLE } from "@hakit/core";
import { useState, useEffect, useMemo, useCallback } from "react";
import styled from "@emotion/styled";
import { ErrorBoundary } from "react-error-boundary";
import { css } from "@emotion/react";
import type { HassConfig } from "home-assistant-js-websocket";
import {
  ClimateEntityFeature,
  ClimateBuiltInPresetMode,
  compareClimateHvacModes,
  ClimateBuiltInSwingMode,
  computeFanModeIcon,
  computeHvacModeIcon,
  computePresetModeIcon,
  computeSwingModeIcon,
  ClimateBuiltInFanMode,
  UNIT_F,
} from "./data";
import { ClimateControlSlider } from "./ClimateControlSlider";
import { ClimateHumiditySlider } from "./ClimateHumiditySlider";

type MainControl = "temperature" | "humidity";

const Wrapper = styled.div`
  color: var(--ha-500-contrast);
  width: 100%;
  .controls {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .controls-scroll {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    gap: 24px;
    padding: 0 24px;
  }
`;

export interface ClimateControlsProps extends Omit<React.ComponentPropsWithoutRef<"div">, "title"> {
  /** the name of your climate entity */
  entity: FilterByDomain<EntityName, "climate">;
  /** provide a list of hvacModes you want to support/display in the UI, will use all by default */
  hvacModes?: HvacMode[];
  /** use custom labels for the displayed hvac modes */
  hvacModeLabels?: Record<HvacMode, string>;
  /** hide the current temperature @default false */
  hideCurrentTemperature?: boolean;
  /** hide the hvac modes button @default false */
  hideHvacModes?: boolean;
  /** hide the swing modes button @default false */
  hideSwingModes?: boolean;
  /** hide the fan modes button @default false */
  hideFanModes?: boolean;
  /** hide the preset modes button @default false */
  hidePresetModes?: boolean;
  /** changed whenever the state changes */
  entityStateChanged?: (state: string) => void;
  /** the control mode */
  mainControl?: MainControl;
  /** The custom step increment for the climate entity, this is automatically retrieved from the entity */
  targetTempStep?: number;
}

function InternalClimateControls({
  entity: _entity,
  hvacModes,
  hvacModeLabels,
  hideCurrentTemperature,
  hideHvacModes,
  hideSwingModes,
  hideFanModes,
  hidePresetModes,
  entityStateChanged,
  cssStyles,
  className,
  targetTempStep,
  mainControl = "temperature",
  ...rest
}: ClimateControlsProps) {
  const [_mainControl, setMainControl] = useState<MainControl>(mainControl);
  const entity = useEntity(_entity);
  const isOff = entity.state === OFF;
  const { hvac_action, preset_mode, fan_mode } = entity.attributes;
  const fan_modes = entity.attributes.fan_modes as ClimateBuiltInFanMode[] | undefined;
  const preset_modes = entity.attributes.preset_modes as ClimateBuiltInPresetMode[] | undefined;
  const swing_modes = entity.attributes.swing_modes as ClimateBuiltInSwingMode[] | undefined;
  const modes = hvacModes ?? entity.attributes.hvac_modes;
  const [config, setConfig] = useState<HassConfig | null>(null);
  const { getConfig } = useHass();

  const supportTargetHumidity = supportsFeatureFromAttributes(entity.attributes, ClimateEntityFeature.TARGET_HUMIDITY);
  const supportFanMode = supportsFeatureFromAttributes(entity.attributes, ClimateEntityFeature.FAN_MODE);
  const supportPresetMode = supportsFeatureFromAttributes(entity.attributes, ClimateEntityFeature.PRESET_MODE);
  const supportSwingMode = supportsFeatureFromAttributes(entity.attributes, ClimateEntityFeature.SWING_MODE);

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

  useEffect(() => {
    setMainControl(mainControl);
  }, [mainControl]);

  const { target_temp_step } = entity.attributes;

  const _step = useMemo(() => {
    return targetTempStep ?? target_temp_step ?? (config?.unit_system.temperature === UNIT_F ? 1 : 0.5);
  }, [config?.unit_system.temperature, targetTempStep, target_temp_step]);

  const _handleFanModeChanged = useCallback(
    (value: ClimateBuiltInFanMode) => {
      entity.service.setFanMode({
        serviceData: {
          fan_mode: value,
        },
      });
    },
    [entity.service],
  );

  const _handleOperationModeChanged = useCallback(
    (value: HvacMode) => {
      entity.service.setHvacMode({
        serviceData: {
          hvac_mode: value,
        },
      });
    },
    [entity.service],
  );

  const _handleSwingmodeChanged = useCallback(
    (value: ClimateBuiltInSwingMode) => {
      entity.service.setSwingMode({
        serviceData: {
          swing_mode: value,
        },
      });
    },
    [entity.service],
  );

  const _handlePresetmodeChanged = useCallback(
    (value: ClimateBuiltInPresetMode) => {
      if (value) {
        entity.service.setPresetMode({
          serviceData: {
            preset_mode: value,
          },
        });
      }
    },
    [entity.service],
  );

  return (
    <Wrapper
      {...rest}
      className={`climate-card-controls ${className}`}
      css={css`
        ${cssStyles ?? ""}
      `}
    >
      <div className="controls">
        {_mainControl === "temperature" ? (
          <ClimateControlSlider targetTempStep={_step} entity={_entity} showCurrent={!hideCurrentTemperature} />
        ) : null}
        {_mainControl === "humidity" ? (
          <ClimateHumiditySlider targetTempStep={_step} entity={_entity} showCurrent={!hideCurrentTemperature} />
        ) : null}
        {supportTargetHumidity ? (
          <ButtonBar
            cssStyles={`
              margin-bottom: 12px;
            `}
          >
            <ButtonBarButton
              active={_mainControl === "temperature"}
              disabled={entity!.state === UNAVAILABLE}
              title={localize("temperature")}
              icon="mdi:thermometer"
              onClick={() => setMainControl("temperature")}
            />
            <ButtonBarButton
              active={_mainControl === "humidity"}
              disabled={entity!.state === UNAVAILABLE}
              title={localize("humidity")}
              onClick={() => setMainControl("humidity")}
              icon="mdi:water-percent"
            />
          </ButtonBar>
        ) : null}
        <div className={`controls-scroll`}>
          {modes && !hideHvacModes && (
            <Menu
              placement="top"
              items={modes
                .concat()
                .sort(compareClimateHvacModes)
                .map((mode) => {
                  return {
                    active: entity.state === mode,
                    icon: computeHvacModeIcon(mode),
                    label: hvacModeLabels?.[mode] ?? toReadableString(mode),
                    onClick: () => {
                      _handleOperationModeChanged(mode);
                    },
                  };
                })}
            >
              <FabCard
                icon={computeHvacModeIcon(entity.state as HvacMode)}
                disabled={entity.state === UNAVAILABLE}
                title={toReadableString(entity.state)}
              />
            </Menu>
          )}
          {supportPresetMode && !hidePresetModes && preset_modes && (
            <Menu
              placement="top"
              items={preset_modes.map((mode) => {
                return {
                  active: preset_mode === mode,
                  icon: computePresetModeIcon(mode),
                  label: toReadableString(mode),
                  onClick: () => {
                    _handlePresetmodeChanged(mode);
                  },
                };
              })}
            >
              <FabCard
                icon={computePresetModeIcon(preset_mode as ClimateBuiltInPresetMode)}
                disabled={entity.state === UNAVAILABLE}
                title={toReadableString(entity.attributes.preset_mode)}
              />
            </Menu>
          )}
          {supportFanMode && !hideFanModes && fan_modes && (
            <Menu
              placement="top"
              items={fan_modes.map((mode) => {
                return {
                  active: entity.attributes.fan_mode === mode,
                  icon: computeFanModeIcon(mode),
                  label: toReadableString(mode),
                  onClick: () => {
                    _handleFanModeChanged(mode);
                  },
                };
              })}
            >
              <FabCard
                icon={computeFanModeIcon(fan_mode as ClimateBuiltInFanMode)}
                disabled={entity.state === UNAVAILABLE}
                title={toReadableString(entity.attributes.fan_mode)}
              />
            </Menu>
          )}
          {supportSwingMode && !hideSwingModes && swing_modes && (
            <Menu
              placement="top"
              items={swing_modes.map((mode) => {
                return {
                  active: entity.attributes.swing_mode === mode,
                  icon: computeSwingModeIcon(mode),
                  label: toReadableString(mode),
                  onClick: () => {
                    _handleSwingmodeChanged(mode);
                  },
                };
              })}
            >
              <FabCard
                icon={computeSwingModeIcon(entity.attributes.swing_mode as ClimateBuiltInSwingMode)}
                disabled={entity.state === UNAVAILABLE}
                title={toReadableString(entity.attributes.swing_mode)}
              />
            </Menu>
          )}
        </div>
      </div>
    </Wrapper>
  );
}

/** This layout is shared for the popup for a buttonCard and fabCard when long pressing on a card with a climate entity, and also the climateCard, this will fill the width/height of the parent component */
export function ClimateControls(props: ClimateControlsProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "ClimateControls" })}>
      <InternalClimateControls {...props} />
    </ErrorBoundary>
  );
}
