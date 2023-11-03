import styled from "@emotion/styled";
import { useEntity, useIconByDomain, useIconByEntity, computeDomain, isUnavailableState, ON } from "@hakit/core";
import type { EntityName, ExtractDomain, HassEntityWithService } from "@hakit/core";
import { Icon } from "@iconify/react";
import { Row, fallback, ModalByEntityDomain, type ModalPropsHelper } from "@components";
import { ErrorBoundary } from "react-error-boundary";
import React, { useId, useMemo } from "react";
import { motion } from "framer-motion";
import { useLongPress } from "use-long-press";

const IconWrapper = styled(Row)`
  width: 100%;
  max-width: 2rem;
`;
const Name = styled.div`
  flex-grow: 1;
  font-size: 0.8rem;
  color: var(--ha-S50-contrast);
  font-weight: 500;
  span {
    width: 100%;
    font-size: 0.7rem;
    font-weight: 400;
    display: block;
    margin-top: 0.2rem;
    color: var(--ha-S500-contrast);
  }
`;
const State = styled.div`
  max-width: 5rem;
  font-size: 0.8rem;
  font-weight: 400;
  text-align: right;
  white-space: nowrap;
  color: var(--ha-S300-contrast);
`;

const EntityRowInner = styled(motion.div)`
  width: 100%;
  padding: 1rem;
  transition: background-color var(--ha-transition-duration) var(--ha-easing);
  &:hover {
    background-color: var(--ha-S400);
  }
`;

export interface EntitiesCardRowProps<E extends EntityName> {
  /** The name of the entity to render */
  entity: E;
  /** the icon name to use @default entity_icon */
  icon?: string;
  /** the name of the entity @default friendly_name */
  name?: string;
  /** the function to call when the row is clicked @default undefined */
  onClick?: (entity: HassEntityWithService<ExtractDomain<E>>) => void;
  /** the function to render the state @default undefined */
  renderState?: (entity: HassEntityWithService<ExtractDomain<E>>) => React.ReactElement;
  /** include last updated time @default false */
  includeLastUpdated?: boolean;
  /** props to pass to the modal for each row */
  modalProps?: Partial<ModalPropsHelper<ExtractDomain<E>>>;
}

function _EntitiesCardRow<E extends EntityName>({
  entity: _entity,
  icon: _icon,
  name: _name,
  renderState,
  onClick,
  modalProps,
  includeLastUpdated = false,
}: EntitiesCardRowProps<E>) {
  const _id = useId();
  const [openModal, setOpenModal] = React.useState(false);
  const entity = useEntity(_entity);
  const domain = computeDomain(_entity);
  const domainIcon = useIconByDomain(domain === null ? "unknown" : domain);
  const entityIcon = useIconByEntity(_entity || "unknown");
  const isUnavailable = isUnavailableState(entity?.state);
  const title = useMemo(() => _name ?? entity.attributes.friendly_name ?? entity.attributes.entity_id, [_name, entity]);
  const on = entity?.state === ON;
  const iconColor = on ? entity.custom.hexColor : "var(--ha-S500-contrast)";

  const bind = useLongPress(
    () => {
      if (typeof _entity === "string" && !openModal) {
        setOpenModal(true);
      }
    },
    {
      threshold: 300,
      cancelOnMovement: true,
      cancelOutsideElement: true,
      filterEvents(e) {
        return !("button" in e && e.button === 2);
      },
    },
  );

  return (
    <>
      <EntityRowInner className={`entities-card-row`} layoutId={_id} {...bind()}>
        <Row className={`row`} wrap="nowrap" gap="1rem" fullWidth onClick={() => onClick && onClick(entity)}>
          <IconWrapper
            className={`icon-wrapper`}
            style={{
              opacity: isUnavailable ? "0.3" : "1",
              color: iconColor,
              filter: (on && entity?.custom.brightness) || "brightness(100%)",
            }}
          >
            {_icon ? <Icon className={`icon`} icon={_icon} /> : entityIcon ?? domainIcon}
          </IconWrapper>
          <Name className={`name`}>
            {title}
            {includeLastUpdated && <span>{entity.custom.relativeTime}</span>}
          </Name>
          <State className={`state`}>
            {typeof renderState === "function" ? (
              renderState(entity)
            ) : isUnavailable ? (
              entity.state
            ) : (
              <>
                {entity.state}
                {entity.attributes?.unit_of_measurement ? entity.attributes?.unit_of_measurement : ""}
              </>
            )}
          </State>
        </Row>
      </EntityRowInner>
      {typeof _entity === "string" && (
        <ModalByEntityDomain
          entity={_entity as EntityName}
          title={title ?? "Unknown title"}
          onClose={() => {
            setOpenModal(false);
          }}
          open={openModal}
          id={_id}
          {...modalProps}
        />
      )}
    </>
  );
}

/** The EntitiesCardRow component is a child component of the EntitiesCard component. */
export function EntitiesCardRow<E extends EntityName>(props: EntitiesCardRowProps<E>) {
  return (
    <ErrorBoundary {...fallback({ prefix: "EntitiesCardRow" })}>
      <_EntitiesCardRow {...props} />
    </ErrorBoundary>
  );
}
