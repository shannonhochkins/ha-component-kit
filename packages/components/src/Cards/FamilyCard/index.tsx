import { AvailableQueries, CardBase, CardBaseProps, Column, Row, fallback } from "@components";
import styled from "@emotion/styled";
import { EntityName, FilterByDomain, useEntity, useHass, useIcon } from "@hakit/core";
import { useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";

const FamilyBaseCard = styled(CardBase)`
  cursor: default;
`;

const PersonBaseCard = styled(CardBase)`
  background-color: var(--ha-S500);
  &:not(.disabled):hover,
  &:not(:disabled):hover {
    background-color: var(--ha-S600);
  }
`;

const PersonCardContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 8px;
  border-radius: 0.5rem;
  padding: 0.5rem;
  .state-text {
    font-size: 0.8rem;
    color: var(--ha-S500-contrast);
  }
`;

const UserAvatarDiv = styled.div<{ width: string; height: string; withBorder: boolean }>`
  position: relative;
  .avatar-image,
  .avatar-icon {
    border-radius: 100%;
    width: ${({ width }) => width};
    height: ${({ height }) => height};
    border: ${({ withBorder }) => (withBorder ? "2px solid var(--ha-50)" : "none")};
    box-shadow: ${({ withBorder }) => (withBorder ? "0 2px 2px rgba(0, 0, 0, 0.2)" : "none")};
    background: var(--ha-S900);
  }
  .avatar-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const UserAvatarStateIcon = styled.div`
  position: absolute;
  background-color: var(--ha-50);
  border-radius: 100%;
  top: calc(50% + 8px);
  right: calc(0% - 11px);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 28px;
  width: 28px;
  border: 3px solid var(--ha-S500);
`;

const FamilyCardContent = styled.div`
  padding: 1rem;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
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

export type PersonEntity = FilterByDomain<EntityName, "person">;
type PersonStateMap = {
  [key: string]:
    | {
        text: string;
        icon: string;
      }
    | undefined;
};

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
  | "ref";

export interface FamilyCardProps extends Omit<CardBaseProps<"div", EntityName>, OmitProperties> {
  /** array of strings in the form of "person.{identifier}" */
  personEntities: PersonEntity[];
  /** optional title of the card */
  title?: string;
  /** optional person.state to value object map, i.e:
   * {home: {text: "Home", icon: "mdi:home"}, not_home: { text: "Away", icon: "mdi:walk" }, zone_id: { text: "At work", icon: "mdi:briefcase" }, etc.}
   *
   * Defaults to:
   * { home: { text: "Home", icon: "mdi:home" }, not_home: { text: "Away", icon: "mdi:walk" } }
   */
  personStateMap?: PersonStateMap;
}

interface PersonProps extends Omit<CardBaseProps<"div", EntityName>, OmitProperties> {
  entity: PersonEntity;
  personStateMap: PersonStateMap;
}

export type UserAvatarProps = {
  entity: PersonEntity;
  iconSize?: { width: string; height: string };
  avatarSize?: { width: string; height: string };
  withBorder?: boolean;
  stateIcon?: string;
};

export const UserAvatar = ({
  entity,
  iconSize = { width: "2.5rem", height: "2.5rem" },
  avatarSize = { width: "3.5rem", height: "3.5rem" },
  withBorder = false,
  stateIcon,
}: UserAvatarProps) => {
  const person = useEntity(entity);
  const { joinHassUrl } = useHass();

  const userImage = useMemo(() => {
    const url = person.attributes.entity_picture ? person.attributes.entity_picture : null;
    return url && url.startsWith("/") ? joinHassUrl(url) : url;
  }, [person.attributes.entity_picture, joinHassUrl]);

  const userIcon = useIcon(person.attributes.icon ?? "mdi:account", iconSize);
  const renderedStateIcon = useIcon(stateIcon ?? "", { width: "16px", height: "16px", color: "var(--ha-700)" });

  return userImage ? (
    <UserAvatarDiv width={avatarSize.width} height={avatarSize.height} withBorder={withBorder}>
      <img src={userImage} className="avatar-image" />
      {stateIcon && renderedStateIcon && <UserAvatarStateIcon>{renderedStateIcon}</UserAvatarStateIcon>}
    </UserAvatarDiv>
  ) : (
    <UserAvatarDiv width={avatarSize.width} height={avatarSize.height} withBorder={withBorder}>
      <div className="avatar-icon">{userIcon}</div>
      {stateIcon && renderedStateIcon && <UserAvatarStateIcon>{renderedStateIcon}</UserAvatarStateIcon>}
    </UserAvatarDiv>
  );
};

const Person = ({ entity, personStateMap, ...rest }: PersonProps) => {
  const person = useEntity(entity);
  const stateText = personStateMap[person.state]?.text ?? person.state;
  const stateIcon = personStateMap[person.state]?.icon;
  return (
    <PersonBaseCard entity={entity} {...rest}>
      <PersonCardContent>
        <UserAvatar entity={entity} stateIcon={stateIcon} />
        <NameAndState>
          {person.attributes.friendly_name}
          <span>{stateText}</span>
        </NameAndState>
      </PersonCardContent>
    </PersonBaseCard>
  );
};

function _FamilyCard({
  personEntities,
  title,
  personStateMap = { home: { text: "Home", icon: "mdi:home" }, not_home: { text: "Away", icon: "mdi:walk" } },
  ...rest
}: FamilyCardProps): JSX.Element {
  return (
    <FamilyBaseCard disableRipples disableScale disableActiveState {...rest}>
      <FamilyCardContent>
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
            <Person personStateMap={personStateMap} entity={personEntity} key={personEntity} {...rest} />
          ))}
        </Row>
      </FamilyCardContent>
    </FamilyBaseCard>
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
