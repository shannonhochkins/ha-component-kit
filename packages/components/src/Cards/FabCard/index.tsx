import { useCallback, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import type { MotionProps } from "framer-motion";
import {
  useEntity,
  useIconByDomain,
  useIcon,
  useIconByEntity,
} from "@hakit/core";
import { computeDomain } from "@utils/computeDomain";
import type {
  DomainService,
  ExtractDomain,
  ServiceData,
  HassEntityWithApi,
  AllDomains,
} from "@hakit/core";
import { Ripples, ModalLightControls } from "@components";
import { useLongPress } from "react-use";
import { startCase, lowerCase } from "lodash";

const StyledFabCard = styled(motion.button)<{
  size: number;
  active: boolean;
}>`
  all: unset;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  text-align: center;
  border-radius: 50%;
  background-color: var(--ha-secondary-background);
  color: ${(props) =>
    props.active ? `var(--ha-primary-active)` : `var(--ha-primary-color)`};
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: background-color, box-shadow;
  &:active {
    
  }
  &:hover {
    background-color: var(--ha-secondary-background-hover);
  }
  font-size: 0.7rem;
  ${(props) =>
    props.size &&
    `
    height: ${props.size}px;
    width: ${props.size}px;
  `}
`;

type Extendable = Omit<
  React.ComponentProps<"button">,
  "onClick" | "ref"
> &
  MotionProps;

export interface FabCardProps<
  E extends `${AllDomains}.${string}`,
  S extends DomainService<ExtractDomain<E>>
> extends Extendable {
  /** The size of the Fab, this applies to the width and height @default 40 */
  size?: number;
  /** Optional icon param, this is automatically retrieved by the "domain" name if provided, or can be overwritten with a custom value  */
  icon?: string | null;
  /** the css color value of the icon */
  iconColor?: string | null;
  /** will not show any icons */
  noIcon?: boolean;
  /** The service name, eg "toggle, turnOn ..." */
  service?: S;
  /** The data to pass to the service */
  serviceData?: ServiceData<ExtractDomain<E>, S>;
  /** The name of your entity */
  entity?: E;
  /** The onClick handler is called when the button is pressed, the first argument will be entity object with api methods if entity is provided  */
  onClick?: (entity: HassEntityWithApi<ExtractDomain<E>>) => void;
  /** optional override to set the Fab to an active state @defaults to entity value */
  active?: boolean;
  /** the children of the fabCard, useful or small text */
  children?: React.ReactNode;
}

/** The Fab (Floating Action Button) Card is a simple button with an icon to trigger something on press */
export function FabCard<
  E extends `${AllDomains}.${string}`,
  S extends DomainService<ExtractDomain<E>>
>({
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
  ...rest
}: FabCardProps<E, S>): JSX.Element {
  const [openModal, setOpenModal] = useState(false);
  const entity = useEntity(_entity || "unknown", {
    returnNullIfNotFound: true,
  });
  const domain = _entity ? computeDomain(_entity) : null;
  const icon = typeof _icon === "string" ? _icon : null;
  const domainIcon = useIconByDomain(domain === null ? "unknown" : domain, {
    fontSize: size / 2,
    color: iconColor || "currentcolor",
  });
  const entityIcon = useIconByEntity(_entity || "unknown", {
    fontSize: size / 2,
    color: iconColor || "currentcolor",
  });
  const iconElement = useIcon(icon, {
    fontSize: size / 2,
    color: iconColor || "currentcolor",
  });
  const longPressEvent = useLongPress(() => {
    setOpenModal(true);
  });
  const active =
    typeof _active === "boolean"
      ? _active
      : entity === null
      ? false
      : entity.state !== "off";
  const useApiHandler = useCallback(() => {
    // so we can expect it to throw errors however the parent level ts validation will catch invalid params.
    if (typeof service === "string" && entity) {
      // @ts-expect-error - we don't actually know the service at this level
      const caller = entity.api[service];
      caller(serviceData);
    }
    if (typeof onClick === "function")
      onClick(entity as HassEntityWithApi<ExtractDomain<E>>);
  }, [service, entity, serviceData, onClick]);
  const title = useMemo(
    () => domain === null ? null : startCase(lowerCase(domain)),
    [domain]
  );
  return (
    <>
      <Ripples borderRadius="50%">
        <StyledFabCard
          whileTap={{ scale: 0.9 }}
          active={active}
          layoutId={typeof _entity === 'string' ? `${_entity}-fab-card`: undefined}
          size={size}
          {...longPressEvent}
          {...rest}
          onClick={useApiHandler}
        >
          {noIcon !== true && (iconElement || entityIcon || domainIcon)}
          {typeof children !== "undefined" ? children : undefined}
        </StyledFabCard>
      </Ripples>
      {domain === "light" && (
        <ModalLightControls
          entity={_entity as `${"light"}.${string}`}
          title={title || "Unknown title"}
          onClose={() => {
            setOpenModal(false);
          }}
          open={openModal}
          id={`${_entity}-fab-card`}
        >
          Testing
        </ModalLightControls>
      )}
    </>
  );
}
