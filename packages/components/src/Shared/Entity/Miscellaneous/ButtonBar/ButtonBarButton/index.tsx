import { type EntityName } from "@hakit/core";
import { type FabCardProps, FabCard } from "@components";

export interface ButtonBarButtonProps<E extends EntityName> extends FabCardProps<E> {
  /** optional override to determine if the button should render in an active state */
  active?: boolean;
  /** hide the bottom border when active */
  hideActiveBorder?: boolean;
}

const DEFAULT_ICON_SIZE = 35;

export function ButtonBarButton<E extends EntityName>({
  key,
  children,
  active,
  className,
  size,
  cssStyles,
  borderRadius,
  hideActiveBorder,
  ...rest
}: ButtonBarButtonProps<E>) {
  return (
    <FabCard
      key={key}
      className={`button-bar-button ${className ?? ""} ${hideActiveBorder ? "hide-active-border" : ""}`}
      disableScale
      borderRadius={borderRadius ?? 0}
      size={size ?? DEFAULT_ICON_SIZE}
      active={active}
      cssStyles={`
        &.button-bar-button {
          height: auto;
          &:not(.hide-active-border) {
            border-bottom: 2px solid transparent;
            transition: border-bottom-color var(--ha-transition-duration) var(--ha-easing);
          }
          
          .contents {
            > div {
              padding: 0.4rem;
            }
          }
          &.active {
            &:not(.hide-active-border) {
              border-bottom-color: var(--ha-A400);
            }
          }
        }
        ${cssStyles ?? ""}
      `}
      {...rest}
    >
      {children}
    </FabCard>
  );
}
