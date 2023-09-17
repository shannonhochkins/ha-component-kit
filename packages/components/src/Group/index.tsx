import { useState } from "react";
import styled from "@emotion/styled";
import { Row, Column, fallback } from "@components";
import { motion, AnimatePresence } from "framer-motion";
import { ErrorBoundary } from "react-error-boundary";

const StyledGroup = styled.div<{
  collapsed: boolean;
}>`
  background-color: var(--ha-200-shade);
  color: var(--ha-200-shade-contrast);
  border-radius: 1rem;
  padding: ${({ collapsed }) => (collapsed ? "0 2rem" : "0 2rem 2rem")};
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: padding, background-color;
  width: calc(100% - 4rem);
  h3 {
    color: var(--ha-100-shade-contrast);
    margin: 0;
    cursor: pointer;
    padding: ${({ collapsed }) => (collapsed ? "1.5rem 0" : "2rem 0")};
    display: flex;
    align-items: center;
    transition: padding var(--ha-transition-duration) var(--ha-easing);
    &:before {
      content: "${({ collapsed }) => (collapsed ? "+" : "-")}";
      display: inline-block;
      margin-right: 0.5rem;
      color: var(--ha-A400);
    }
  }
`;

export interface GroupProps extends Omit<React.ComponentProps<"div">, "title"> {
  /** the title of the group */
  title: string;
  /** the children for the component to render */
  children: React.ReactNode;
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
}
function _Group({
  title,
  children,
  gap = "0.5rem",
  justifyContent = "center",
  alignItems = "center",
  layout = "row",
  collapsed = false,
  ...rest
}: GroupProps): JSX.Element {
  const [_collapsed, setCollapsed] = useState(collapsed);
  const cssProps = {
    gap,
    justifyContent,
    alignItems,
  };
  return (
    <StyledGroup collapsed={_collapsed} {...rest}>
      <h3 onClick={() => setCollapsed(!_collapsed)}>{title}</h3>
      <AnimatePresence initial={false}>
        {!_collapsed && (
          <motion.section
            style={{
              overflow: "hidden",
            }}
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            {layout === "row" ? (
              <Row {...cssProps}>{children}</Row>
            ) : (
              <Column {...cssProps}>{children}</Column>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </StyledGroup>
  );
}
/** The group component will automatically layout the children in a row with a predefined gap between the children. The Group component is handy when you want to be able to collapse sections of cards */
export function Group(props: GroupProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "Group" })}>
      <_Group {...props} />
    </ErrorBoundary>
  );
}
