import { fallback, ButtonBarButton } from "@components";
import { ErrorBoundary } from "react-error-boundary";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { ReactElement, Children, isValidElement, cloneElement } from "react";

type Extendable = React.ComponentPropsWithoutRef<"div">;

// Define the allowed children types
type AllowedChild = ReactElement<typeof ButtonBarButton> | false | null;
type AllowedChildren = AllowedChild | AllowedChild[];

export interface ButtonBarProps extends Extendable {
  /** standard flex css properties for align-items, @default "center" */
  alignItems?: React.CSSProperties["alignItems"];
  /** standard flex css properties for justify-content, @default "center" */
  justifyContent?: React.CSSProperties["justifyContent"];
  /** standard flex css properties for flex-wrap property, @default "wrap" */
  wrap?: React.CSSProperties["justifyContent"];
  /** gap between buttons, note - will not be applied in "grouped" layoutType @default "0" */
  gap?: React.CSSProperties["gap"];
  /** the children for the ButtonBar, it accepts ButtonBarButton components */
  children: AllowedChildren;
  /** should the group stretch to the height of the parent */
  fullHeight?: boolean;
  /** should the group stretch to the width of the parent */
  fullWidth?: boolean;
  /** type of the layout, grouped will render all buttons together, bubble will render them as buttons in a row @default 'grouped' */
  layoutType?: "grouped" | "bubble";
}

const ButtonBarParent = styled.div<Partial<ButtonBarProps>>`
  display: flex;
  ${({ fullWidth }) => {
    if (fullWidth) {
      return `
        > .fit-content {
          flex-basis: auto;
          width: 100%;
        }
      `;
    }
    return ``;
  }};
`;

const FitContent = styled.div`
  display: flex;
  flex-basis: fit-content;
`;

const ButtonBarInner = styled.div<Partial<ButtonBarProps>>`
  display: flex;
  flex-direction: row;
  flex-wrap: ${({ wrap }) => wrap || "wrap"};
  justify-content: ${({ justifyContent }) => justifyContent || "center"};
  align-items: ${({ alignItems }) => alignItems || "center"};
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
  height: ${({ fullHeight }) => (fullHeight ? "100%" : "auto")};
  overflow: hidden;

  > * {
    height: 100%;
    width: auto;
    display: flex;
    align-items: stretch;
    .button-bar-button {
      height: 100%;
      display: flex;
      align-items: stretch;
    }
  }

  &.grouped {
    background-color: var(--ha-S300);
    border-radius: 0.5rem;
    border: 1px solid var(--ha-S500);
    > * {
      border-right: 1px solid var(--ha-S500);
      &:last-of-type {
        border-right: none;
      }
    }
  }
  &.bubble {
    gap: ${({ gap }) => gap || "0px"};
    > * {
      flex-grow: 1;
    }
    .button-bar-button {
      background-color: var(--ha-300-a3-contrast);
      color: var(--ha-300);
      &:not(.disabled):not(:focus):hover {
        background-color: var(--ha-S50-a6);
        color: var(--ha-500);
      }
    }
  }
`;

function _ButtonBar({
  key,
  alignItems,
  fullWidth,
  fullHeight,
  gap,
  justifyContent,
  wrap,
  style,
  id,
  className,
  cssStyles,
  children,
  layoutType = "grouped",
  ...rest
}: ButtonBarProps) {
  const childrenWithKeys = Children.map(children, (child, index) => {
    if (isValidElement(child)) {
      return cloneElement(child, {
        key: child.key || index,
        // @ts-expect-error - it does exist, fix types later
        size: child?.props?.size ?? (layoutType === "bubble" ? 35 : 30),
        borderRadius: layoutType === "bubble" ? "8px" : "0px",
      });
    }
    return null;
  });
  return (
    <ButtonBarParent
      key={key}
      id={id ?? ""}
      css={css`
        ${cssStyles ?? ""}
      `}
      layoutType={layoutType}
      className={`button-bar ${layoutType} ${className ?? ""}`}
      style={{
        ...(style ?? {}),
      }}
      {...rest}
    >
      <FitContent className="fit-content">
        <ButtonBarInner
          className={`button-group-inner ${layoutType}`}
          {...{
            alignItems,
            justifyContent,
            wrap,
            gap: gap ?? layoutType === "bubble" ? "0.5rem" : "0",
            fullWidth,
            fullHeight,
          }}
        >
          {/* @ts-expect-error - fix later */}
          {childrenWithKeys}
        </ButtonBarInner>
      </FitContent>
    </ButtonBarParent>
  );
}

/**
 * This is a very simple function that turns FabCards into a button bar, you can use this with entities or just normal button elements
 *
 * There's a known problem with the types when you provide an entity name, typescript will complain about the available services, this is something i'll address later * */
export function ButtonBar(props: ButtonBarProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "ButtonBar" })}>
      <_ButtonBar {...props} />
    </ErrorBoundary>
  );
}
