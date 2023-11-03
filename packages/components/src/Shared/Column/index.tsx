import { m } from "framer-motion";
import { css } from "@emotion/react";
import type { MotionProps } from "framer-motion";
import styled from "@emotion/styled";

type Extendable = MotionProps & React.ComponentPropsWithoutRef<"div">;
export interface ColumnProps extends Extendable {
  /** standard flex css properties for align-items, @default center */
  alignItems?: React.CSSProperties["alignItems"];
  /** standard flex css properties for justify-content, @default center */
  justifyContent?: React.CSSProperties["justifyContent"];
  /** standard flex css properties for flex-wrap property, @default wrap */
  wrap?: React.CSSProperties["justifyContent"];
  /** standard css gap property values, @default undefined */
  gap?: React.CSSProperties["gap"];
  /** should the column stretch to the height of the parent */
  fullHeight?: boolean;
  /** should the column stretch to the width of the parent */
  fullWidth?: boolean;
}
const _Column = styled(m.div)<ColumnProps>`
  display: flex;
  flex-direction: column;
  flex-wrap: ${({ wrap }) => wrap || "wrap"};
  justify-content: ${({ justifyContent }) => justifyContent || "center"};
  align-items: ${({ alignItems }) => alignItems || "center"};
  ${({ justifyContent }) => `
    --stretch: ${justifyContent === "stretch" ? "100%" : "false"};
  `}
  ${(props) =>
    typeof props.gap === "string" &&
    `
    gap: ${props.gap};
    --gap: ${props.gap ?? "0px"};
  `}
  ${(props) => props.fullHeight && `height: 100%;`}
  ${(props) => props.fullWidth && `width: 100%;`}
`;

/** A simple helper component to layout child components in a column, justify/align properties as well as gap are supported */
export function Column(props: ColumnProps) {
  return (
    <_Column
      {...props}
      cssStyles={css`
        ${props.cssStyles ?? ""}
      `}
      className={`${props.className ?? ""} ${props.fullHeight ? "full-height" : ""} ${props.fullWidth ? "full-width" : ""} ${
        props.justifyContent ? props.justifyContent : "center"
      } ${props.alignItems ? props.alignItems : "center"} ${props.wrap ? props.wrap : "wrap"}`}
    />
  );
}
