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
import { Ripples, fallback, mq } from "@components";
import { motion } from "framer-motion";
import type { MotionProps } from "framer-motion";
import { useLongPress } from "react-use";
import { capitalize } from "lodash";
import { icons, activeColors } from "../../Shared/ClimateControls/shared";
import { ErrorBoundary } from "react-error-boundary";

const StyledClimateCard = styled(motion.div)`
  all: unset;
  padding: 1rem;
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  width: calc(100% - 2rem);
  aspect-ratio: 2/0.74;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  cursor: pointer;
  background-color: var(--ha-S300);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: box-shadow, background-color;
  &.disabled {
    cursor: not-allowed;
    opacity: 0.8;
  }
  &:not(.disabled):hover {
    background-color: var(--ha-S400);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  }
`;

const StyledRipples = styled(Ripples)`
  flex-shrink: 1;
  ${mq(
    ["mobile"],
    `
    width: 100%;
  `,
  )}
  ${mq(
    ["tablet", "smallScreen"],
    `
    width: calc(50% - var(--gap, 0rem) / 2);
  `,
  )}
  ${mq(
    ["desktop", "mediumScreen"],
    `
    width: calc((100% - 2 * var(--gap, 0rem)) / 3);
  `,
  )}
  ${mq(
    ["largeDesktop"],
    `
    width: calc((100% - 3 * var(--gap, 0rem)) / 4);
  `,
  )}
`;

const Gap = styled.div`
  height: 20px;
`;
const StyledFabCard = styled(FabCard)`
  color: var(--ha-300);
  background-color: var(--ha-S200);
  &:hover:not(:disabled) {
    background-color: var(--ha-S100);
  }
`;

const LayoutBetween = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
`;

const Title = styled.div`
  color: var(--ha-S400-contrast);
  font-size: 0.7rem;
`;
const Icon = styled.div`
  color: var(--ha-A400);
`;
const Description = styled.div`
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
  text-transform: capitalize;
  color: var(--ha-S50-contrast);
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
  cssStyles,
  id,
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
  const longPressEvent = useLongPress(
    (e) => {
      // ignore on right click
      if (("button" in e && e.button === 2) || isUnavailable || disabled)
        return;
      setOpenModal(true);
    },
    {
      isPreventDefault: false,
    },
  );

  const titleValue = useMemo(() => {
    if (isUnavailable) {
      return entity.state;
    }
    if (isOff) {
      return "Off";
    }
    return hvac_action;
  }, [hvac_action, entity.state, isUnavailable, isOff]);

  const havacModesToUse =
    (hvacModes ?? []).length === 0 ? hvac_modes : hvacModes ?? [];

  return (
    <>
      <StyledRipples
        id={id}
        className={`${disabled || isUnavailable ? "disabled" : ""} ${
          isUnavailable ? "unavailable" : ""
        } ${className ?? ""}`}
        disabled={disabled || isUnavailable}
        borderRadius="1rem"
        cssStyles={cssStyles}
        whileTap={{ scale: disabled || isUnavailable ? 1 : 0.9 }}
      >
        <StyledClimateCard
          {...longPressEvent}
          className={`${disabled || isUnavailable ? "disabled" : ""}`}
          layoutId={`${_entity}-climate-card`}
          {...rest}
          onClick={() => {
            if (isUnavailable || disabled || typeof onClick !== "function")
              return;
            onClick(entity);
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
                      ? "var(--ha-S500-contrast)"
                      : activeColors[currentMode as HvacMode],
                }}
              >
                {entityIcon || domainIcon}
              </Icon>{" "}
              {title} - {titleValue}
            </Description>
            <Title>{entity.custom.relativeTime}</Title>
          </LayoutBetween>
          <Row justifyContent="flex-start">
            <Title
              style={{
                paddingLeft: "2rem",
              }}
            >
              Speed: {entity.attributes.fan_mode || "Unknown"}, Temperature:{" "}
              {entity.attributes.temperature}°C
            </Title>
          </Row>
          <Gap />
          <Row fullWidth gap="0.5rem" wrap="nowrap">
            {havacModesToUse
              .concat()
              .filter((x) => !!x)
              .map((mode) => (
                <StyledFabCard
                  size={35}
                  disabled={disabled || isUnavailable}
                  iconColor={
                    currentMode === mode ? activeColors[mode] : undefined
                  }
                  preventPropagation
                  key={mode}
                  title={capitalize(mode.replace(/_/g, " "))}
                  active={currentMode === mode}
                  icon={icons[mode]}
                  onClick={() => {
                    entity.service.setHvacMode({
                      hvac_mode: mode,
                    });
                  }}
                />
              ))}
          </Row>
        </StyledClimateCard>
      </StyledRipples>
      <ModalByEntityDomain
        hvacModes={hvacModes}
        hideCurrentTemperature={hideCurrentTemperature}
        hideFanMode={hideFanMode}
        hideState={hideState}
        hideUpdated={hideUpdated}
        entity={_entity}
        title={title ?? "Unknown title"}
        onClose={() => {
          setOpenModal(false);
        }}
        open={openModal}
        id={`${_entity}-climate-card`}
      />
    </>
  );
}
/** The ClimateCard is a card to easily interact with climate entities, whilst it's not documented below, the types are correct and you can also pass through anything related to ModalClimateControlsProps */
export function ClimateCard(props: ClimateCardProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "ClimateCard" })}>
      <_ClimateCard {...props} />
    </ErrorBoundary>
  );
}
