import { CSSProperties, useCallback, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import type { MotionProps } from "framer-motion";
import {
  useEntity,
  useIconByDomain,
  useIcon,
  useIconByEntity,
  isUnavailableState,
} from "@hakit/core";
import { computeDomain } from "@utils/computeDomain";
import type {
  DomainService,
  ExtractDomain,
  ServiceData,
  HassEntityWithApi,
  EntityName,
} from "@hakit/core";
import { Ripples, ModalByEntityDomain, fallback, Tooltip } from "@components";
import type { TooltipProps } from "@components";
import { useLongPress } from "react-use";
import { startCase, lowerCase } from "lodash";
import { ErrorBoundary } from "react-error-boundary";

const StyledRipples = styled(Ripples)`
  flex-grow: 0;
  flex-shrink: 0;
`;

const StyledFabCard = styled(motion.button)<{
  size: number;
  active: boolean;
  borderRadius?: CSSProperties["borderRadius"];
  hasChildren?: boolean;
}>`
  all: unset;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
  text-align: center;
  border-radius: ${(props) => props.borderRadius};
  background-color: var(--ha-S300);
  color: ${(props) =>
    props.active ? `var(--ha-A400)` : `var(--ha-S500-contrast)`};
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: background-color, color, box-shadow;
  svg {
    transition: color var(--ha-transition-duration) var(--ha-easing);
    ${props => props.hasChildren ? `margin-right: 0.5rem;` : ``}
  }
  &:not(:disabled):hover {
    background-color: var(--ha-S400);
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.8;
  }

  ${(props) =>
    props.size &&
    `
    font-size: ${props.size * 0.37}px;
    height: ${props.size}px;
    ${
      props.hasChildren
        ? `padding: 0 ${props.size * 0.2}px;`
        : `
      width: ${props.size}px;
    `
    }
  `}
`;

type Extendable = Omit<React.ComponentProps<"button">, "onClick" | "ref"> &
  MotionProps;

export interface FabCardProps<E extends EntityName> extends Extendable {
  /** The size of the Fab, this applies to the width and height @default 48 */
  size?: number;
  /** Optional icon param, this is automatically retrieved by the "domain" name if provided, or can be overwritten with a custom value  */
  icon?: string | null;
  /** the css color value of the icon */
  iconColor?: string | null;
  /** will not show any icons */
  noIcon?: boolean;
  /** The service name, eg "toggle, turnOn ..." */
  service?: DomainService<ExtractDomain<E>>;
  /** The data to pass to the service */
  serviceData?: ServiceData<ExtractDomain<E>, DomainService<ExtractDomain<E>>>;
  /** The name of your entity */
  entity?: E;
  /** the title used for the tooltip and or modal that will expands, defaults to entity name or domain name  */
  title?: string;
  /** the tooltip placement @default "top" */
  tooltipPlacement?: TooltipProps["placement"];
  /** The onClick handler is called when the button is pressed, the first argument will be entity object with api methods if entity is provided  */
  onClick?: E extends undefined
    ? (entity: null, event: React.MouseEvent<HTMLButtonElement>) => void
    : (
        entity: HassEntityWithApi<ExtractDomain<E>>,
        event: React.MouseEvent<HTMLButtonElement>,
      ) => void;
  /** optional override to set the Fab to an active state, defaults to entity value */
  active?: boolean;
  /** the children of the fabCard, useful or small text */
  children?: React.ReactNode;
  /** disable the fab card, onClick will not fire */
  disabled?: boolean;
  /** passed to the ripple component to stop double scaling effect @default true */
  preventPropagation?: boolean;
  /** the border radius of the fab button @default "50%" */
  borderRadius?: CSSProperties["borderRadius"];
  /** disables the scale effect when clicking the button */
  disableScaleEffect?: boolean;
}

function _FabCard<E extends EntityName>({
  title: _title,
  tooltipPlacement,
  icon: _icon,
  iconColor,
  noIcon,
  size = 48,
  entity: _entity,
  serviceData,
  service,
  onClick,
  active: _active,
  children,
  disabled = false,
  className,
  preventPropagation = false,
  id,
  cssStyles,
  borderRadius = "50%",
  disableScaleEffect,
  ...rest
}: FabCardProps<E>): JSX.Element {
  const [openModal, setOpenModal] = useState(false);
  const entity = useEntity(_entity || "unknown", {
    returnNullIfNotFound: true,
  });
  const domain = _entity ? computeDomain(_entity) : null;
  const icon = typeof _icon === "string" ? _icon : null;
  const domainIcon = useIconByDomain(domain === null ? "unknown" : domain, {
    fontSize: `${size / 1.7}px`,
    color: iconColor || "currentcolor",
  });
  const hasChildren = typeof children !== "undefined";
  const _borderRadius = hasChildren ? 10 : borderRadius;
  const isUnavailable =
    typeof entity?.state === "string"
      ? isUnavailableState(entity.state)
      : false;
  const entityIcon = useIconByEntity(_entity || "unknown", {
    fontSize: `${size / 1.7}px`,
    color: iconColor || "currentcolor",
  });
  const iconElement = useIcon(icon, {
    fontSize: `${size / 1.7}px`,
    color: iconColor || "currentcolor",
  });
  const active =
    typeof _active === "boolean"
      ? _active
      : entity === null
      ? false
      : entity.state !== "off" && !isUnavailable;
  const onClickHandler = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      // so we can expect it to throw errors however the parent level ts validation will catch invalid params.
      if (typeof service === "string" && entity && !isUnavailable) {
        // @ts-expect-error - we don't actually know the service at this level
        const caller = entity.api[service];
        caller(serviceData);
      }
      if (typeof onClick === "function") {
        // @ts-expect-error - nothing wrong with the types here, service will be accurate, inspect later
        onClick(entity, event);
      }
    },
    [service, entity, serviceData, disabled, isUnavailable, onClick],
  );
  const longPressEvent = useLongPress(
    (e) => {
      // ignore on right click
      if (("button" in e && e.button === 2) || disabled || isUnavailable)
        return;
      setOpenModal(true);
    },
    {
      isPreventDefault: false,
    },
  );
  const title = useMemo(
    () => _title ?? (domain === null ? null : startCase(lowerCase(domain))),
    [_title, domain],
  );
  return (
    <>
      <Tooltip
        placement={tooltipPlacement}
        title={`${_title ?? entity?.attributes?.friendly_name ?? title ?? ""}${
          entity?.state ? ` - ${entity.state}` : ""
        }`}
      >
        <StyledRipples
          id={id}
          className={`fab-card ${className ?? ""} ${
            disabled ? "disabled" : ""
          } ${active ? "active" : ""} ${isUnavailable ? "unavailable" : ""}`}
          preventPropagation={preventPropagation}
          disabled={disabled || isUnavailable}
          borderRadius={_borderRadius}
          cssStyles={cssStyles}
          whileTap={{
            scale: disabled || isUnavailable || disableScaleEffect ? 1 : 0.9,
          }}
        >
          <StyledFabCard
            className={`icon ${active ? "active " : ""}`}
            disabled={disabled || isUnavailable}
            active={active}
            layoutId={
              typeof _entity === "string" ? `${_entity}-fab-card` : undefined
            }
            size={size}
            borderRadius={_borderRadius}
            {...longPressEvent}
            {...rest}
            hasChildren={hasChildren}
            onClick={onClickHandler}
          >
            {noIcon !== true && (iconElement || entityIcon || domainIcon)}
            {hasChildren ? children : undefined}
          </StyledFabCard>
        </StyledRipples>
      </Tooltip>
      {typeof _entity === "string" && (
        <ModalByEntityDomain
          entity={_entity as EntityName}
          title={title ?? "Unknown title"}
          onClose={() => {
            setOpenModal(false);
          }}
          open={openModal}
          id={`${_entity}-fab-card`}
        />
      )}
    </>
  );
}
/** The Fab (Floating Action Button) Card is a simple button with an icon to trigger something on press */
export function FabCard<E extends EntityName>(props: FabCardProps<E>) {
  return (
    <ErrorBoundary {...fallback({ prefix: "FabCard" })}>
      <_FabCard {...props} />
    </ErrorBoundary>
  );
}
