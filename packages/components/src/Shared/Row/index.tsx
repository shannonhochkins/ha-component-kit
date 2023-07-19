import styled from "@emotion/styled";

export interface RowProps extends React.ComponentProps<"div"> {
  /** standard flex css properties for align-items, @default center */
  alignItems?: React.CSSProperties["alignItems"];
  /** standard flex css properties for justify-content, @default center */
  justifyContent?: React.CSSProperties["justifyContent"];
  /** standard css gap property values, @default undefined */
  gap?: React.CSSProperties["gap"];
}
/** A simple helper component to layout child components in a row, justify/align properties as well as gap are supported */
export const Row = styled.div<RowProps>`
  display: flex;
  flex-direction: row;
  justify-content: ${({ justifyContent }) => justifyContent || "center"};
  align-items: ${({ alignItems }) => alignItems || "center"};
  ${(props) =>
    typeof props.gap === "string" &&
    `
    gap: ${props.gap};
  `}
`;
