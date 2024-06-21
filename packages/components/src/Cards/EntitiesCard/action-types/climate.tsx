import styled from "@emotion/styled";
import { localize, computeAttributeValueDisplay, computeStateDisplay, isUnavailableState, OFF, useHass } from "@hakit/core";
import { HassConfig, Connection } from "home-assistant-js-websocket";
import { useCallback } from "react";
import { CLIMATE_PRESET_NONE } from "../../../Shared/Entity/Climate/ClimateControls/data";
import { StateProps } from "./types";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  white-space: nowrap;

  .target,
  .current {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 0.25rem;
    justify-content: flex-end;
  }

  .target {
    color: var(--ha-S50-contrast);
  }

  .current {
    color: var(--ha-S500-contrast);
  }

  .state-label {
    font-weight: bold;
  }

  .unit {
  }
`;

export default function ClimateState({ entity, className, ...rest }: StateProps) {
  const { useStore } = useHass();
  const config = useStore((state) => state.config);
  const entities = useStore((store) => store.entities);
  const connection = useStore((store) => store.connection);
  const isUnavailable = isUnavailableState(entity.state);
  const computeAttribute = useCallback(
    (attribute: string) => computeAttributeValueDisplay(entity, config as HassConfig, entities, attribute),
    [entity, config, entities],
  );
  const computeState = useCallback(
    () => computeStateDisplay(entity, connection as Connection, config as HassConfig, entities, entity.state),
    [config, connection, entities, entity],
  );

  const _computeCurrentStatus = (): string | undefined => {
    if (entity.attributes.current_temperature != null && entity.attributes.current_humidity != null) {
      return `${computeAttribute("current_temperature")}/
      ${computeAttribute("current_humidity")}`;
    }

    if (entity.attributes.current_temperature != null) {
      return computeAttribute("current_temperature");
    }

    if (entity.attributes.current_humidity != null) {
      return computeAttribute("current_humidity");
    }

    return undefined;
  };

  const _localizeState = (): string => {
    if (isUnavailable) {
      return localize("unavailable");
    }

    const stateString = computeState();

    if (entity.attributes.hvac_action && entity.state !== OFF) {
      const actionString = computeAttribute("hvac_action");
      return `${actionString} (${stateString})`;
    }

    return stateString;
  };

  const _computeTarget = (): string => {
    if (entity.attributes.target_temp_low != null && entity.attributes.target_temp_high != null) {
      return `${computeAttribute("target_temp_low")}-${computeAttribute("target_temp_high")}`;
    }

    if (entity.attributes.temperature != null) {
      return computeAttribute("temperature");
    }
    if (entity.attributes.target_humidity_low != null && entity.attributes.target_humidity_high != null) {
      return `${computeAttribute("target_humidity_low")}-${computeAttribute("target_humidity_high")}`;
    }

    if (entity.attributes.humidity != null) {
      return computeAttribute("humidity");
    }

    return "";
  };

  const currentStatus = _computeCurrentStatus();

  return (
    <Wrapper className={`action-type-climate ${className}`} {...rest}>
      <div className="target">
        {!isUnavailable ? (
          <>
            <span className="state-label">
              {_localizeState()}
              {entity.attributes.preset_mode && entity.attributes.preset_mode !== CLIMATE_PRESET_NONE ? (
                <>- {computeAttribute("preset_mode")}</>
              ) : null}
            </span>
            <div className="unit">{_computeTarget()}</div>
          </>
        ) : (
          _localizeState()
        )}
      </div>
      {currentStatus && !isUnavailable ? (
        <div className="current">
          {localize("currently")}:<div className="unit">{currentStatus}</div>
        </div>
      ) : null}
    </Wrapper>
  );
}
