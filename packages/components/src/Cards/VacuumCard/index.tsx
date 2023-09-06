import React, { useState, useMemo } from "react";
import styled from "@emotion/styled";
import type { HassEntityWithApi } from "@hakit/core";
import { ModalByEntityDomain } from "@components";
import type { VacuumControlsProps } from "@components";
import { useEntity, useIconByDomain, useIconByEntity } from "@hakit/core";
import { Ripples } from "@components";
import { motion } from "framer-motion";
import type { MotionProps } from "framer-motion";
import { useLongPress } from "react-use";
import { VacuumToolbar } from "../../Shared/VacuumControls";
import { activeColors } from "../../Shared/VacuumControls/shared";

const StyledVacuumCard = styled(motion.button)`
  all: unset;
  padding: 1rem;
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  width: var(--ha-device-climate-card-width);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  cursor: pointer;
  background-color: var(--ha-primary-background);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: box-shadow, background-color;
  &:hover {
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
type Extendable = Omit<VacuumControlsProps, "onClick"> &
  MotionProps &
  Omit<React.ComponentPropsWithoutRef<"button">, "onClick">;
export interface VacuumCardProps extends Extendable {
  /** An optional override for the title */
  title?: string;
  /** the onClick handler is called when the card is pressed  */
  onClick?: (entity: HassEntityWithApi<"vacuum">) => void;
}

/** The VacuumCard is a card to easily interact with vacuum entities, whilst it's not documented below, the types are correct and you can also pass through anything related to ModalVacuumControlsProps */
export function VacuumCard({
  entity: _entity,
  title: _title,
  onClick,
  hideCurrentBatteryLevel,
  hideState = false,
  hideUpdated = false,
  hideToolbar = false,
  ...rest
}: VacuumCardProps): JSX.Element {
  const [openModal, setOpenModal] = useState(false);
  const entity = useEntity(_entity);
  const entityIcon = useIconByEntity(_entity);
  const domainIcon = useIconByDomain("vacuum");
  const title = _title || entity.attributes.friendly_name;
  const longPressEvent = useLongPress((e) => {
    // ignore on right click
    if ("button" in e && e.button === 2) return;
    setOpenModal(true);
  });

  const titleValue = useMemo(() => {
    return entity.state;
  }, [entity.state]);

  return (
    <>
      <Ripples borderRadius="1rem" whileTap={{ scale: 0.9 }}>
        <StyledVacuumCard
          {...longPressEvent}
          layoutId={`${_entity}-vacuum-card`}
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
                    entity.state === "unknown"
                      ? undefined
                      : activeColors[entity.state],
                }}
              >
                {entityIcon || domainIcon}
              </Icon>{" "}
              {title} - {titleValue}
            </Description>
            <Title>{entity.custom.relativeTime}</Title>
          </LayoutBetween>
          <Gap />
          <VacuumToolbar entity={_entity} hideToolbar={hideToolbar} />
        </StyledVacuumCard>
      </Ripples>
      <ModalByEntityDomain
        entity={_entity}
        title={title || "Unknown title"}
        hideCurrentBatteryLevel={hideCurrentBatteryLevel}
        hideState={hideState}
        hideUpdated={hideUpdated}
        onClose={() => {
          setOpenModal(false);
        }}
        open={openModal}
        id={`${_entity}-vacuum-card`}
      />
    </>
  );
}
