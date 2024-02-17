import type { AvailableQueries, CardBaseProps } from "@components";
import { CardBase, Column, EntitiesCard, EntitiesCardRow, Modal, Row, fallback } from "@components";
import styled from "@emotion/styled";
import { useEntity, useIcon, type EntityName } from "@hakit/core";
import { motion } from "framer-motion";
import { useId, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

const Card = styled(CardBase)`
  cursor: default;
`;

const StyledCircularImage = styled.img`
  border-radius: 100%;
  width: 4.5rem;
  height: 4.5rem;
  align-items: center;
  justify-content: center;
`;

const StyledCircularIcon = styled.div`
  border-radius: 100%;
  padding: 6px;
  width: 4.5rem;
  height: 4.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--ha-SA100);
  color: var(--ha-SA100-contrast);
`;

const Contents = styled.div`
  padding: 1rem;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
`;

const PersonContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 8px;
  background: var(--ha-S500);
  border-radius: 0.5rem;
  padding: 0.5rem;
  width: calc(50% - 0.25rem);
  &:hover {
    background: var(--ha-S700);
    cursor: pointer;
  }
  .state-text {
    font-size: 0.8rem;
    color: var(--ha-S500-contrast);
  }
`;

const NameAndState = styled.div`
  flex-grow: 1;
  font-size: 0.8rem;
  color: var(--ha-S50-contrast);
  font-weight: 500;
  text-align: center;
  span {
    width: 100%;
    font-size: 0.7rem;
    font-weight: 400;
    display: block;
    margin-top: 0.2rem;
    color: var(--ha-S500-contrast);
  }
`;

const Title = styled.div`
  font-size: 1rem;
  color: var(--ha-S50-contrast);
`;

type PersonEntity = Extract<EntityName, `person.${string}`>;
type PersonStateMap = Record<string, string>;

type OmitProperties =
  | "as"
  | "active"
  | "disabled"
  | "children"
  | "entity"
  | "title"
  | "onClick"
  | "modalProps"
  | "serviceData"
  | "service"
  | "disableRipples"
  | "ref"
  | "disableActiveState"
  | "disableScale";

export interface FamilyCardProps extends Omit<CardBaseProps<"div", EntityName>, OmitProperties> {
  /** array of strings in the form of "person.{identifier}" */
  personEntities: PersonEntity[];
  /** optional title of the card */
  title?: string;
  /** optional person.state to value object map, i.e:
   * {home: "Home", not_home: "Away", zoneId: "Zone", etc.}
   *
   * Defaults to:
   * {home: "Home", not_home: "Away"}
   */
  personStateMap?: PersonStateMap;
}

type PersonProps = {
  personEntity: PersonEntity;
  personStateMap: PersonStateMap;
};

const Person = ({ personEntity, personStateMap }: PersonProps) => {
  const _id = useId();
  const [open, setOpen] = useState(false);
  const person = useEntity(personEntity);
  const icon = useIcon(person.attributes.icon ?? "mdi:account", {
    width: "2.5rem",
    height: "2.5rem",
  });
  const stateText = personStateMap[person.state] || person.state;
  return (
    <>
      <PersonContainer
        layoutId={_id}
        onClick={() => {
          setOpen(true);
        }}
      >
        {person.attributes.entity_picture ? (
          <StyledCircularImage src={`${import.meta.env.VITE_HA_URL ?? ""}${person.attributes.entity_picture}`} />
        ) : (
          <StyledCircularIcon>{icon}</StyledCircularIcon>
        )}
        <NameAndState>
          {person.attributes.friendly_name}
          <span>{stateText}</span>
        </NameAndState>
      </PersonContainer>
      <Modal
        id={_id}
        open={open}
        title={person.attributes.friendly_name}
        onClose={() => {
          setOpen(false);
        }}
      >
        <EntitiesCard>
          <EntitiesCardRow entity={personEntity} />
        </EntitiesCard>
      </Modal>
    </>
  );
};

function _FamilyCard({
  personEntities,
  title,
  personStateMap = { home: "Home", not_home: "Away" },
  ...rest
}: FamilyCardProps): JSX.Element {
  return (
    <Card {...rest}>
      <Contents>
        {title && (
          <Column alignItems="flex-start" fullWidth>
            <Title>{title}</Title>
          </Column>
        )}
        <Row
          className="row"
          fullWidth
          wrap="wrap"
          justifyContent="flex-start"
          gap="0.5rem"
          style={{
            marginTop: "0.5rem",
          }}
        >
          {personEntities.map((personEntity) => (
            <Person personStateMap={personStateMap} personEntity={personEntity} key={personEntity} />
          ))}
        </Row>
      </Contents>
    </Card>
  );
}
/** A simple component to render an image with a title/icon similar to the lovelace picture card, you can also bind a click event to the card, which will also return the entity if provided
 * @example
 * <PictureCard entity="group.some_group_of_lights" onClick={(entity) => {
 *  entity.service.toggle();
 * }}
 */
export function FamilyCard(props: FamilyCardProps) {
  const defaultColumns: AvailableQueries = {
    xxs: 12,
    xs: 6,
    sm: 6,
    md: 4,
    lg: 4,
    xlg: 3,
  };
  return (
    <ErrorBoundary {...fallback({ prefix: "FamilyCard" })}>
      <_FamilyCard {...defaultColumns} {...props} />
    </ErrorBoundary>
  );
}
