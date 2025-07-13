import { useState } from "react";
import styled from "@emotion/styled";
import { Row, Column, fallback, CardBase, CardBaseProps, mq, type AvailableQueries } from "@components";
import { ErrorBoundary } from "react-error-boundary";
import { AutoHeight } from "../Shared/AutoHeight";
import { EntityName } from "@core";

const StyledGroup = styled(CardBase as React.ComponentType<CardBaseProps<"div", EntityName>>)<{
  collapsed: boolean;
  collapsible: boolean;
}>`
  background-color: var(--ha-S200);
  color: var(--ha-S200-contrast);
  padding: ${({ collapsed }) => (collapsed ? "0 2rem" : "0 2rem 2rem")};
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: height, padding, background-color;
  &.expanded {
    height: calc-size(auto);
  }
  width: 100%;
  > div.contents > .header-title {
    cursor: pointer;
    padding: ${({ collapsed }) => (collapsed ? "1.5rem 0" : "2rem 0")};
    > h3 {
      color: var(--ha-S100-contrast);
      margin: 0;
      display: flex;
      align-items: center;
      transition: padding var(--ha-transition-duration) var(--ha-easing);
      ${({ collapsible, collapsed }) =>
        collapsible &&
        `&:before {
        content: "${collapsed ? "+" : "-"}";
        display: inline-block;
        color: var(--ha-A400);
        width: 1rem;
      }`}
    }
  }
  ${({ collapsed }) => `
    ${mq(
      ["xxs", "xs"],
      `
      padding: ${collapsed ? "1rem 0rem" : "1.5rem 1rem 1rem"};
    `,
    )}
  `};
`;

const Description = styled.span`
  color: var(--ha-S300-contrast);
  font-size: 0.9rem;
  margin: 0.5rem 0 0;
  width: 100%;
  display: block;
  padding-left: 1rem;
`;

const Header = styled.div`
  transition: padding var(--ha-transition-duration) var(--ha-easing);
`;
const Title = styled.h3``;

type OmitProperties =
  | "title"
  | "as"
  | "layout"
  | "entity"
  | "serviceData"
  | "service"
  | "longPressCallback"
  | "modalProps"
  | "onClick"
  | "disableScale"
  | "onlyFunctionality"
  | "rippleProps"
  | "disableActiveState"
  | "disableRipples";
export interface GroupProps extends Omit<CardBaseProps, OmitProperties> {
  /** the title of the group */
  title: React.ReactNode;
  /** the optional description of the group */
  description?: React.ReactNode;
  /** the layout of the group, either column or row, @default row */
  layout?: "row" | "column";
  /** standard flex css properties for align-items, @default center */
  alignItems?: React.CSSProperties["alignItems"];
  /** standard flex css properties for justify-content, @default center */
  justifyContent?: React.CSSProperties["justifyContent"];
  /** standard css gap property values, @default 0.5rem */
  gap?: React.CSSProperties["gap"];
  /** should the group be collapsed by default @default false */
  collapsed?: boolean;
  /** Whether the group can be collapsed by the end-user @default true */
  collapsible?: boolean;
  /** fired when the group header section is clicked */
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}
function InternalGroup({
  title,
  description,
  children,
  gap = "0.5rem",
  justifyContent = "center",
  alignItems = "center",
  layout = "row",
  collapsed = false,
  collapsible = true,
  className,
  onClick,
  ...rest
}: GroupProps): React.ReactNode {
  const [_collapsed, setCollapsed] = useState(collapsed);
  const cssProps = {
    gap,
    justifyContent,
    alignItems,
  };
  return (
    <StyledGroup
      onlyFunctionality
      disableScale
      disableActiveState
      disableRipples
      borderRadius={"16px"}
      className={`${className ?? ""} ${_collapsed ? "collapsed" : "expanded"} group`}
      collapsed={_collapsed}
      collapsible={collapsible}
      {...rest}
    >
      <Header
        onClick={(event) => {
          if (collapsible) {
            setCollapsed(!_collapsed);
          }
          if (onClick) onClick(event);
        }}
        className="header-title"
      >
        <Title className="title">{title}</Title>
        {description && <Description>{description}</Description>}
      </Header>
      <AutoHeight isOpen={!_collapsed || !collapsible} className="content" onCollapseComplete={() => setCollapsed(true)}>
        {layout === "row" ? (
          <Row className="row" {...cssProps}>
            {children}
          </Row>
        ) : (
          <Column className="column" {...cssProps}>
            {children}
          </Column>
        )}
      </AutoHeight>
    </StyledGroup>
  );
}
/** The group component will automatically layout the children in a row with a predefined gap between the children. The Group component is handy when you want to be able to collapse sections of cards */
export function Group(props: GroupProps) {
  const defaultColumns: AvailableQueries = {
    xxs: 12,
    xs: 12,
    sm: 12,
    md: 12,
    lg: 12,
    xlg: 12,
  };
  return (
    <ErrorBoundary {...fallback({ prefix: "Group" })}>
      <InternalGroup {...defaultColumns} {...props} />
    </ErrorBoundary>
  );
}
