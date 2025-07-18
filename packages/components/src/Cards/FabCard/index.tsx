import { useMemo } from "react";
import styled from "@emotion/styled";
import {
  useEntity,
  useIconByDomain,
  useStore,
  useIcon,
  useIconByEntity,
  isUnavailableState,
  computeDomainTitle,
  computeDomain,
  ON,
  type EntityName,
} from "@hakit/core";
import { CardBase, fallback, Tooltip } from "@components";
import type { TooltipProps, CardBaseProps } from "@components";
import { ErrorBoundary } from "react-error-boundary";
import { type IconProps } from "@iconify/react";

const StyledFabCard = styled(<E extends EntityName>({ service, serviceData, key, ...props }: CardBaseProps<"button", E>) => (
  <CardBase
    key={key}
    // @ts-expect-error - don't know entity name
    service={service}
    // @ts-expect-error - don't know entity name
    serviceData={serviceData}
    {...props}
  />
))<
  CardBaseProps<"button", EntityName> & {
    hasChildren?: boolean;
    size: number;
  }
>`
  flex-shrink: 0;
  border-radius: ${(props) => props.borderRadius};
  color: ${(props) => (props.active ? `var(--ha-A400)` : `var(--ha-S500-contrast)`)};
  ${(props) =>
    props.size &&
    `
    font-size: ${props.size * 0.37}px;
    height: ${props.size}px;
    ${!props.hasChildren ? `width: ${props.size}px;` : ``}
  `}
  > .ripple-parent {
    > .ripple-inner {
      height: 100%;
    }
  }
`;

const Contents = styled.div<{
  size: number;
  hasChildren: boolean;
}>`
  text-align: center;
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  height: 100%;
  svg {
    ${(props) => (props.hasChildren ? `margin-right: 0.5rem;` : ``)}
  }
  ${(props) => `
    ${
      props.hasChildren
        ? `padding: 0 ${props.size * 0.2}px;`
        : `
    `
    }
  `}
`;

type OmitProperties = "title" | "active";

export interface FabCardProps<E extends EntityName> extends Omit<CardBaseProps<"button", E>, OmitProperties> {
  /** The size of the Fab, this applies to the width and height @default 48 */
  size?: number;
  /** Optional icon param, this is automatically retrieved by the "domain" name if provided, or can be overwritten with a custom value  */
  icon?: string | null;
  /** the props for the icon, which includes styles for the icon */
  iconProps?: Omit<IconProps, "icon">;
  /** will not show any icons */
  noIcon?: boolean;
  /** the title used for the tooltip and or modal that will expands, defaults to entity name or domain name  */
  title?: string;
  /** the tooltip placement @default "top" */
  tooltipPlacement?: TooltipProps["placement"];
  /** active flag for the state of the fab, by default this is active if the entity.state value is ON, if you want to control this just pass the prop */
  active?: boolean;
}

function InternalFabCard<E extends EntityName>({
  title: _title,
  tooltipPlacement,
  icon: _icon,
  iconProps,
  noIcon,
  size = 48,
  entity: _entity,
  active: _active,
  children,
  disabled = false,
  borderRadius,
  className,
  service,
  serviceData,
  cssStyles,
  key,
  ...rest
}: FabCardProps<E>): React.ReactNode {
  const globalComponentStyle = useStore((state) => state.globalComponentStyles);
  const entity = useEntity(_entity || "unknown", {
    returnNullIfNotFound: true,
  });
  const domain = _entity ? computeDomain(_entity) : null;
  const icon = typeof _icon === "string" ? _icon : null;
  const domainIcon = useIconByDomain(domain === null ? "unknown" : domain, {
    ...(iconProps ?? {}),
    fontSize: iconProps?.fontSize ?? `${size / 1.7}px`,
  });
  const hasChildren = typeof children !== "undefined";
  const _borderRadius = hasChildren ? (borderRadius ?? "10px") : (borderRadius ?? "50%");
  const isUnavailable = typeof entity?.state === "string" ? isUnavailableState(entity.state) : false;
  const entityIcon = useIconByEntity(_entity || "unknown", {
    ...(iconProps ?? {}),
    fontSize: iconProps?.fontSize ?? `${size / 1.7}px`,
  });
  const iconElement = useIcon(icon, {
    ...(iconProps ?? {}),
    fontSize: iconProps?.fontSize ?? `${size / 1.7}px`,
  });
  const active = typeof _active === "boolean" ? _active : entity === null ? false : entity.state === ON && !isUnavailable;
  const title = useMemo(
    () => _title || (domain !== null && _entity ? computeDomainTitle(_entity, entity?.attributes?.device_class) : null),
    [_title, domain, entity, _entity],
  );
  return (
    <>
      <Tooltip
        key={key}
        placement={tooltipPlacement}
        title={`${_title ?? entity?.attributes?.friendly_name ?? title ?? ""}${entity?.state ? ` - ${entity.state}` : ""}`}
      >
        <StyledFabCard
          as="button"
          title={title}
          // just a dodgey hack to let typescript play nicely here
          // as we don't know the service/serviceData at this level
          service={service as undefined}
          serviceData={serviceData as undefined}
          entity={_entity}
          className={`fab-card ${className ?? ""}`}
          disabled={disabled || isUnavailable}
          active={active}
          size={size}
          borderRadius={_borderRadius}
          hasChildren={hasChildren}
          disableColumns={true}
          cssStyles={`
            ${globalComponentStyle?.fabCard ?? ""}
            ${cssStyles ?? ""}
          `}
          {...rest}
        >
          <Contents size={size} hasChildren={hasChildren}>
            {noIcon !== true && (iconElement || entityIcon || domainIcon)}
            {hasChildren ? children : undefined}
          </Contents>
        </StyledFabCard>
      </Tooltip>
    </>
  );
}
/** The Fab (Floating Action Button) Card is a simple button with an icon to trigger something on press
 *
 * NOTE: This component does NOT have any media queries by default, it will just be the width set by the size prop or the default size.
 */
export function FabCard<E extends EntityName>(props: FabCardProps<E>) {
  return (
    <ErrorBoundary {...fallback({ prefix: "FabCard" })}>
      <InternalFabCard {...props} />
    </ErrorBoundary>
  );
}
