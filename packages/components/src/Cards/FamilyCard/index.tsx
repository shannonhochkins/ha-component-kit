import {
  AvailableQueries,
  CardBase,
  getColumnSizeCSS,
  mq,
  CardBaseProps,
  Column,
  PersonCard,
  PersonCardProps,
  Row,
  fallback,
  BreakPoint,
} from "@components";
import { EntityName, FilterByDomain, useHass } from "@hakit/core";
import { Children, ReactElement, cloneElement, isValidElement } from "react";
import { ErrorBoundary } from "react-error-boundary";

import styled from "@emotion/styled";
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
  .person-card {
    &.entity-count-2-plus {
      width: ${getColumnSizeCSS(6)};
      ${mq(
        ["xxs", "xs"],
        `
        width: ${getColumnSizeCSS(12)};
      `,
      )}
      ${mq(
        ["md", "lg", "xlg"],
        `
        width: ${getColumnSizeCSS(4)};
      `,
      )}
    }

    &.entity-count-1 {
      width: ${getColumnSizeCSS(12)};
    }

    &.entity-count-2 {
      width: ${getColumnSizeCSS(6)};
      ${mq(
        ["xxs", "xs"],
        `
        width: ${getColumnSizeCSS(12)};
      `,
      )}
    }
  }
`;

const Title = styled.div`
  color: var(--ha-S100-contrast);
  font-size: 0.9rem;
  font-weight: bold;
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
  | "disableRipples"
  | "disableScale"
  | "disableActiveState"
  | "rippleProps"
  | "borderRadius"
  | "disableActiveState"
  | "onlyFunctionality"
  | "ref";

export interface FamilyCardProps extends Omit<CardBaseProps<"div", FilterByDomain<EntityName, "person">>, OmitProperties> {
  /** the children for the FamilyCard, it accepts Person components */
  children: ReactElement<typeof PersonCard> | ReactElement<typeof PersonCard>[];
  /** optional title of the card */
  title?: string;
}

function _FamilyCard({ title, key, cssStyles, children, className, ...rest }: FamilyCardProps): React.ReactNode {
  const { useStore } = useHass();
  const globalComponentStyle = useStore((state) => state.globalComponentStyles);
  const len = Children.count(children);
  const count = len > 2 ? "2-plus" : len === 1 ? "1" : "2";
  const childrenWithKeys = Children.map(children, (child, index) => {
    if (isValidElement<PersonCardProps>(child)) {
      // if they've defined columns, we don't want to override it
      const columns: BreakPoint[] = ["xxs", "xs", "sm", "md", "lg", "xlg"];
      const hasColumnDefinition = columns.some((key) => typeof child.props[key] === "number");
      const disableColumns = hasColumnDefinition ? false : child.props.disableColumns ?? true;
      return cloneElement(child, {
        key: child.key || index,
        className: disableColumns ? `entity-count-${count}` : "",
        disableColumns,
      });
    }
    return child;
  });

  return (
    <FamilyBaseCard
      key={key}
      disableRipples
      disableScale
      disableActiveState
      className={`family-card ${className}`}
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

/** The FamilyCard component is an easy way to represent the state of the persons of your family within a simple layout, add each person to a PersonCard and place them as children within this card and you're good to go!
 * By default the layout is automatically adjusted to fit the amount of people you have, but you can override this by setting an BreakPoint prop on the PersonCard component.
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
