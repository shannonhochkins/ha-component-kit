import { useCallback, useMemo, useState } from "react";
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
import { Ripples, ModalByEntityDomain, fallback } from "@components";
import { useLongPress } from "react-use";
import { startCase, lowerCase } from "lodash";
import { ErrorBoundary } from "react-error-boundary";

const StyledFabCard = styled(motion.button)<{
  size: number;
  active: boolean;
}>`
  all: unset;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
  text-align: center;
  border-radius: 50%;
  background-color: var(--ha-300-shade);
  color: ${(props) =>
    props.active ? `var(--ha-A400)` : `var(--ha-500-shade-contrast)`};
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: background-color, color, box-shadow;
  svg {
    transition: color var(--ha-transition-duration) var(--ha-easing);
  }
  &:not(:disabled):hover {
    background-color: var(--ha-400-shade);
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.8;
  }
  font-size: 0.7rem;
  ${(props) =>
    props.size &&
    `
    height: ${props.size}px;
    width: ${props.size}px;
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
  /** The onClick handler is called when the button is pressed, the first argument will be entity object with api methods if entity is provided  */
  onClick?: E extends undefined
    ? (entity: null) => void
    : (entity: HassEntityWithApi<ExtractDomain<E>>) => void;
  /** optional override to set the Fab to an active state @defaults to entity value */
  active?: boolean;
  /** the children of the fabCard, useful or small text */
  children?: React.ReactNode;
  /** disable the fab card, onClick will not fire */
  disabled?: boolean;
  /** passed to the ripple component to stop double scaling effect @default true */
  preventPropagation?: boolean;
}

function _FabCard<E extends EntityName>({
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
  const isUnavailable = typeof entity?.state === 'string' ? isUnavailableState(entity.state) : false;
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
  const onClickHandler = useCallback(() => {
    if (disabled) return;
    // so we can expect it to throw errors however the parent level ts validation will catch invalid params.
    if (typeof service === "string" && entity && !isUnavailable) {
      // @ts-expect-error - we don't actually know the service at this level
      const caller = entity.api[service];
      caller(serviceData);
    }
    if (typeof onClick === "function") {
      // @ts-expect-error - nothing wrong with the types here, service will be accurate, inspect later
      onClick(entity);
    }
  }, [service, entity, serviceData, disabled, isUnavailable, onClick]);
  const longPressEvent = useLongPress((e) => {
    // ignore on right click
    if (("button" in e && e.button === 2) || (disabled || isUnavailable)) return;
    setOpenModal(true);
  }, {
    isPreventDefault: false,
  });
  const title = useMemo(
    () => (domain === null ? null : startCase(lowerCase(domain))),
    [domain],
  );
  console.log('disabled', disabled, isUnavailable)
  return (
    <>
      <Ripples
        preventPropagation={preventPropagation}
        disabled={disabled || isUnavailable}
        borderRadius="50%"
        whileTap={{ scale: disabled || isUnavailable ? 1 : 0.9 }}
      >
        <StyledFabCard
          disabled={disabled || isUnavailable}
          active={active}
          layoutId={
            typeof _entity === "string" ? `${_entity}-fab-card` : undefined
          }
          size={size}
          {...longPressEvent}
          {...rest}
          onClick={onClickHandler}
          className={`${active ? "active " : ""}${className ?? ''}`}
        >
          {noIcon !== true && (iconElement || entityIcon || domainIcon)}
          {typeof children !== "undefined" ? children : undefined}
        </StyledFabCard>
      </Ripples>
      {typeof _entity === "string" && (
        <ModalByEntityDomain
          entity={_entity as EntityName}
          title={title || "Unknown title"}
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
