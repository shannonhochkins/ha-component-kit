import { useMemo } from "react";
import styled from "@emotion/styled";
import { lowerCase, startCase } from "lodash";
import type { EntityName } from "@hakit/core";
import { useEntity, useIconByDomain, useIcon, useIconByEntity, isUnavailableState, ON } from "@hakit/core";
import { fallback, Column, CardBase, type CardBaseProps, type AvailableQueries } from "@components";
import { computeDomain } from "@utils/computeDomain";
import { ErrorBoundary } from "react-error-boundary";

const StyledButtonCard = styled(CardBase)`
  &.slim {
    justify-content: center;
    .fab-card-inner {
      width: 3rem;
      height: 3rem;
    }
  }

  .children {
    width: 100%;
  }
  &.slim-vertical {
    justify-content: center;
    .fab-card-inner {
      width: 3rem;
      height: 3rem;
    }
  }
`;

const Contents = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
`;

interface ToggleProps {
  active: boolean;
}

const ToggleState = styled.div<ToggleProps>`
  background-color: var(--ha-100);
  border-radius: 100%;
  width: 16px;
  height: 16px;
  position: absolute;
  top: 2px;
  left: 0;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.5);
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: left, transform;
  left: ${(props) => (props.active ? "100%" : "0px")};
  transform: ${(props) => (props.active ? "translate3d(calc(-100% - 2px), 0, 0)" : "translate3d(calc(0% + 2px), 0, 0)")};
`;

const Toggle = styled.div<ToggleProps>`
  position: relative;
  background-color: ${(props) => (props.active ? "var(--ha-A400)" : "var(--ha-S100)")};
  border-radius: 10px;
  width: 40px;
  height: 20px;
  flex-grow: 0;
  flex-shrink: 0;
  transition: background-color var(--ha-transition-duration) var(--ha-easing);
  margin-left: 20px;
`;

const Fab = styled.div<{
  backgroundColor: string;
  textColor: string;
  brightness: string;
}>`
  border-radius: 100%;
  padding: 6px;
  width: 2rem;
  height: 2rem;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.2);
  ${(props) =>
    props.backgroundColor &&
    `
    background-color: ${props.backgroundColor};
  `}
  ${(props) =>
    props.textColor &&
    `
    color: ${props.textColor};
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
  gap: 10px;
  &.vertical {
    flex-direction: column;
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  margin-top: 20px;
`;

const Title = styled.div`
  color: var(--ha-S500-contrast);
  font-size: 0.7rem;
  margin: 2px 0;
  text-align: left;
  &.slim-vertical {
    text-align: center;
  }
`;

const Description = styled.div`
  color: var(--ha-S50-contrast);
  font-size: 0.8rem;
  font-weight: 500;
`;

type OmitProperties = "as" | "children" | "ref";

export interface ButtonCardProps<E extends EntityName> extends Omit<CardBaseProps<"button", E>, OmitProperties> {
  /** Optional icon param, this is automatically retrieved by the "domain" name if provided, or can be overwritten with a custom value  */
  icon?: string | null;
  /** the css color value of the icon */
  iconColor?: string | null;
  /** By default, the description is retrieved from the friendly name of the entity, or you can specify a manual description */
  description?: string | null;
  /** The layout of the button card, mimics the style of HA mushroom cards in slim/slim-vertical @default default */
  defaultLayout?: "default" | "slim" | "slim-vertical";
  /** Hide the state value */
  hideState?: boolean;
  /** Hide the last updated time */
  hideLastUpdated?: boolean;
  /** The children to render at the bottom of the card */
  children?: React.ReactNode;
  /** This forces hideState, hideLastUpdated and will only show the entity name / description prop */
  hideDetails?: boolean;
}
function _ButtonCard<E extends EntityName>({
  entity: _entity,
  service,
  serviceData,
  iconColor,
  icon: _icon,
  active,
  onClick,
  description: _description,
  title: _title,
  defaultLayout,
  disabled = false,
  className,
  hideState,
  hideLastUpdated,
  children,
  hideDetails,
  ...rest
}: ButtonCardProps<E>): JSX.Element {
  const domain = _entity ? computeDomain(_entity) : null;
  const entity = useEntity(_entity || "unknown", {
    returnNullIfNotFound: true,
  });
  const icon = typeof _icon === "string" ? _icon : null;
  const domainIcon = useIconByDomain(domain === null ? "unknown" : domain, {
    color: iconColor || undefined,
  });
  const entityIcon = useIconByEntity(_entity || "unknown", {
    color: iconColor || undefined,
  });
  const isDefaultLayout = defaultLayout === "default" || defaultLayout === undefined;
  const isSlimLayout = defaultLayout === "slim" || defaultLayout === "slim-vertical";
  const isUnavailable = typeof entity?.state === "string" ? isUnavailableState(entity.state) : false;
  const on = entity ? entity.state !== "off" && !isUnavailable : active || false;
  const iconElement = useIcon(icon, {
    color: iconColor || undefined,
  });
  // use the input description if provided, else use the friendly name if available, else entity name, else null
  const description = useMemo(() => {
    return _description === null ? null : _description || entity?.attributes.friendly_name || entity?.entity_id || null;
  }, [_description, entity]);
  // use the input title if provided, else use the domain if available, else null
  const title = useMemo(() => _title || (domain !== null ? startCase(lowerCase(domain)) : null), [_title, domain]);

  function renderState() {
    if (hideState) return null;
    if (typeof active === "boolean") {
      // static usage without entity
      return active ? "- on" : "- off";
    }
    if (entity && entity.state === ON && domain === "light") {
      // dynamic usage with entity if it's a light
      return `- ${entity.custom.brightnessValue}%`;
    }
    if (entity) {
      return entity.state;
    }
    return null;
  }

  return (
    <StyledButtonCard
      as="button"
      // @ts-expect-error - don't know the entity name, so we can't know the service type
      service={service}
      // @ts-expect-error - don't know the entity name, so we can't know the service data
      serviceData={serviceData}
      active={active}
      entity={_entity as EntityName}
      title={title ?? undefined}
      disabled={disabled || isUnavailable}
      onClick={onClick}
      className={`${className ?? ""} ${defaultLayout ?? "default"} button-card`}
      {...rest}
    >
      <Contents>
        <LayoutBetween className={`layout-between ${defaultLayout === "slim-vertical" ? "vertical" : ""}`}>
          <Fab
            brightness={(on && entity?.custom.brightness) || "brightness(100%)"}
            className={`fab-card-inner icon`}
            backgroundColor={
              on ? (domain === "light" ? entity?.custom?.rgbaColor ?? "var(--ha-A400)" : "var(--ha-A400)") : "var(--ha-S400)"
            }
            textColor={
              entity ? (on ? entity.custom.rgbColor : "var(--ha-S500-contrast)") : on ? "var(--ha-A400)" : "var(--ha-S500-contrast)"
            }
          >
            {iconElement || entityIcon || domainIcon}
          </Fab>
          {isDefaultLayout && (
            <Toggle active={on} className="toggle">
              {!isUnavailable && <ToggleState active={on} className="toggle-state" />}
            </Toggle>
          )}
          {isSlimLayout && (
            <Column fullWidth alignItems={defaultLayout === "slim-vertical" ? "center" : "flex-start"}>
              <Description className="description">{description}</Description>
              {!hideDetails && (
                <Title className={`title ${defaultLayout ?? ""}`}>
                  {title} {renderState()}
                  {entity && !hideLastUpdated ? ` - ${entity.custom.relativeTime}` : ""}
                </Title>
              )}
            </Column>
          )}
        </LayoutBetween>
        {isDefaultLayout && (
          <Footer className="footer">
            <Title className="title">
              {!hideDetails && title && (
                <Title className="title">
                  {title}
                  {isUnavailable && entity && !hideState ? ` - ${entity.state}` : ""}
                </Title>
              )}
              {description && <Description className="description">{description}</Description>}
              {!hideDetails && entity && !hideLastUpdated && <Title className="title">Updated: {entity.custom.relativeTime}</Title>}
            </Title>
          </Footer>
        )}
        {children && <div className="children">{children}</div>}
      </Contents>
    </StyledButtonCard>
  );
}
/**
 * The ButtonCard component is an easy way to represent the state and control of an entity with a simple button, eventually I'll provide further options per domain, like being able to set the colours for lights etc...
 * Below are a few examples of layouts that the ButtonCard supports
 * */
export function ButtonCard<E extends EntityName>(props: ButtonCardProps<E>) {
  const defaultColumns: AvailableQueries = {
    xxs: 12,
    xs: 6,
    sm: 4,
    md: 3,
    lg: 2,
    xlg: 2,
  };
  return (
    <ErrorBoundary {...fallback({ prefix: "ButtonCard" })}>
      <_ButtonCard {...defaultColumns} {...props} />
    </ErrorBoundary>
  );
}
