import { FabCard, fallback } from "@components";
import type { FabCardProps } from "@components";
import type { EntityName } from "@hakit/core";
import { ErrorBoundary } from "react-error-boundary";
import styled from "@emotion/styled";

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
    border-right: 1px solid var(--ha-S500);
    &:last-of-type {
      border-right: none;
    }
  }
`;

function _ButtonGroup({
  buttons,
  alignItems,
  justifyContent,
  wrap,
  style,
  ...rest
}: ButtonGroupProps) {
  return (
    <ButtonGroupParent
      style={{
        ...(style ?? {}),
      }}
      {...rest}
    >
      <FitContent>
        <ButtonGroupInner
          {...{
            alignItems,
            justifyContent,
            wrap,
          }}
        >
          {buttons.map(({ children, ...buttonProps }, index) => (
            <FabCard
              disableScaleEffect
              borderRadius={0}
              noIcon={buttonProps.icon ? false : true}
              key={index}
              size={35}
              {...buttonProps}
            >
              {children}
            </FabCard>
          ))}
        </ButtonGroupInner>
      </FitContent>
    </ButtonGroupParent>
  );
}

/** This is a very simple function that turns FabCards into a button group, you can use this with entities or just normal button elements */
export function ButtonGroup(props: ButtonGroupProps) {
  return (
    <ErrorBoundary {...fallback({ prefix: "ButtonGroup" })}>
      <_ButtonGroup {...props} />
    </ErrorBoundary>
  );
}
