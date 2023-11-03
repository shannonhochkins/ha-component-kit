import { useMemo, useEffect, useCallback, useState } from "react";
import styled from "@emotion/styled";
import { ControlSlider, Column, Row, FabCard, useBreakpoint, fallback, ButtonGroup, ButtonGroupButton } from "@components";
import { useEntity, supportsFeatureFromAttributes, isUnavailableState } from "@hakit/core";
import type { EntityName, CoverEntity, FilterByDomain } from "@hakit/core";
import { ErrorBoundary } from "react-error-boundary";

export const enum CoverEntityFeature {
  OPEN = 1,
  CLOSE = 2,
  SET_POSITION = 4,
  STOP = 8,
  OPEN_TILT = 16,
  CLOSE_TILT = 32,
  STOP_TILT = 64,
  SET_TILT_POSITION = 128,
}

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

const Label = styled.span`
  font-size: 0.8rem;
  margin-top: 0.5rem;
`;

function computeTitleDisplay(entity: CoverEntity, position?: number) {
  const isUnavailable = isUnavailableState(entity.state);
  const statePosition =
    !isUnavailable && entity.state !== "closed" ? entity.attributes.current_position ?? entity.attributes.current_tilt_position : undefined;

  const currentPosition = position ?? statePosition;

  const suffix = currentPosition && currentPosition !== 100 ? currentPosition ?? entity.attributes.current_position ?? "" : "";
  if (typeof position === "number") {
    return `${position === 0 ? "closed" : position === 100 ? "open" : entity.state}${suffix ? ` - ${suffix}%` : ""}`;
  }
  return `${entity.state}${suffix ? ` - ${suffix}%` : ""}`;
}

type Mode = "position" | "button";
type Orientation = "vertical" | "horizontal";

export interface CoverControlsProps {
  entity: FilterByDomain<EntityName, "cover">;
  onStateChange?: (state: string) => void;
  mode?: Mode;
  /** the orientation of the slider, useful if you want to represent the slider to match your curtain/blind orientation */
  orientation?: Orientation;
  /** reverse the direction of the slider, useful if you want the ui to reflect the actual cover, the UI will not change, but the actions will reverse, open becomes close, just changes the order */
  reverse?: boolean;
}

function _CoverControls({
  entity: _entity,
  mode = "position",
  orientation = "vertical",
  reverse = false,
  onStateChange,
}: CoverControlsProps) {
  const entity = useEntity(_entity);
  const isUnavailable = isUnavailableState(entity.state);
  const supports = useCallback(
    (feature: CoverEntityFeature) => {
      return supportsFeatureFromAttributes(entity.attributes, feature);
    },
    [entity.attributes],
  );
  const supportsPosition = supports(CoverEntityFeature.SET_POSITION);
  const supportsTiltPosition = supports(CoverEntityFeature.SET_TILT_POSITION);

  const supportsOpenClose = supports(CoverEntityFeature.OPEN) || supports(CoverEntityFeature.CLOSE) || supports(CoverEntityFeature.STOP);

  const supportsTilt =
    supports(CoverEntityFeature.OPEN_TILT) || supports(CoverEntityFeature.CLOSE_TILT) || supports(CoverEntityFeature.STOP_TILT);

  const [_mode, setMode] = useState<Mode>(mode ?? supportsPosition ? "position" : "button");

  const device = useBreakpoint();
  const titleValue = useMemo(() => {
    return computeTitleDisplay(entity);
  }, [entity]);

  useEffect(() => {
    if (supportsPosition && mode === "position") {
      setMode(mode);
    } else {
      setMode("button");
    }
  }, [mode, supportsPosition]);

  useEffect(() => {
    if (onStateChange) {
      onStateChange(titleValue);
    }
  }, [titleValue, onStateChange]);

  return (
    <Column
      fullHeight
      wrap="nowrap"
      justifyContent={device.xxs ? "flex-start" : "center"}
      style={{
        padding: device.xxs ? "1rem" : "0",
      }}
    >
      <Column>
        {_mode === "position" && (
          <>
            <Row
              gap="1rem"
              style={{
                flexDirection: orientation === "vertical" ? "row" : "column",
              }}
            >
              {supportsPosition && typeof entity.attributes.current_position !== "undefined" && (
                <Column>
                  <ControlSlider
                    sliderColor={isUnavailable ? undefined : `var(--ha-A400)`}
                    min={0}
                    max={100}
                    mode={reverse ? "end" : "start"}
                    vertical={orientation === "vertical"}
                    thickness={device.xxs ? 70 : 100}
                    borderRadius={24}
                    value={entity.attributes.current_position}
                    disabled={isUnavailable}
                    onChange={(value) => {
                      if (onStateChange) onStateChange(computeTitleDisplay(entity, Math.round(value)));
                    }}
                    onChangeApplied={(value) => {
                      entity.service.setCoverPosition({
                        position: value,
                      });
                      if (onStateChange) onStateChange(computeTitleDisplay(entity, Math.round(value)));
                    }}
                  />
                  <Label>POSITION</Label>
                </Column>
              )}
              {supportsTiltPosition && typeof entity.attributes.current_tilt_position !== "undefined" && (
                <Column>
                  <ControlSlider
                    sliderColor={isUnavailable ? undefined : `var(--ha-A400)`}
                    min={0}
                    max={100}
                    mode={reverse ? "end" : "start"}
                    vertical={orientation === "vertical"}
                    thickness={device.xxs ? 70 : 100}
                    borderRadius={24}
                    value={entity.attributes.current_tilt_position}
                    disabled={isUnavailable}
                    onChange={(value) => {
                      if (onStateChange) onStateChange(computeTitleDisplay(entity, Math.round(value)));
                    }}
                    onChangeApplied={(value) => {
                      entity.service.setCoverTiltPosition({
                        tilt_position: value,
                      });
                      if (onStateChange) onStateChange(computeTitleDisplay(entity, Math.round(value)));
                    }}
                  />
                  <Label>TILT</Label>
                </Column>
              )}
            </Row>
          </>
        )}
        {_mode === "button" && (
          <>
            <Row
              gap="1rem"
              style={{
                flexDirection: orientation === "vertical" ? "row" : "column",
              }}
            >
              {supportsOpenClose && (
                <Column>
                  <ButtonGroup thickness={device.xxs ? 70 : 100} reverse={reverse} orientation={orientation}>
                    <ButtonGroupButton
                      title="Open Cover"
                      entity={_entity}
                      service="openCover"
                      icon={reverse ? "mdi:arrow-down" : "mdi:arrow-up"}
                    />
                    <ButtonGroupButton title="Stop Cover" entity={_entity} service="stopCover" icon={"mdi:stop-circle-outline"} />
                    <ButtonGroupButton
                      title="Close Cover"
                      entity={_entity}
                      service="closeCover"
                      icon={!reverse ? "mdi:arrow-down" : "mdi:arrow-up"}
                    />
                  </ButtonGroup>
                  <Label>CONTROLS</Label>
                </Column>
              )}
              {supportsTilt && (
                <Column>
                  <ButtonGroup thickness={device.xxs ? 70 : 100} reverse={reverse} orientation={orientation}>
                    <ButtonGroupButton
                      title="Open cover tilt"
                      entity={_entity}
                      service="openCoverTilt"
                      icon={reverse ? "mdi:arrow-collapse" : "mdi:arrow-expand"}
                    />
                    <ButtonGroupButton title="Stop Cover tilt" entity={_entity} service="stopCoverTilt" icon={"mdi:stop-circle-outline"} />
                    <ButtonGroupButton
                      title="Close Cover tilt"
                      entity={_entity}
                      service="closeCoverTilt"
                      icon={!reverse ? "mdi:arrow-collapse" : "mdi:arrow-expand"}
                    />
                  </ButtonGroup>
                  <Label>TILT CONTROLS</Label>
                </Column>
              )}
            </Row>
          </>
        )}
        {(supportsTilt || supportsPosition) && (
          <ButtonBar>
            <FabCard
              icon="mdi:hamburger-menu"
              active={_mode === "position"}
              onClick={() => {
                setMode("position");
              }}
            />
            <FabCard
              icon="mdi:swap-vertical"
              active={_mode === "button"}
              onClick={() => {
                setMode("button");
              }}
            />
          </ButtonBar>
        )}
      </Column>
    </Column>
  );
}

/** This component will render controls for a cover, it supports tilt & position sliders, as well as a button mode
 *
 * The below demos show how different cover entities will render based on what they support, this is automatic and no need to configure anything.
 */
export function CoverControls(props: CoverControlsProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "CoverControls" })}>
      <_CoverControls {...props} />
    </ErrorBoundary>
  );
}
