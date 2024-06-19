import { ReactElement, Children, isValidElement, cloneElement, CSSProperties, useMemo } from "react";
import styled from "@emotion/styled";
import { Row, fallback, ButtonGroupButton, type RowProps } from "@components";
import { ErrorBoundary } from "react-error-boundary";

const ButtonGroupParent = styled(Row)<
  {
    thickness: number;
  } & RowProps
>`
  --ha-control-button-group-thickness: ${(props) => props.thickness}px;
  width: auto;
  &:not(.maintain-aspect-ratio) {
    > * {
      flex: 1;
      height: 100%;
      width: 100%;
    }
  }

  &.maintain-aspect-ratio {
    > * {
      flex-grow: 0;
    }
  }

  &:not(.vertical) {
    height: var(--ha-control-button-group-thickness);
    &.maintain-aspect-ratio {
      > * {
        height: 100%;
        width: var(--ha-control-button-group-thickness);
      }
    }
  }
  &.vertical {
    width: var(--ha-control-button-group-thickness);
    &.maintain-aspect-ratio {
      > * {
        width: 100%;
        height: var(--ha-control-button-group-thickness);
      }
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
  /** The gap between the buttons  @default '1rem' */
  gap?: CSSProperties["gap"];
  /** should the buttons maintain their aspect ratio, disabling this you'll need to control your own dimensions @default true */
  maintainAspectRatio?: boolean;
}

function _ButtonGroup({
  key,
  orientation = "vertical",
  reverse = false,
  thickness = 100,
  children,
  className,
  gap = "1rem",
  maintainAspectRatio = true,
  ...rest
}: ButtonGroupProps) {
  const childrenWithKeys = Children.map(children, (child, index) => {
    if (isValidElement(child)) {
      return cloneElement(child, {
        key: child.key || index,
      });
    }
    return child;
  });

  const _classes = useMemo(() => {
    return [
      "button-group-parent",
      className,
      maintainAspectRatio ? "maintain-aspect-ratio" : "",
      reverse ? "reverse" : "",
      orientation === "vertical" ? "vertical" : "",
    ]
      .filter((x) => !!x)
      .join(" ");
  }, [maintainAspectRatio, className, reverse, orientation]);
  const flexDirection = useMemo(() => {
    if (reverse) {
      return orientation === "vertical" ? "column-reverse" : "row-reverse";
    }
    return orientation === "vertical" ? "column" : "row";
  }, [reverse, orientation]);
  return (
    <ButtonGroupParent
      key={key}
      {...rest}
      style={{
        ...(rest.style || {}),
        flexDirection,
      }}
      gap={gap}
      thickness={thickness}
      className={_classes}
    >
      {childrenWithKeys}
    </ButtonGroupParent>
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
