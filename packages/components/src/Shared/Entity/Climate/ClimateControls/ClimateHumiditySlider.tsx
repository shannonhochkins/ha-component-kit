import { ClimateEntityFeature, UNIT_F } from "./data";
import { useState, useMemo, useEffect, useCallback } from "react";
import {
  type FilterByDomain,
  type EntityName,
  UNAVAILABLE,
  useEntity,
  supportsFeatureFromAttributes,
  stateActive,
  useHass,
} from "@hakit/core";
import { useDebouncedCallback } from "use-debounce";
import { clamp } from "lodash";
import { FabCard, ControlSliderCircular } from "@components";
import { colors } from "./shared";
import { BigNumber } from "./BigNumber";
import { Icon } from "@iconify/react";

export interface ClimateHumiditySliderProps {
  entity: FilterByDomain<EntityName, "climate">;
  showCurrent?: boolean;
  targetTempStep?: number;
}

export function ClimateHumiditySlider({ entity: _entity, targetTempStep, showCurrent = false }: ClimateHumiditySliderProps) {
  const entity = useEntity(_entity);
  const [_targetHumidity, setTargetHumidity] = useState<number | null>(entity.attributes.humidity ?? null);
  const config = useHass((state) => state.config);
  const { target_temp_step, min_humidity = 0, max_humidity = 100 } = entity.attributes;

  const _step = useMemo(() => {
    return targetTempStep ?? target_temp_step ?? (config?.unit_system.temperature === UNIT_F ? 1 : 0.5);
  }, [config?.unit_system.temperature, targetTempStep, target_temp_step]);

  useEffect(() => {
    setTargetHumidity(entity.attributes.humidity ?? null);
  }, [entity.attributes.humidity]);

  const _callService = useCallback(
    (targetHumidity: number) => {
      if (targetHumidity) {
        entity.service.setHumidity({
          serviceData: {
            humidity: targetHumidity,
          },
        });
      }
    },
    [entity.service],
  );

  const _debouncedCallService = useDebouncedCallback((target: number) => _callService(target), 1000, {
    leading: true,
    trailing: true,
  });

  const _valueChanged = useCallback(
    (value: number) => {
      if (isNaN(value)) return;
      setTargetHumidity(value);
      _callService(value);
    },
    [_callService],
  );

  const _valueChanging = useCallback((value: number) => {
    if (isNaN(value)) return;
    setTargetHumidity(value);
  }, []);

  const _handleButton = useCallback(
    (step: number) => {
      let humidity = _targetHumidity ?? min_humidity;
      humidity += step;
      humidity = clamp(humidity, min_humidity, max_humidity);
      setTargetHumidity(humidity);
      _debouncedCallService(humidity);
    },
    [_debouncedCallService, max_humidity, min_humidity, _targetHumidity],
  );

  const _renderLabel = useCallback(() => {
    if (entity.state === UNAVAILABLE) {
      return <p className="label disabled">{entity.state ?? UNAVAILABLE}</p>;
    }
    return <p className="label">Target</p>;
  }, [entity.state]);

  const _renderButtons = useCallback(() => {
    return (
      <div className="buttons">
        <FabCard icon="mdi:minus" onClick={() => _handleButton(-_step)} />
        <FabCard icon="mdi:plus" onClick={() => _handleButton(_step)} />
      </div>
    );
  }, [_handleButton, _step]);

  const _renderTarget = useCallback((humidity: number) => {
    const formatOptions = {
      maximumFractionDigits: 0,
    };

    return <BigNumber value={humidity} unit="%" unitPosition="bottom" formatOptions={formatOptions} />;
  }, []);

  const _renderCurrentHumidity = useCallback(
    (humidity?: number) => {
      if (!showCurrent || humidity == null) {
        return <p className="label">&nbsp;</p>;
      }

      return (
        <p className="label">
          <Icon icon="mdi:water-percent" />
          <span>{entity.attributes.current_humidity ?? humidity}</span>
        </p>
      );
    },
    [entity.attributes.current_humidity, showCurrent],
  );
  const supportsTargetHumidity = supportsFeatureFromAttributes(entity.attributes, ClimateEntityFeature.TARGET_HUMIDITY);
  const active = stateActive(entity);

  // Use humidifier state color
  const stateColor = active ? colors["cool"][1] : colors.off[1];

  const targetHumidity = _targetHumidity;
  const currentHumidity = entity.attributes.current_humidity;

  if (supportsTargetHumidity && targetHumidity != null && entity.state !== UNAVAILABLE) {
    return (
      <div className="container">
        <ControlSliderCircular
          inactive={!active}
          value={_targetHumidity ?? 0}
          min={min_humidity}
          max={max_humidity}
          step={_step}
          current={currentHumidity}
          onChangeApplied={_valueChanged}
          onChange={_valueChanging}
          colors={{
            color: stateColor,
          }}
        />
        <div className="info">
          {_renderLabel()} {_renderTarget(targetHumidity)}
          {_renderCurrentHumidity(entity.attributes.current_humidity)}
        </div>
        {_renderButtons()}
      </div>
    );
  }

  return (
    <div className="container${containerSizeClass}">
      <ControlSliderCircular current={entity.attributes.current_humidity} min={min_humidity} max={max_humidity} step={_step} disabled />
      <div className="info">
        {_renderLabel()}
        {_renderCurrentHumidity(entity.attributes.current_humidity)}
      </div>
    </div>
  );
}
