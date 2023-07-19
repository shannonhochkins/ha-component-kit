import { useCallback, useMemo } from "react";
import styled from "@emotion/styled";
import { lowerCase, startCase } from "lodash";
import type {
  DomainService,
  ExtractDomain,
  ServiceData,
  HassEntityWithApi,
  AllDomains,
} from "@hakit/core";
import {
  useEntity,
  useIconByDomain,
  useIcon,
  useIconByEntity,
} from "@hakit/core";
import { Ripples } from "@components";
import { computeDomain } from "@utils/computeDomain";

export const StyledButtonCard = styled.button`
  all: unset;
  padding: 1rem;
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  width: var(--ha-device-button-card-width);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  cursor: pointer;
  background-color: var(--ha-primary-background);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: box-shadow, transform;

  &:active {
    transform: translateZ(10px) scale(0.98);
  }

  &:hover,
  &:focus,
  &:active {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  }
`;

const ToggleState = styled.div`
  background-color: white;
  border-radius: 100%;
  width: 16px;
  height: 16px;
  position: absolute;
  top: 2px;
  left: 0;
`;

interface ToggleProps {
  active: boolean;
}

const Toggle = styled.div<ToggleProps>`
  position: relative;
  background-color: ${(props) =>
    props.active ? "var(--ha-primary-active)" : "var(--ha-primary-inactive)"};
  border-radius: 10px;
  width: 40px;
  height: 20px;
  flex-grow: 0;
  flex-shrink: 0;
  transition: background-color var(--ha-transition-duration) var(--ha-easing);
  margin-left: 20px;
  ${ToggleState} {
    transition: var(--ha-transition-duration) var(--ha-easing);
    transition-property: left, transform;
    left: ${(props) => (props.active ? "100%" : "0")};
    transform: ${(props) =>
      props.active
        ? "translate3d(calc(-100% - 2px), 0, 0)"
        : "translate3d(calc(0% + 2px), 0, 0)"};
  }
`;

const Fab = styled.div<{
  rgbaColor: string;
  rgbColor: string;
  brightness: string;
}>`
  border-radius: 100%;
  padding: 6px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${(props) =>
    props.rgbaColor &&
    `
    background-color: ${props.rgbaColor};
  `}
  ${(props) =>
    props.rgbColor &&
    `
    color: ${props.rgbColor};
  `}
  ${(props) =>
    props.brightness &&
    `
    filter: ${props.brightness};
  `}
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: background-color, color, filter;
  svg {
    transition: var(--ha-transition-duration) var(--ha-easing);
    transition-property: color;
  }
`;

const LayoutBetween = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  margin-bottom: 20px;
  gap: 10px;
`;

const LayoutRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
`;

const Title = styled.div`
  color: var(--ha-secondary-color);
  font-size: 0.7rem;
  margin: 2px 0;
`;

const Description = styled.div`
  color: var(--ha-primary-color);
  font-size: 0.8rem;
`;
export interface ButtonCardProps<
  E extends `${AllDomains}.${string}`,
  S extends DomainService<ExtractDomain<E>>
> extends Omit<React.ComponentProps<"button">, "title" | "onClick"> {
  /** Optional icon param, this is automatically retrieved by the "domain" name if provided, or can be overwritten with a custom value  */
  icon?: string | null;
  /** the css color value of the icon */
  iconColor?: string | null;
  /** By default, the title is retrieved from the domain name, or you can specify a manual title */
  title?: string | null;
  /** By default, the description is retrieved from the friendly name of the entity, or you can specify a manual description */
  description?: string | null;
  /** The service name, eg "toggle, turnOn ..." */
  service?: S;
  /** The data to pass to the service */
  serviceData?: ServiceData<ExtractDomain<E>, S>;
  /** The name of your entity */
  entity?: E;
  /** The onClick handler is called when the button is pressed, the first argument will be entity object with api methods if entity is provided  */
  onClick?: (entity: HassEntityWithApi<ExtractDomain<E>>) => void;
  /** Optional active param, By default this is updated via home assistant */
  active?: boolean;
  /** the layout of the button card, this changes slightly, just preferences really @default default */
  layout?: "default" | "slim";
}

export function ButtonCard<
  E extends `${AllDomains}.${string}`,
  S extends DomainService<ExtractDomain<E>>
>({
  service,
  entity: _entity,
  iconColor,
  icon: _icon,
  active,
  serviceData,
  onClick,
  description: _description,
  title: _title,
  layout,
  ...rest
}: ButtonCardProps<E, S>): JSX.Element {
  const domain = _entity ? computeDomain(_entity) : null;
  const entity = useEntity(_entity || "number.non_existent", {
    returnNullIfNotFound: true,
  });
  const icon = typeof _icon === "string" ? _icon : null;
  const domainIcon = useIconByDomain(domain === null ? "unknown" : domain, {
    color: iconColor || undefined,
  });
  const entityIcon = useIconByEntity(_entity || "number.non_existent", {
    color: iconColor || undefined,
  });
  const isDefaultLayout = layout === "default" || layout === undefined;
  const on = entity ? entity.state !== "off" : active || false;
  // const { title, description, onClick, active, icon, ...others } = rest;
  const iconElement = useIcon(icon, {
    color: iconColor || undefined,
  });
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
  // use the input description if provided, else use the friendly name if available, else entity name, else null
  const description = useMemo(() => {
    return _description === null
      ? null
      : _description ||
          entity?.attributes.friendly_name ||
          entity?.entity_id ||
          null;
  }, [_description, entity]);
  // use the input title if provided, else use the domain if available, else null
  const title = useMemo(
    () => _title || (domain !== null ? startCase(lowerCase(domain)) : null),
    [_title, domain]
  );
  return (
    <Ripples borderRadius="1rem">
      <StyledButtonCard {...rest} onClick={useApiHandler}>
        <LayoutBetween>
          <Fab
            brightness={(on && entity?.custom.brightness) || "brightness(100%)"}
            rgbaColor={
              entity
                ? on
                  ? entity.custom.rgbaColor
                  : "rgba(255,255,255,0.15)"
                : on
                ? "var(--ha-primary-active)"
                : "var(--ha-primary-inactive)"
            }
            rgbColor={
              entity
                ? on
                  ? entity.custom.rgbColor
                  : "white"
                : on
                ? "var(--ha-secondary-active)"
                : "var(--ha-secondary-inactive)"
            }
          >
            {iconElement || entityIcon || domainIcon}
          </Fab>
          {isDefaultLayout && (
            <Toggle active={on}>
              <ToggleState />
            </Toggle>
          )}
          {!isDefaultLayout && <Description>{description}</Description>}
        </LayoutBetween>
        <LayoutRow>
          {!isDefaultLayout && (
            <Title>
              {title}{" "}
              {typeof active === "boolean"
                ? active
                  ? "- on"
                  : "- off"
                : entity
                ? `- ${entity.state}`
                : ""}
              {entity ? ` - ${entity.custom.relativeTime}` : ""}
            </Title>
          )}
          {isDefaultLayout && (
            <Title>
              {title && <Title>{title}</Title>}
              {description && <Description>{description}</Description>}
              {entity && <Title>Updated: {entity.custom.relativeTime}</Title>}
            </Title>
          )}
        </LayoutRow>
      </StyledButtonCard>
    </Ripples>
  );
}
