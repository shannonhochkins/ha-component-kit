import styled from "@emotion/styled";

export interface RowProps extends React.ComponentProps<"div"> {
  /** standard flex css properties for align-items, @default center */
  alignItems?: React.CSSProperties["alignItems"];
  /** standard flex css properties for justify-content, @default center */
  justifyContent?: React.CSSProperties["justifyContent"];
  /** standard flex css properties for flex-wrap property, @default wrap */
  wrap?: React.CSSProperties["justifyContent"];
  /** standard css gap property values, @default undefined */
  gap?: React.CSSProperties["gap"];
  /** should the row stretch to the height of the parent */
  fullHeight?: boolean;
  /** should the row stretch to the width of the parent */
  fullWidth?: boolean;
}
/** A simple helper component to layout child components in a row, justify/align properties as well as gap are supported */
export const Row = styled.div<RowProps>`
  display: flex;
  flex-direction: row;
  flex-wrap: ${({ wrap }) => wrap || "wrap"};
  justify-content: ${({ justifyContent }) => justifyContent || "center"};
  align-items: ${({ alignItems }) => alignItems || "center"};
  ${(props) =>
    typeof props.gap === "string" &&
    `
    gap: ${props.gap};
  `}
  ${(props) => props.fullHeight && `height: 100%;`}
  ${(props) => props.fullWidth && `width: 100%;`}
`;
