import { useMemo } from "react";
import styled from "@emotion/styled";
import { useEntity, useIconByDomain, useIcon, useIconByEntity, isUnavailableState } from "@hakit/core";
import { computeDomain } from "@utils/computeDomain";
import type { EntityName } from "@hakit/core";
import { CardBase, fallback, Tooltip } from "@components";
import type { TooltipProps, CardBaseProps } from "@components";
import { startCase, lowerCase } from "lodash";
import { ErrorBoundary } from "react-error-boundary";

const StyledFabCard = styled(CardBase)<
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

type OmitProperties = "as" | "title" | "ref";

export interface FabCardProps<E extends EntityName> extends Omit<CardBaseProps<"button", E>, OmitProperties> {
  /** The size of the Fab, this applies to the width and height @default 48 */
  size?: number;
  /** Optional icon param, this is automatically retrieved by the "domain" name if provided, or can be overwritten with a custom value  */
  icon?: string | null;
  /** the css color value of the icon */
  iconColor?: string | null;
  /** will not show any icons */
  noIcon?: boolean;
  /** the title used for the tooltip and or modal that will expands, defaults to entity name or domain name  */
  title?: string;
  /** the tooltip placement @default "top" */
  tooltipPlacement?: TooltipProps["placement"];
}

function _FabCard<E extends EntityName>({
  title: _title,
  tooltipPlacement,
  icon: _icon,
  iconColor,
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
  ...rest
}: FabCardProps<E>): JSX.Element {
  const entity = useEntity(_entity || "unknown", {
    returnNullIfNotFound: true,
  });
  const domain = _entity ? computeDomain(_entity) : null;
  const icon = typeof _icon === "string" ? _icon : null;
  const domainIcon = useIconByDomain(domain === null ? "unknown" : domain, {
    fontSize: `${size / 1.7}px`,
    color: iconColor ?? undefined,
  });
  const hasChildren = typeof children !== "undefined";
  const _borderRadius = hasChildren ? borderRadius ?? "10px" : borderRadius ?? "50%";
  const isUnavailable = typeof entity?.state === "string" ? isUnavailableState(entity.state) : false;
  const entityIcon = useIconByEntity(_entity || "unknown", {
    fontSize: `${size / 1.7}px`,
    color: iconColor ?? undefined,
  });
  const iconElement = useIcon(icon, {
    fontSize: `${size / 1.7}px`,
    color: iconColor ?? undefined,
  });
  const active = typeof _active === "boolean" ? _active : entity === null ? false : entity.state !== "off" && !isUnavailable;

  const title = useMemo(() => _title ?? (domain === null ? null : startCase(lowerCase(domain))), [_title, domain]);
  return (
    <>
      <Tooltip
        placement={tooltipPlacement}
        title={`${_title ?? entity?.attributes?.friendly_name ?? title ?? ""}${entity?.state ? ` - ${entity.state}` : ""}`}
      >
        <StyledFabCard
          as="button"
          title={title}
          // @ts-expect-error - don't know the entity name, so we can't know the service type
          service={service}
          // @ts-expect-error - don't know the entity name, so we can't know the service data
          serviceData={serviceData}
          entity={_entity}
          className={`fab-card ${className ?? ""}`}
          disabled={disabled || isUnavailable}
          active={active}
          size={size}
          borderRadius={_borderRadius}
          hasChildren={hasChildren}
          disableColumns={true}
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
      <_FabCard {...props} />
    </ErrorBoundary>
  );
}
