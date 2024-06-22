import { useMemo, Children, isValidElement, ReactNode, ReactElement } from "react";
import styled from "@emotion/styled";
import {
  localize,
  useEntity,
  useHass,
  useIconByDomain,
  useIcon,
  useIconByEntity,
  isUnavailableState,
  ON,
  OFF,
  computeDomainTitle,
  computeDomain,
  type LocaleKeys,
  type HassEntityWithService,
  type ExtractDomain,
  type EntityName,
} from "@hakit/core";
import { type IconProps } from "@iconify/react";
import { fallback, Column, CardBase, type CardBaseProps, type AvailableQueries } from "@components";
import { ErrorBoundary } from "react-error-boundary";

const StyledButtonCard = styled(CardBase)`
  &.slim {
    justify-content: center;
    .fab-card-inner {
      width: 3rem;
      height: 3rem;
    }
    .button-card-trigger {
      align-items: center;
      > .contents {
        width: 100%;
      }
    }
  }
  .button-card-trigger > .features {
    width: 100%;
  }
  .button-card-trigger > .features > .fit-content {
    flex-basis: 100%;
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
    .button-card-trigger {
      align-items: center;
    }
  }
  .footer > .title {
    text-align: left;
  }
  &:not(.disabled),
  &:not(:disabled) {
    &:not(:focus):hover {
      .fab-card-inner:not(.custom) {
        background-color: var(--ha-S500);
        color: var(--ha-S500-contrast);
      }
    }
  }
`;

const Contents = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: stretch;
  height: 100%;
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

const Fab = styled.div<
  React.ComponentProps<"div"> & {
    brightness: string;
  }
>`
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
  width: 100%;
  &.vertical {
    flex-direction: column;
    height: 100%;
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  margin-top: 20px;
  width: 100%;
`;

const Title = styled.div`
  color: var(--ha-S100-contrast);
  font-size: 0.9rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const Description = styled.div`
  color: var(--ha-S300-contrast);
  font-size: 0.7rem;
  margin: 2px 0;
  text-align: left;
  width: 100%;
  &.center {
    text-align: center;
  }
  &.secondary {
    color: var(--ha-S500-contrast);
  }
  &.slim-vertical {
    text-align: center;
  }
`;

type OmitProperties = "as" | "children" | "ref" | "description";

export interface ButtonCardProps<E extends EntityName> extends Omit<CardBaseProps<"button", E>, OmitProperties> {
  /** Optional icon param, this is automatically retrieved by the "domain" name if provided, or can be overwritten with a custom value, provide a string with the name of the icon, or a custom icon by providing a react node  */
  icon?: ReactNode | null;
  /** the props for the icon, which includes styles for the icon */
  iconProps?: Omit<IconProps, "icon">;
  /** the props to provide to the Fab element within the card, useful if you want to re-style it */
  fabProps?: React.ComponentProps<"div">;
  /** By default, the title is retrieved from the friendly name of the entity, or you can specify a manual title */
  title?: ReactNode | null;
  /** The description will naturally fall under the title, by default it will show the information of the entity like the state */
  description?: ReactNode | null;
  /** override the unit displayed alongside the state if the entity has a unit of measurement */
  unitOfMeasurement?: ReactNode;
  /** The layout of the button card, mimics the style of HA mushroom cards in slim/slim-vertical @default "default" */
  layoutType?: "default" | "slim" | "slim-vertical";
  /** custom method to render the state however you choose, this will just change how the "suffix" of the title will appear */
  customRenderState?: (entity: HassEntityWithService<ExtractDomain<E>>) => ReactNode;
  /** hide the icon shown in the component @default false */
  hideIcon?: boolean;
  /** Hide the state value @default false */
  hideState?: boolean;
  /** Hide the last updated time @default false */
  hideLastUpdated?: boolean;
  /** This forces hideState, hideLastUpdated and will only show the entity name / description prop @default false */
  hideDetails?: boolean;
  /** Will hide the "toggle" element shown in the default layout @default false */
  hideToggle?: boolean;
  /** The children to render at the bottom of the card */
  children?: React.ReactNode;
}
function _ButtonCard<E extends EntityName>({
  entity: _entity,
  service,
  serviceData,
  iconProps,
  icon: _icon,
  fabProps,
  active,
  onClick,
  description: _description,
  title: _title,
  layoutType,
  disabled = false,
  className,
  hideIcon = false,
  hideState = false,
  hideLastUpdated = false,
  children,
  hideDetails = false,
  cssStyles,
  key,
  hideToggle = false,
  unitOfMeasurement,
  customRenderState,
  ...rest
}: ButtonCardProps<E>): React.ReactNode {
  const { useStore } = useHass();
  const globalComponentStyle = useStore((state) => state.globalComponentStyles);
  const domain = _entity ? computeDomain(_entity) : null;
  const entity = useEntity(_entity || "unknown", {
    returnNullIfNotFound: true,
  });
  const iconNode = typeof _icon !== "undefined" && typeof _icon !== "string" ? _icon : null;
  const domainIcon = useIconByDomain(domain === null ? "unknown" : domain, {
    ...(iconProps ?? {}),
  });
  const entityIcon = useIconByEntity(_entity || "unknown", {
    ...(iconProps ?? {}),
  });
  const isDefaultLayout = layoutType === "default" || layoutType === undefined;
  const isSlimLayout = layoutType === "slim" || layoutType === "slim-vertical";
  const isUnavailable = typeof entity?.state === "string" ? isUnavailableState(entity.state) : false;
  const on = entity ? entity.state !== "off" && !isUnavailable && !disabled : active || false;
  const iconElement = useIcon(typeof _icon === "string" ? _icon : null, {
    ...(iconProps ?? {}),
  });
  // use the input description if provided, else use the friendly name if available, else entity name, else null
  const title = useMemo(() => {
    return _title === null ? null : _title || entity?.attributes.friendly_name || entity?.entity_id || null;
  }, [_title, entity]);
  // use the input title if provided, else use the domain if available, else null
  const description = useMemo(
    () => _description || (domain !== null && _entity ? computeDomainTitle(_entity, entity?.attributes?.device_class) : null),
    [_description, domain, entity, _entity],
  );

  function renderState() {
    if (hideState) return null;
    if (customRenderState && entity) {
      // @ts-expect-error - this is correct, no idea why it's complaining
      return customRenderState(entity);
    }
    if (typeof active === "boolean") {
      // static usage without entity
      return active ? `${localize(ON)}` : `${localize(OFF)}`;
    }
    if (isUnavailable) return localize("unavailable");
    if (entity && entity.state === ON && domain === "light") {
      // dynamic usage with entity if it's a light
      return `${entity.custom.brightnessValue}%`;
    }
    if (entity) {
      if (entity.attributes.unit_of_measurement) {
        return `${localize(entity.state as LocaleKeys)}${unitOfMeasurement ?? entity.attributes.unit_of_measurement}`;
      }
      return `${localize(entity.state as LocaleKeys)}`;
    }
    return null;
  }
  const hasFeatures = Children.toArray(rest?.features).filter((child): child is ReactElement => isValidElement(child)).length > 0;
  return (
    <StyledButtonCard
      key={key}
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
      className={`${className ?? ""} ${layoutType ?? "default"} button-card`}
      triggerClass={`button-card-trigger`}
      cssStyles={`
        ${globalComponentStyle.buttonCard ?? ""}
        ${cssStyles ?? ""}
      `}
      {...rest}
    >
      <Contents className={`contents ${hasFeatures ? "has-features" : ""}`}>
        <LayoutBetween className={`layout-between ${layoutType === "slim-vertical" ? "vertical" : ""}`}>
          {!hideIcon && (
            <Fab
              brightness={(on && entity?.custom.brightness) || "brightness(100%)"}
              {...fabProps}
              className={`fab-card-inner icon ${fabProps?.className} ${fabProps?.style ? "custom" : ""}`}
              style={{
                ...fabProps?.style,
                backgroundColor:
                  fabProps?.style?.backgroundColor ??
                  (on ? (domain === "light" ? entity?.custom?.rgbaColor ?? "var(--ha-A400)" : "var(--ha-A400)") : "var(--ha-S400)"),
                color:
                  fabProps?.style?.color ??
                  (entity ? (on ? entity.custom.rgbColor : "var(--ha-S500-contrast)") : on ? "var(--ha-A400)" : "var(--ha-S500-contrast)"),
              }}
            >
              {iconNode ?? iconElement ?? entityIcon ?? domainIcon}
            </Fab>
          )}
          {isDefaultLayout && !hideToggle && (
            <Toggle active={on} className="toggle">
              {!isUnavailable && <ToggleState active={on} className="toggle-state" />}
            </Toggle>
          )}
          {isSlimLayout && (
            <Column fullWidth alignItems={layoutType === "slim-vertical" ? "center" : "flex-start"}>
              {title && <Title className="title">{title}</Title>}
              {!hideDetails && description && (
                <Description className={`description ${layoutType ?? ""}`}>
                  {description} {!hideState ? ` - ${renderState()}` : ""}
                </Description>
              )}
              {entity && !hideLastUpdated && (
                <Description className={`description secondary ${layoutType === "slim-vertical" ? "center" : ""}`}>
                  {localize("last_updated")}: {entity.custom.relativeTime}
                </Description>
              )}
            </Column>
          )}
        </LayoutBetween>
        {isDefaultLayout && (
          <Footer className="footer">
            {title && <Title className="title">{title}</Title>}
            {!hideDetails && description && (
              <Description className="description">
                {description}
                {entity && !hideState ? ` - ${renderState()}` : ""}
              </Description>
            )}
            {!hideDetails && entity && !hideLastUpdated && (
              <Description className="description secondary">
                {localize("last_updated")}: {entity.custom.relativeTime}
              </Description>
            )}
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
