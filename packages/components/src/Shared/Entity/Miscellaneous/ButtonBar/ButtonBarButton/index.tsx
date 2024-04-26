import { type EntityName } from "@hakit/core";
import { type FabCardProps, FabCard } from "@components";

export interface ButtonBarButtonProps<E extends EntityName> extends FabCardProps<E> {
  /** optional override to determine if the button should render in an active state */
  active?: boolean;
}

const DEFAULT_ICON_SIZE = 35;

export function ButtonBarButton<E extends EntityName>({ children, active, className, size, cssStyles, ...rest }: ButtonBarButtonProps<E>) {
  return (
    <FabCard
      className={`button-bar-button ${className ?? ""}`}
      disableScale
      borderRadius={0}
      size={size ?? DEFAULT_ICON_SIZE}
      active={active}
      cssStyles={`
        ${cssStyles ?? ""}
        &.button-bar-button {
          height: auto;
          .contents {
            > div {
              padding: 0.4rem;
            }
          }
        }
      `}
      {...rest}
    >
      {children}
    </FabCard>
  );
}
