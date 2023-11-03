import { fallback, ButtonBarButton } from "@components";
import { ErrorBoundary } from "react-error-boundary";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { ReactElement, Children, isValidElement, cloneElement } from "react";

type Extendable = React.ComponentPropsWithoutRef<"div">;
export interface ButtonBarProps extends Extendable {
  /** standard flex css properties for align-items, @default center */
  alignItems?: React.CSSProperties["alignItems"];
  /** standard flex css properties for justify-content, @default center */
  justifyContent?: React.CSSProperties["justifyContent"];
  /** standard flex css properties for flex-wrap property, @default wrap */
  wrap?: React.CSSProperties["justifyContent"];
  /** the children for the ButtonBar, it accepts ButtonBarButton components */
  children: ReactElement<typeof ButtonBarButton> | ReactElement<typeof ButtonBarButton>[];
}

const ButtonBarParent = styled.div<Partial<ButtonBarProps>>`
  display: flex;
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
  background-color: var(--ha-S300);
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid var(--ha-S500);
  > * {
    height: 100%;
    display: flex;
    align-items: stretch;
    border-right: 1px solid var(--ha-S500);
    &:last-of-type {
      border-right: none;
    }
    .fab-card {
      height: 100%;
      display: flex;
      align-items: stretch;
    }
  }
`;

function _ButtonBar({ alignItems, justifyContent, wrap, style, id, className, cssStyles, children, ...rest }: ButtonBarProps) {
  const childrenWithKeys = Children.map(children, (child, index) => {
    if (isValidElement(child)) {
      return cloneElement(child, {
        key: child.key || index,
      });
    }
    return child;
  });
  return (
    <ButtonBarParent
      id={id ?? ""}
      css={css`
        ${cssStyles ?? ""}
      `}
      className={`button-group ${className ?? ""}`}
      style={{
        ...(style ?? {}),
      }}
      {...rest}
    >
      <FitContent className="fit-content">
        <ButtonBarInner
          className="button-group-inner"
          {...{
            alignItems,
            justifyContent,
            wrap,
          }}
        >
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
