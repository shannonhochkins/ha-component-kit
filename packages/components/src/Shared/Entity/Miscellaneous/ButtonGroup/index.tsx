import { ReactElement, Children, isValidElement, cloneElement } from "react";
import styled from "@emotion/styled";
import { Row, fallback, ButtonGroupButton, type RowProps } from "@components";
import { ErrorBoundary } from "react-error-boundary";

const ButtonGroupParent = styled.div<{
  thickness: number;
}>`
  --ha-control-button-group-spacing: 12px;
  --ha-control-button-group-thickness: ${(props) => props.thickness}px;
  width: auto;
  display: flex;
  gap: var(--ha-control-button-group-spacing);
  &.reverse {
    flex-direction: row-reverse;
  }
  &:not(.reverse) {
    flex-direction: row;
  }
  > * {
    flex: 1;
    height: 100%;
    width: 100%;
  }
  &:not(.vertical) {
    height: var(--ha-control-button-group-thickness);
    max-width: 420px;
    min-width: 320px;
  }
  &.vertical {
    width: var(--ha-control-button-group-thickness);
    height: 45vh;
    max-height: 320px;
    min-height: 200px;
    &.reverse {
      flex-direction: column-reverse;
    }
    &:not(.reverse) {
      flex-direction: column;
    }
  }
`;

type Orientation = "vertical" | "horizontal";
export interface ButtonGroupProps extends RowProps {
  /** the orientation of the slider, useful if you want to represent the slider to match your curtain/blind orientation */
  orientation?: Orientation;
  /** reverse the direction of the slider, useful if you want the ui to reflect the actual cover */
  reverse?: boolean;
  /** the thickness of the buttons @default 100 */
  thickness?: number;
  /** This will only accept ButtonGroupButton as a child component */
  children: ReactElement<typeof ButtonGroupButton> | ReactElement<typeof ButtonGroupButton>[];
}

function _ButtonGroup({ orientation = "vertical", reverse = false, thickness = 100, children, ...rest }: ButtonGroupProps) {
  const childrenWithKeys = Children.map(children, (child, index) => {
    if (isValidElement(child)) {
      return cloneElement(child, {
        key: child.key || index,
      });
    }
    return child;
  });
  return (
    <Row
      {...rest}
      gap="1rem"
      style={{
        flexDirection: orientation === "vertical" ? "row" : "column",
      }}
    >
      <ButtonGroupParent thickness={thickness} className={`${reverse ? "reverse" : ""} ${orientation === "vertical" ? "vertical" : ""}`}>
        {childrenWithKeys}
      </ButtonGroupParent>
    </Row>
  );
}

/** This component will render buttons to control any entity, they can be displayed vertically, horizontally, reversed order and the size, color and icons are all configurable.
 */
export function ButtonGroup(props: ButtonGroupProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "ButtonGroup" })}>
      <_ButtonGroup {...props} />
    </ErrorBoundary>
  );
}
