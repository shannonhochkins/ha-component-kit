import styled from "@emotion/styled";
import {
  useEntity,
  useIconByDomain,
  useIconByEntity,
  computeDomain,
  isUnavailableState,
  ON,
} from "@hakit/core";
import type { EntityName, AllDomains, HassEntityWithApi } from "@hakit/core";
import { Icon } from "@iconify/react";
import { Row, Column, fallback } from "@components";
import type { MotionProps } from "framer-motion";
import { motion } from "framer-motion";
import { ErrorBoundary } from "react-error-boundary";

const StyledEntitiesCard = styled(motion.button)`
  all: unset;
  padding: 1rem;
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  width: var(--ha-device-entities-card-width);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  cursor: pointer;
  background-color: var(--ha-primary-background);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: background-color, box-shadow;

  &:active {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  }
  &:hover {
    background-color: var(--ha-primary-background-hover);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  }
`;

const IconWrapper = styled(Row)`
  width: 100%;
  max-width: 2rem;
`;
const Name = styled.div`
  flex-grow: 1;
  font-size: 0.8rem;
  span {
    width: 100%;
    font-size: 0.7rem;
    display: block;
    margin-top: 0.2rem;
    color: var(--ha-secondary-color);
  }
`;
const State = styled.div`
  max-width: 5rem;
  font-size: 0.8rem;
  text-align: right;
  white-space: nowrap;
`;

interface EntityItem {
  /** The name of the entity to render */
  entity: EntityName;
  /** the icon name to use @default entity_icon */
  icon?: string;
  /** the name of the entity @default friendly_name */
  name?: string;
  /** the function to call when the row is clicked @default undefined */
  onClick?: <T extends AllDomains>(entity: HassEntityWithApi<T>) => void;
  /** the function to render the state @default undefined */
  renderState?: <T extends AllDomains>(
    entity: HassEntityWithApi<T>,
  ) => React.ReactElement;
  /** include last updated time @default false */
  includeLastUpdated?: boolean;
}

function EntityRow({
  entity: _entity,
  icon: _icon,
  name: _name,
  renderState,
  onClick,
  includeLastUpdated = false,
}: EntityItem) {
  const entity = useEntity(_entity);
  const domain = computeDomain(_entity);
  const domainIcon = useIconByDomain(domain === null ? "unknown" : domain);
  const entityIcon = useIconByEntity(_entity || "unknown");
  const isUnavailable = isUnavailableState(entity?.state);
  const on = entity?.state === ON;
  const iconColor = on ? entity.custom.hexColor : "white";

  return (
    <Row
      wrap="nowrap"
      gap="1rem"
      fullWidth
      onClick={() => onClick && onClick(entity)}
    >
      <IconWrapper
        style={{
          opacity: isUnavailable ? "0.3" : "1",
          color: iconColor,
          filter: (on && entity?.custom.brightness) || "brightness(100%)",
        }}
      >
        {_icon ? <Icon icon={_icon} /> : entityIcon ?? domainIcon}
      </IconWrapper>
      <Name>
        {_name ??
          entity.attributes.friendly_name ??
          entity.attributes.entity_id}
        {includeLastUpdated && <span>{entity.custom.relativeTime}</span>}
      </Name>
      <State>
        {typeof renderState === "function" ? (
          renderState(entity)
        ) : isUnavailable ? (
          entity.state
        ) : (
          <>
            {entity.state}
            {entity.attributes?.unit_of_measurement
              ? entity.attributes?.unit_of_measurement
              : ""}
          </>
        )}
      </State>
    </Row>
  );
}

type Extendable = Omit<
  React.ComponentProps<"button">,
  "title" | "onClick" | "ref"
> &
  MotionProps;
export interface EntitiesCardProps extends Extendable {
  /** The names of your entities */
  entities?: (EntityName | EntityItem)[];
  /** include the last updated time, will apply to every row unless specified on an individual EntityItem @default false */
  includeLastUpdated?: boolean;
}
/** The EntitiesCard component is an easy way to represent the state a of multiple entities with a simple layout, you can customize every part of every row with the EntityItem properties, the renderState and onClick both receive the entity object with the api properties. */
function _EntitiesCard({
  entities,
  includeLastUpdated = false,
  ...rest
}: EntitiesCardProps): JSX.Element {
  return (
    <StyledEntitiesCard {...rest}>
      <Column gap="1rem" fullWidth>
        {entities?.map((entity) => {
          const props: EntityItem =
            typeof entity === "string"
              ? {
                  entity,
                }
              : entity;
          return (
            <ErrorBoundary {...fallback({ prefix: "EntityRow" })}>
              <EntityRow includeLastUpdated={includeLastUpdated} {...props} />
            </ErrorBoundary>
          );
        })}
      </Column>
    </StyledEntitiesCard>
  );
}

export function EntitiesCard(props: EntitiesCardProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "EntitiesCard" })}>
      <_EntitiesCard {...props} />
    </ErrorBoundary>
  );
}
