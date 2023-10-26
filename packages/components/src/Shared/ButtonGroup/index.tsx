import { FabCard, fallback } from "@components";
import type { FabCardProps } from "@components";
import type { EntityName } from "@hakit/core";
import { ErrorBoundary } from "react-error-boundary";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

type Extendable = React.ComponentPropsWithoutRef<"div">;
export interface ButtonGroupProps extends Extendable {
  /** an array of button configurations, this can support entities with all available props from FabCard */
  buttons: FabCardProps<EntityName>[];
  /** standard flex css properties for align-items, @default center */
  alignItems?: React.CSSProperties["alignItems"];
  /** standard flex css properties for justify-content, @default center */
  justifyContent?: React.CSSProperties["justifyContent"];
  /** standard flex css properties for flex-wrap property, @default wrap */
  wrap?: React.CSSProperties["justifyContent"];
}

const ButtonGroupParent = styled.div<Partial<ButtonGroupProps>>`
  display: flex;
`;

const FitContent = styled.div`
  display: flex;
  flex-basis: fit-content;
`;

const ButtonGroupInner = styled.div<Partial<ButtonGroupProps>>`
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

const DEFAULT_ICON_SIZE = 35;

function _ButtonGroup({
  buttons,
  alignItems,
  justifyContent,
  wrap,
  style,
  id,
  className,
  cssStyles,
  ...rest
}: ButtonGroupProps) {
  return (
    <ButtonGroupParent
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
        <ButtonGroupInner
          className="button-group-inner"
          {...{
            alignItems,
            justifyContent,
            wrap,
          }}
        >
          {buttons.map(({ children, ...buttonProps }, index) => (
            <FabCard
              className="button-group-item"
              disableScaleEffect
              borderRadius={0}
              key={index}
              size={DEFAULT_ICON_SIZE}
              {...buttonProps}
              cssStyles={`
                ${buttonProps?.cssStyles ?? ""}
                button {
                  height: var(--stretch, ${
                    buttonProps.size ?? DEFAULT_ICON_SIZE
                  }px);
                }
              `}
            >
              {children}
            </FabCard>
          ))}
        </ButtonGroupInner>
      </FitContent>
    </ButtonGroupParent>
  );
}

/**
 * This is a very simple function that turns FabCards into a button group, you can use this with entities or just normal button elements
 *
 * There's a known problem with the types when you provide an entity name, typescript will complain about the available services, this is something i'll address later * */
export function ButtonGroup(props: ButtonGroupProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "ButtonGroup" })}>
      <_ButtonGroup {...props} />
    </ErrorBoundary>
  );
}
