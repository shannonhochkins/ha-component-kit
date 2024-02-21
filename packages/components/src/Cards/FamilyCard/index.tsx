import { AvailableQueries, CardBase, CardBaseProps, Column, PersonCard, PersonCardProps, Row, fallback } from "@components";
import styled from "@emotion/styled";
import { EntityName, FilterByDomain, useHass } from "@hakit/core";
import { Children, ReactElement, cloneElement, isValidElement } from "react";
import { ErrorBoundary } from "react-error-boundary";

const FamilyBaseCard = styled(CardBase)`
  cursor: default;
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

const Title = styled.div`
  font-size: 1rem;
  color: var(--ha-S50-contrast);
`;

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

export interface FamilyCardProps extends Omit<CardBaseProps<"div", FilterByDomain<EntityName, "person">>, OmitProperties> {
  /** the children for the FamilyCard, it accepts Person components */
  children: ReactElement<typeof PersonCard> | ReactElement<typeof PersonCard>[];
  /** optional title of the card */
  title?: string;
}

function _FamilyCard({ title, cssStyles, children, ...rest }: FamilyCardProps): JSX.Element {
  const { useStore } = useHass();
  const globalComponentStyle = useStore((state) => state.globalComponentStyles);
  const childrenWithKeys = Children.map(children, (child, index) => {
    if (isValidElement<PersonCardProps>(child)) {
      return cloneElement(child, {
        key: child.key || index,
      });
    }
    return child;
  });
  return (
    <FamilyBaseCard
      disableRipples
      disableScale
      disableActiveState
      cssStyles={`
      ${globalComponentStyle?.familyCard ?? ""}
      ${cssStyles ?? ""}
    `}
      {...rest}
    >
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
          {childrenWithKeys}
        </Row>
      </FamilyCardContent>
    </FamilyBaseCard>
  );
}

/** The FamilyCard component is an easy way to represent the state of the persons of your family within a simple layout, add each person to a PersonCard and place them as children within this card and you're good to go! */
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
