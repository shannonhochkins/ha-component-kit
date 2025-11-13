import styled from "@emotion/styled";
import { localize, isUnavailableState, OFF, useStore } from "@hakit/core";
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
  const isUnavailable = isUnavailableState(entity.state);
  const formatter = useStore((store) => store.formatter);
  const _computeCurrentStatus = (): string | undefined => {
    if (entity.attributes.current_temperature != null && entity.attributes.current_humidity != null) {
      return `${formatter.attributeValue(entity, "current_temperature")}/
      ${formatter.attributeValue(entity, "current_humidity")}`;
    }

    if (entity.attributes.current_temperature != null) {
      return formatter.attributeValue(entity, "current_temperature");
    }

    if (entity.attributes.current_humidity != null) {
      return formatter.attributeValue(entity, "current_humidity");
    }

    return undefined;
  };

  const _localizeState = (): string => {
    if (isUnavailable) {
      return localize("unavailable");
    }

    const stateString = formatter.stateValue(entity);

    if (entity.attributes.hvac_action && entity.state !== OFF) {
      const actionString = formatter.attributeValue(entity, "hvac_action");
      return `${actionString} (${stateString})`;
    }

    return stateString;
  };

  const _computeTarget = (): string => {
    if (entity.attributes.target_temp_low != null && entity.attributes.target_temp_high != null) {
      return `${formatter.attributeValue(entity, "target_temp_low")}-${formatter.attributeValue(entity, "target_temp_high")}`;
    }

    if (entity.attributes.temperature != null) {
      return formatter.attributeValue(entity, "temperature");
    }
    if (entity.attributes.target_humidity_low != null && entity.attributes.target_humidity_high != null) {
      return `${formatter.attributeValue(entity, "target_humidity_low")}-${formatter.attributeValue(entity, "target_humidity_high")}`;
    }

    if (entity.attributes.humidity != null) {
      return formatter.attributeValue(entity, "humidity");
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
                <>- {formatter.attributeValue(entity, "preset_mode")}</>
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
