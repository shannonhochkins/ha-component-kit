import { type EntityName } from "@hakit/core";
import { fallback, ButtonBarButton, type ButtonBarButtonProps } from "@components";
import { ErrorBoundary } from "react-error-boundary";

export type FeatureEntityProps<E extends EntityName = EntityName> = ButtonBarButtonProps<E>;

function _FeatureEntity<E extends EntityName>({ children, active, ...rest }: ButtonBarButtonProps<E>) {
  return (
    <ButtonBarButton
      // @ts-expect-error - will need to fix this typescript problem later
      as="div"
      rippleProps={{
        preventPropagation: true,
      }}
      active={active}
      cssStyles={`
        &.button-bar-button {
          .contents {
            > div {
              padding: 0.6rem;
            }
          }
        }
      `}
      {...rest}
    >
      {children}
    </ButtonBarButton>
  );
}

/**
 * This can be used within the `features` prop for any card that extends CardBase where you can place actions at the bottom of every card allowing you to replace similar functionality of the "features" option within home assistant.
 * */
export const FeatureEntity = function FeatureEntity<E extends EntityName>(props: ButtonBarButtonProps<E>) {
  return (
    <ErrorBoundary {...fallback({ prefix: "FeatureEntity" })}>
      <_FeatureEntity {...props} />
    </ErrorBoundary>
  );
};
