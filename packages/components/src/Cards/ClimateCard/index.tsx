import React, { useState, useMemo } from "react";
import styled from "@emotion/styled";
import type { HassEntityWithApi, HvacMode } from "@hakit/core";
import { ModalByEntityDomain, Row, FabCard } from "@components";
import type { ClimateControlsProps } from "@components";
import {
  useEntity,
  useIconByDomain,
  useIconByEntity,
  OFF,
  isUnavailableState,
} from "@hakit/core";
import { Ripples, fallback } from "@components";
import { motion } from "framer-motion";
import type { MotionProps } from "framer-motion";
import { useLongPress } from "react-use";
import { icons, activeColors } from "../../Shared/ClimateControls/shared";
import { ErrorBoundary } from "react-error-boundary";

const StyledClimateCard = styled(motion.div)`
  all: unset;
  padding: 1rem;
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  width: var(--ha-device-climate-card-width);
  aspect-ratio: 2/0.74;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  cursor: pointer;
  background-color: var(--ha-primary-background);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: box-shadow, background-color;
  &.disabled {
    cursor: not-allowed;
    opacity: 0.8;
  }
  &:not(.disabled):hover {
    background-color: var(--ha-primary-background-hover);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  }
`;

const Gap = styled.div`
  height: 20px;
`;

const LayoutBetween = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
`;

const Title = styled.div`
  color: var(--ha-secondary-color);
  font-size: 0.7rem;
`;
const Icon = styled.div`
  color: var(--ha-primary-active);
`;
const Description = styled.div`
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
  text-transform: capitalize;
`;
type Extendable = Omit<ClimateControlsProps, "onClick"> &
  MotionProps &
  Omit<React.ComponentPropsWithoutRef<"button">, "onClick">;
export interface ClimateCardProps extends Extendable {
  /** An optional override for the title */
  title?: string;
  /** the onClick handler is called when the card is pressed  */
  onClick?: (entity: HassEntityWithApi<"climate">) => void;
}

/** The ClimateCard is a card to easily interact with climate entities, whilst it's not documented below, the types are correct and you can also pass through anything related to ModalClimateControlsProps */
function _ClimateCard({
  entity: _entity,
  title: _title,
  onClick,
  hvacModes,
  hideCurrentTemperature,
  hideFanMode,
  hideState,
  hideUpdated,
  disabled,
  className,
  ...rest
}: ClimateCardProps): JSX.Element {
  const [openModal, setOpenModal] = useState(false);
  const entity = useEntity(_entity);
  const entityIcon = useIconByEntity(_entity);
  const domainIcon = useIconByDomain("climate");
  const currentMode = entity.state in icons ? entity.state : "unknown-mode";
  const title = _title || entity.attributes.friendly_name;
  const { hvac_action, hvac_modes } = entity.attributes;
  const isUnavailable = isUnavailableState(entity.state);
  const isOff = entity.state === OFF;
  const longPressEvent = useLongPress((e) => {
    // ignore on right click
    if (("button" in e && e.button === 2) || !isUnavailable || !disabled)
      return;
    setOpenModal(true);
  });

  const titleValue = useMemo(() => {
    if (isUnavailable) {
      return entity.state;
    }
    if (isOff) {
      return "Off";
    }
    return hvac_action;
  }, [hvac_action, entity.state, isUnavailable, isOff]);

  return (
    <>
      <Ripples
        disabled={disabled || isUnavailable}
        borderRadius="1rem"
        whileTap={{ scale: disabled || isUnavailable ? 1 : 0.9 }}
      >
        <StyledClimateCard
          {...longPressEvent}
          className={`${
            disabled || isUnavailable ? "disabled" : ""
          } ${className}`}
          layoutId={`${_entity}-climate-card`}
          {...rest}
          onClick={() => {
            if (typeof onClick === "function") {
              onClick(entity);
            }
          }}
        >
          <LayoutBetween>
            <Description>
              <Icon
                style={{
                  color:
                    isUnavailable || disabled
                      ? activeColors["off"]
                      : currentMode === "unknown-mode"
                      ? undefined
                      : activeColors[currentMode as HvacMode],
                }}
              >
                {entityIcon || domainIcon}
              </Icon>{" "}
              {title} - {titleValue}
            </Description>
            <Title>{entity.custom.relativeTime}</Title>
          </LayoutBetween>
          <Gap />
          <Row fullWidth gap="0.5rem" wrap="nowrap">
            {(hvacModes || hvac_modes || []).concat().map((mode) => (
              <FabCard
                size={35}
                disabled={disabled || isUnavailable}
                iconColor={
                  currentMode === mode ? activeColors[mode] : undefined
                }
                key={mode}
                title={mode}
                active={currentMode === mode}
                icon={icons[mode]}
                onClick={() => {
                  entity.api.setHvacMode({
                    hvac_mode: mode,
                  });
                }}
              />
            ))}
          </Row>
        </StyledClimateCard>
      </Ripples>
      <ModalByEntityDomain
        hvacModes={hvacModes}
        hideCurrentTemperature={hideCurrentTemperature}
        hideFanMode={hideFanMode}
        hideState={hideState}
        hideUpdated={hideUpdated}
        entity={_entity}
        title={title || "Unknown title"}
        onClose={() => {
          setOpenModal(false);
        }}
        open={openModal}
        id={`${_entity}-climate-card`}
      />
    </>
  );
}
export function ClimateCard(props: ClimateCardProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "ClimateCard" })}>
      <_ClimateCard {...props} />
    </ErrorBoundary>
  );
}
