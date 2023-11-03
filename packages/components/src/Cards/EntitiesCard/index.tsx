import styled from "@emotion/styled";
import type { EntityName } from "@hakit/core";
import {
  Column,
  fallback,
  CardBase,
  EntitiesCardRow,
  type EntitiesCardRowProps,
  type AvailableQueries,
  type CardBaseProps,
} from "@components";
import { ErrorBoundary } from "react-error-boundary";
import { Children, isValidElement, cloneElement, type ReactElement } from "react";
const StyledEntitiesCard = styled(CardBase)`
  svg {
    color: currentColor;
  }
  &:not(.disabled) {
    &:hover,
    &:active {
      svg {
        color: currentColor;
      }
    }
  }
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
  | "ref"
  | "disableActiveState"
  | "disableScale";
export interface EntitiesCardProps extends Omit<CardBaseProps<"div", EntityName>, OmitProperties> {
  /** the children for the ButtonBar, it accepts ButtonBarButton components */
  children: ReactElement<typeof EntitiesCardRow> | ReactElement<typeof EntitiesCardRow>[];
  /** include the last updated time, will apply to every row unless specified on an individual EntityItem @default false */
  includeLastUpdated?: boolean;
}
function _EntitiesCard({ includeLastUpdated = false, className, children, ...rest }: EntitiesCardProps): JSX.Element {
  const childrenWithKeys = Children.map(children, (child, index) => {
    if (isValidElement<EntitiesCardRowProps<EntityName>>(child)) {
      return cloneElement(child, {
        key: child.key || index,
        includeLastUpdated: includeLastUpdated,
      });
    }
    return child;
  });
  return (
    <StyledEntitiesCard disableRipples disableScale disableActiveState className={`entities-card ${className ?? ""}`} {...rest}>
      <Column fullWidth fullHeight className={`column`}>
        {childrenWithKeys}
      </Column>
    </StyledEntitiesCard>
  );
}
/** The EntitiesCard component is an easy way to represent the state a of multiple entities with a simple layout, you can customize every part of every row with the EntityItem properties, the renderState and onClick both receive the entity object with the api properties. */
export function EntitiesCard(props: EntitiesCardProps) {
  const defaultColumns: AvailableQueries = {
    xxs: 12,
    xs: 6,
    sm: 6,
    md: 4,
    lg: 4,
    xlg: 3,
  };
  return (
    <ErrorBoundary {...fallback({ prefix: "EntitiesCard" })}>
      <_EntitiesCard {...defaultColumns} {...props} />
    </ErrorBoundary>
  );
}
