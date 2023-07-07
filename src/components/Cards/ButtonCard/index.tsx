import { useCallback, useMemo } from "react";
import styled from "@emotion/styled";
import { HassEntity } from "home-assistant-js-websocket";
import { lowerCase, startCase } from "lodash";
import type { EntityToServices, ServiceData } from "@typings";
import {
  useEntity,
  useIconByDomain,
  useIcon,
  useApi,
  useIconByEntity,
} from "@hooks";
import { Ripples } from "../../Shared/Ripple";
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
  justify-content: center;
  cursor: pointer;
  background-color: var(--ha-primary-background);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s cubic-bezier(0.06, 0.67, 0.37, 0.99);

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
`;

const LayoutRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  margin-bottom: 20px;
`;

const Title = styled.div`
  color: var(--ha-secondary-color);
  font-size: 0.7rem;
`;

const Description = styled.div`
  color: var(--ha-primary-color);
  font-size: 0.8rem;
  padding-left: 6px;
`;
export interface BaseProps {
  /** Optional icon param, this is automatically retrieved by the "domain" name if provided, or can be overwritten with a custom value  */
  icon?: string | null;
  /** the css color value of the icon */
  iconColor?: string | null;
  /** the css color value of the background of the icon */
  iconBackgroundColor?: string | null;
  /** By default, the title is retrieved from the domain name, or you can specify a manual title */
  title?: string | null;
  /** By default, the description is retrieved from the friendly name of the entity, or you can specify a manual description */
  description?: string | null;
  /** optional classname to provide */
  className?: string;
}

export interface ServiceProps<
  E extends string,
  S extends keyof EntityToServices<E>
> extends BaseProps {
  /** The service name, eg "toggle, turnOn ..." */
  service: S;
  /** The data to pass to the service */
  serviceData?: ServiceData<E, S>;
  /** The name of your entity */
  entity: E;
  /** the onClick handler is called when the button is pressed after the api service is called automatically.  */
  onClick?: (entity: HassEntity) => void;
}
export interface ButtonCardProps<
  E extends string,
  S extends keyof EntityToServices<E>
> extends Partial<ServiceProps<E, S>> {
  /** Optional active param, By default this is updated via home assistant */
  active?: boolean;
  /** The onClick handler is called when the button is pressed  */
  onClick?: () => void;
}

function ServiceButton<E extends string, S extends keyof EntityToServices<E>>({
  service,
  serviceData,
  entity: _entity,
  title: _title,
  description: _description,
  icon: _icon,
  onClick,
}: ServiceProps<E, S>) {
  const domain = computeDomain(_entity);
  const api = useApi(domain);
  const entity = useEntity(_entity);
  const icon = useIconByDomain(domain);
  const entityIcon = useIconByEntity(_entity);
  const on = entity.state === "on";

  const inputIcon = useIcon(_icon || null);
  const useApiHandler = useCallback(() => {
    // @ts-expect-error - at this point we don't actually know the service
    // so we can expect it to throw errors however the parent level ts validation will catch invalid params.
    api[service](entity.entity_id, serviceData);
    if (typeof onClick === "function") onClick(entity);
  }, [api, service, serviceData, entity, onClick]);
  const description = useMemo(() => {
    return _description === null
      ? null
      : _description || entity?.attributes.friendly_name || entity.entity_id;
  }, [_description, entity]);
  const title = useMemo(
    () => _title || startCase(lowerCase(domain)),
    [_title, domain]
  );

  return (
    <StyledButtonCard onClick={useApiHandler}>
      <LayoutBetween>
        <Fab
          brightness={(on && entity.custom.brightness) || "brightness(100%)"}
          rgbaColor={
            (on && entity.custom.rgbaColor) || "rgba(255,255,255,0.15)"
          }
          rgbColor={(on && entity.custom.rgbColor) || "white"}
        >
          {inputIcon || entityIcon || icon}
        </Fab>
        <Description>{description}</Description>
      </LayoutBetween>
      <Title>
        {title} {entity.state} - {entity.custom.relativeTime}
      </Title>
    </StyledButtonCard>
  );
}
/** The ButtonCard is a simple to use component to make it easy to control and visualize the state of a device. */
export function ButtonCard<
  E extends string,
  S extends keyof EntityToServices<E>
>({
  service,
  entity,
  iconColor,
  iconBackgroundColor,
  ...rest
}: ButtonCardProps<E, S>) {
  const isServiceButton = useMemo(() => {
    return [service, entity].every((value) => typeof value !== "undefined");
  }, [service, entity]);
  const { title, description, onClick, active, icon, ...others } = rest;
  const iconElement = useIcon(icon || null);
  return (
    <Ripples borderRadius="1rem">
      {isServiceButton ? (
        <ServiceButton {...rest} service={service!} entity={entity!} />
      ) : (
        <StyledButtonCard {...others} onClick={onClick}>
          <LayoutBetween>
            <Fab
              brightness="brightness(100%)"
              rgbaColor={iconBackgroundColor || "rgba(255,255,255,0.35)"}
              rgbColor={iconColor || "rgb(255,255,255)"}
            >
              {iconElement}
            </Fab>
            <Toggle active={active === true}>
              <ToggleState />
            </Toggle>
          </LayoutBetween>
          <LayoutRow>
            {title && <Title>{title}</Title>}
            {description && <Description>{description}</Description>}
          </LayoutRow>
        </StyledButtonCard>
      )}
    </Ripples>
  );
}
