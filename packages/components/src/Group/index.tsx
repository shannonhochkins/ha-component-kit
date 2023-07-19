import styled from "@emotion/styled";
import { Row, Column } from "@components";

const StyledGroup = styled.div`
  h3 {
    color: var(--ha-primary-color);
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
}
/** The group component will automatically layout the children in a row with a predefined gap between the children. */
export function Group({
  title,
  children,
  gap = "0.5rem",
  justifyContent = "center",
  alignItems = "center",
  layout = "row",
  ...rest
}: GroupProps): JSX.Element {
  const cssProps = {
    gap,
    justifyContent,
    alignItems,
  };
  return (
    <StyledGroup {...rest}>
      <h3>{title}</h3>
      {layout === "row" ? (
        <Row {...cssProps}>{children}</Row>
      ) : (
        <Column {...cssProps}>{children}</Column>
      )}
    </StyledGroup>
  );
}
