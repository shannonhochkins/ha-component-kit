import { CLIMATE_HVAC_ACTION_TO_MODE, ClimateEntityFeature, UNIT_F } from "./data";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  HvacAction,
  HvacMode,
  type FilterByDomain,
  type EntityName,
  isOffState,
  UNAVAILABLE,
  useEntity,
  useHass,
  supportsFeatureFromAttributes,
  stateActive,
  toReadableString,
  localize,
} from "@hakit/core";
import styled from "@emotion/styled";
import { useDebouncedCallback } from "use-debounce";
import { clamp } from "lodash";
import { FabCard, ControlSliderCircular, type ControlCircularSliderMode } from "@components";
import { colors } from "./shared";
import { BigNumber } from "./BigNumber";
import { HassConfig } from "home-assistant-js-websocket";

import { Icon } from "@iconify/react";

type Target = "value" | "low" | "high";

const SLIDER_MODES: Record<HvacMode, ControlCircularSliderMode> = {
  auto: "full",
  cool: "end",
  dry: "full",
  fan_only: "full",
  heat: "start",
  heat_cool: "full",
  off: "full",
};

const Wrapper = styled.div`
  position: relative;
  width: 320px;
  .container {
    position: relative;
  }
  .info * {
    margin: 0;
    pointer-events: auto;
  }
  .label {
    width: 60%;
    font-weight: 500;
    text-align: center;
    align-items: center;
    justify-content: center;
    display: flex;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .label span {
    white-space: nowrap;
  }
  .label ha-svg-icon {
    bottom: 5%;
  }
  .label.disabled {
    color: #444;
  }
  .buttons {
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
    margin: 0 auto;
    gap: 24px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .info {
    position: absolute;
    inset: 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.1px;
  }
  /* Dual target */
  .dual {
    display: flex;
    flex-direction: row;
    gap: 24px;
  }
  .dual button {
    outline: none;
    background: none;
    color: inherit;
    font-family: inherit;
    -webkit-tap-highlight-color: transparent;
    border: none;
    opacity: 0.5;
    padding: 0;
    transition:
      opacity 180ms ease-in-out,
      transform 180ms ease-in-out;
    cursor: pointer;
  }
  .dual button:focus-visible {
    transform: scale(1.1);
  }
  .dual button.selected {
    opacity: 1;
  }

  .control-slider-circular {
    width: 100%;
  }
`;

export interface ClimateControlSliderProps {
  entity: FilterByDomain<EntityName, "climate">;
  showCurrent?: boolean;
}

export function ClimateControlSlider({ entity: _entity, showCurrent = false }: ClimateControlSliderProps) {
  const [_targetTemperature, setTargetTemperature] = useState<Partial<Record<Target, number>>>({});
  const [_selectTargetTemperature, setSelectTargetTemperature] = useState<Target>("low");
  const entity = useEntity(_entity);
  const [config, setConfig] = useState<HassConfig | null>(null);
  const { getConfig } = useHass();

  const { min_temp: _min, max_temp: _max, target_temp_step, hvac_modes } = entity.attributes;

  const _step = useMemo(() => {
    return target_temp_step || (config?.unit_system.temperature === UNIT_F ? 1 : 0.5);
  }, [config?.unit_system.temperature, target_temp_step]);

  useEffect(() => {
    setTargetTemperature({
      value: entity.attributes.temperature,
      low: entity.attributes.target_temp_low,
      high: entity.attributes.target_temp_high,
    });
  }, [entity.attributes.temperature, entity.attributes.target_temp_low, entity.attributes.target_temp_high]);

  const supportsTargetTemperature = supportsFeatureFromAttributes(entity.attributes, ClimateEntityFeature.TARGET_TEMPERATURE);

  const supportsTargetTemperatureRange = supportsFeatureFromAttributes(entity.attributes, ClimateEntityFeature.TARGET_TEMPERATURE_RANGE);

  useEffect(() => {
    getConfig().then(setConfig);
  }, [getConfig]);

  const _callService = useCallback(
    (type: string) => {
      if (type === "high" || type === "low") {
        entity.service.setTemperature({
          target_temp_low: _targetTemperature.low,
          target_temp_high: _targetTemperature.high,
        });
        return;
      }
      entity.service.setTemperature({
        temperature: _targetTemperature.value,
      });
    },
    [_targetTemperature, entity],
  );

  const _debouncedCallService = useDebouncedCallback((target: Target) => _callService(target), 1000);

  const _handleButton = useCallback(
    (target: Target, step: number) => {
      const defaultValue = target === "high" ? _max : _min;

      let temp = _targetTemperature[target] ?? defaultValue;
      temp += step;
      temp = clamp(temp, _min, _max);
      if (target === "high" && _targetTemperature.low != null) {
        temp = clamp(temp, _targetTemperature.low, _max);
      }
      if (target === "low" && _targetTemperature.high != null) {
        temp = clamp(temp, _min, _targetTemperature.high);
      }
      setTargetTemperature((_targetTemperature) => ({
        ..._targetTemperature,
        [target]: temp,
      }));
      _debouncedCallService(target);
    },
    [_max, _min, _debouncedCallService, _targetTemperature],
  );

  const _handleSelectTemp = useCallback((target: Target) => {
    setSelectTargetTemperature(target);
  }, []);

  const _renderLabel = useCallback(() => {
    if (entity.state === UNAVAILABLE) {
      return <p className="label disabled">{entity.state ?? ""}</p>;
    }

    if (!supportsTargetTemperature && !supportsTargetTemperatureRange) {
      return <p className="label">{entity.state ?? ""}</p>;
    }

    const action = entity.attributes.hvac_action;

    const actionLabel = toReadableString(entity.attributes.hvac_action);

    return <p className="label">{action && action !== "off" && action !== "idle" ? actionLabel : localize("target_temperature")}</p>;
  }, [entity.attributes.hvac_action, entity.state, supportsTargetTemperature, supportsTargetTemperatureRange]);

  const _valueChanged = useCallback(
    (value: number, target: Target) => {
      setTargetTemperature((_targetTemperature) => ({
        ..._targetTemperature,
        [target]: value,
      }));
      setSelectTargetTemperature(target);
      _callService(target);
    },
    [_callService],
  );

  const _valueChanging = useCallback((value: number, target: Target) => {
    setTargetTemperature((_targetTemperature) => ({
      ..._targetTemperature,
      [target]: value,
    }));
    setSelectTargetTemperature(target);
  }, []);

  const _renderTemperatureButtons = useCallback(
    (target: Target, colored?: boolean) => {
      const lowColor = colors["heat"];
      const highColor = colors["cool"];

      const color = colored && stateActive(entity) ? (target === "high" ? highColor[1] : lowColor[1]) : undefined;

      return (
        <div className="buttons">
          <FabCard
            style={{
              borderColor: color,
            }}
            icon="mdi:minus"
            onClick={() => _handleButton(target, -_step)}
          />
          <FabCard
            style={{
              borderColor: color,
            }}
            icon="mdi:plus"
            onClick={() => _handleButton(target, _step)}
          />
        </div>
      );
    },
    [_handleButton, _step, entity],
  );

  const _renderTargetTemperature = useCallback(
    (temperature: number) => {
      const digits = _step.toString().split(".")?.[1]?.length ?? 0;
      const formatOptions: Intl.NumberFormatOptions = {
        maximumFractionDigits: digits,
        minimumFractionDigits: digits,
      };
      return (
        <BigNumber
          value={temperature}
          unit={config?.unit_system.temperature}
          unitPosition={_step === 1 ? "bottom" : "top"}
          formatOptions={formatOptions}
        />
      );
    },
    [_step, config],
  );

  const _renderCurrentTemperature = useCallback(
    (temperature?: number) => {
      if (!showCurrent || temperature == null) {
        return <p className="label">&nbsp;</p>;
      }
      if (isOffState(entity.state)) {
        return <p className="label disabled">{entity.state ?? ""}</p>;
      }

      return (
        <p className="label current">
          <Icon icon={"mdi:thermometer"} />
          <span>{temperature ?? entity.attributes.current_temperature}</span>
        </p>
      );
    },
    [entity.state, entity.attributes.current_temperature, showCurrent],
  );

  function render() {
    const mode = entity.state as HvacMode;
    const action = entity.attributes.hvac_action as HvacAction;
    const active = stateActive(entity);

    const stateColor = colors[mode];
    const lowColor = active ? colors["heat"][1] : colors["off"];
    const highColor = active ? colors["cool"][1] : colors["off"];

    let actionColor: string[] | undefined;
    if (action && action !== "idle" && action !== "off" && active) {
      actionColor = colors[mode] ?? colors[CLIMATE_HVAC_ACTION_TO_MODE[action]];
    }

    if (supportsTargetTemperature && _targetTemperature.value != null && entity.state !== UNAVAILABLE) {
      const heatCoolModes: HvacMode[] = (hvac_modes as HvacMode[]).filter((m) => ["heat", "cool", "heat_cool"].includes(m));
      const sliderMode = SLIDER_MODES[heatCoolModes.length === 1 && ["off", "auto"].includes(mode) ? heatCoolModes[1] : mode];

      return (
        <div className={`container`}>
          <ControlSliderCircular
            inactive={!active}
            mode={sliderMode}
            value={_targetTemperature.value}
            min={_min}
            max={_max}
            step={_step}
            current={entity.attributes.current_temperature}
            onChange={(value, type) => {
              _valueChanging(value, type);
            }}
            onChangeApplied={(value, type) => {
              _valueChanged(value, type);
            }}
            colors={{
              color: stateColor ? stateColor[1] : undefined,
              lowColor: lowColor ? lowColor[1] : undefined,
              highColor: highColor ? highColor[1] : undefined,
            }}
          />
          <div className="info">
            {_renderLabel()}
            {_renderTargetTemperature(_targetTemperature.value)}
            {_renderCurrentTemperature(entity.attributes.current_temperature)}
          </div>
          {_renderTemperatureButtons("value")}
        </div>
      );
    }

    if (
      supportsTargetTemperatureRange &&
      _targetTemperature.low != null &&
      _targetTemperature.high != null &&
      entity.state !== UNAVAILABLE
    ) {
      return (
        <div className={`container`}>
          <ControlSliderCircular
            inactive={!active}
            dual
            low={_targetTemperature.low}
            high={_targetTemperature.high}
            min={_min}
            max={_max}
            step={_step}
            current={entity.attributes.current_temperature}
            onChange={(value, type) => {
              _valueChanging(value, type);
            }}
            onChangeApplied={(value, type) => {
              _valueChanged(value, type);
            }}
            colors={{
              lowColor: lowColor ? lowColor[1] : undefined,
              highColor: highColor ? highColor[1] : undefined,
              color: actionColor ? actionColor[1] : undefined,
            }}
          />
          <div className="info">
            {_renderLabel()}
            <div className="dual">
              <button onClick={() => _handleSelectTemp("low")} className={`${_selectTargetTemperature === "low" ? "selected" : ""}`}>
                {_renderTargetTemperature(_targetTemperature.low)}
              </button>
              <button onClick={() => _handleSelectTemp("high")} className={`${_selectTargetTemperature === "high" ? "selected" : ""}`}>
                {_renderTargetTemperature(_targetTemperature.high)}
              </button>
            </div>
            {_renderCurrentTemperature(entity.attributes.current_temperature)}
          </div>
          {_renderTemperatureButtons(_selectTargetTemperature, true)}
        </div>
      );
    }
    return (
      <div className="container">
        <ControlSliderCircular
          mode="full"
          current={entity.attributes.current_temperature}
          min={_min}
          max={_max}
          step={_step}
          readonly
          disabled={!active}
        ></ControlSliderCircular>
        <div className="info">
          {_renderLabel()}
          {_renderCurrentTemperature(entity.attributes.current_temperature)}
        </div>
      </div>
    );
  }

  return <Wrapper>{render()}</Wrapper>;
}
