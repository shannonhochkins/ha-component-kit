import { useCallback, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { lowerCase, startCase } from "lodash";
import type {
  DomainService,
  ExtractDomain,
  ServiceData,
  HassEntityWithApi,
  EntityName,
} from "@hakit/core";
import {
  useEntity,
  useIconByDomain,
  useIcon,
  useIconByEntity,
  isUnavailableState,
  ON,
} from "@hakit/core";
import {
  Ripples,
  ModalByEntityDomain,
  fallback,
  Column,
  mq,
} from "@components";
import { computeDomain } from "@utils/computeDomain";
import type { MotionProps } from "framer-motion";
import { motion } from "framer-motion";
import { useLongPress } from "react-use";
import { ErrorBoundary } from "react-error-boundary";

const StyledButtonCard = styled(motion.button)`
  all: unset;
  padding: 1rem;
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  cursor: pointer;
  background-color: var(--ha-S300);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: background-color, box-shadow;
  width: calc(100% - 2rem);

  &:disabled {
    cursor: not-allowed;
    opacity: 0.8;
  }

  &:active {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  }
  &:not(:disabled):hover {
    background-color: var(--ha-S400);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  }
  .slim & {
    .fab-card-inner {
      width: 3rem;
      height: 3rem;
    }
  }
  .slim-vertical & {
    .fab-card-inner {
      width: 3rem;
      height: 3rem;
    }
  }
  .children {
    width: 100%;
  }
`;
const StyledRipples = styled(Ripples)`
  flex-shrink: 1;
  ${mq(
    ["mobile"],
    `
    width: 100%;
  `,
  )}
  ${mq(
    ["tablet"],
    `
    width: calc(50% - var(--gap, 0rem) / 2);
  `,
  )}
  ${mq(
    ["smallScreen"],
    `
    width: calc((100% - 2 * var(--gap, 0rem)) / 3);
  `,
  )}
  ${mq(
    ["mediumScreen"],
    `
    width: calc((100% - 3 * var(--gap, 0rem)) / 4);
  `,
  )}
  ${mq(
    ["desktop"],
    `
    width: calc((100% - 5 * var(--gap, 0rem)) / 6);
  `,
  )}
  ${mq(
    ["largeDesktop"],
    `
    width: calc((100% - 7 * var(--gap, 0rem)) / 8);
  `,
  )}
  &.slim {
    ${mq(
      ["mobile"],
      `
      width: 100%;
    `,
    )}
    ${mq(
      ["tablet"],
      `
      width: calc(50% - var(--gap, 0rem) / 2);
    `,
    )}
    ${mq(
      ["smallScreen"],
      `
      width: calc((100% - 2 * var(--gap, 0rem)) / 3);
    `,
    )}
    ${mq(
      ["mediumScreen"],
      `
      width: calc((100% - 3 * var(--gap, 0rem)) / 4);
    `,
    )}
    ${mq(
      ["desktop"],
      `
      width: calc((100% - 4 * var(--gap, 0rem)) / 5);
    `,
    )}
    ${mq(
      ["largeDesktop"],
      `
      width: calc((100% - 5 * var(--gap, 0rem)) / 6);
    `,
    )}
  }
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
  transform: ${(props) =>
    props.active
      ? "translate3d(calc(-100% - 2px), 0, 0)"
      : "translate3d(calc(0% + 2px), 0, 0)"};
`;

const Toggle = styled.div<ToggleProps>`
  position: relative;
  background-color: ${(props) =>
    props.active ? "var(--ha-A400)" : "var(--ha-S100)"};
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
  &.slim-vertical {
    text-align: center;
  }
`;

const Description = styled.div`
  color: var(--ha-S50-contrast);
  font-size: 0.8rem;
  font-weight: 500;
`;
type Extendable = Omit<
  React.ComponentProps<"button">,
  "title" | "onClick" | "ref"
> &
  MotionProps;
export interface ButtonCardProps<E extends EntityName> extends Extendable {
  /** Optional icon param, this is automatically retrieved by the "domain" name if provided, or can be overwritten with a custom value  */
  icon?: string | null;
  /** the css color value of the icon */
  iconColor?: string | null;
  /** By default, the title is retrieved from the domain name, or you can specify a manual title */
  title?: string | null;
  /** By default, the description is retrieved from the friendly name of the entity, or you can specify a manual description */
  description?: string | null;
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
  /** Optional active param, By default this is updated via home assistant */
  active?: boolean;
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
  service,
  entity: _entity,
  iconColor,
  icon: _icon,
  active,
  serviceData,
  onClick,
  description: _description,
  title: _title,
  defaultLayout,
  disabled = false,
  className,
  id,
  style,
  cssStyles,
  hideState,
  hideLastUpdated,
  children,
  hideDetails,
  ...rest
}: ButtonCardProps<E>): JSX.Element {
  const [openModal, setOpenModal] = useState(false);
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
  const isDefaultLayout =
    defaultLayout === "default" || defaultLayout === undefined;
  const isSlimLayout =
    defaultLayout === "slim" || defaultLayout === "slim-vertical";
  const isUnavailable =
    typeof entity?.state === "string"
      ? isUnavailableState(entity.state)
      : false;
  const on = entity
    ? entity.state !== "off" && !isUnavailable
    : active || false;
  const iconElement = useIcon(icon, {
    color: iconColor || undefined,
  });
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

  const onClickHandler = useCallback(() => {
    if (disabled) return;
    // so we can expect it to throw errors however the parent level ts validation will catch invalid params.
    if (typeof service === "string" && entity && !isUnavailable) {
      // @ts-expect-error - we don't actually know the service at this level
      const caller = entity.api[service];
      caller(serviceData);
    }
    if (typeof onClick === "function") {
      // @ts-expect-error - types are accurate, we just don't know the domain entity type
      onClick(entity);
    }
  }, [service, disabled, entity, serviceData, onClick, isUnavailable]);
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
    [_title, domain],
  );

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
    <>
      <StyledRipples
        id={id ?? undefined}
        borderRadius="1rem"
        disabled={disabled || isUnavailable}
        whileTap={{ scale: disabled || isUnavailable ? 1 : 0.9 }}
        className={`${className ?? ""} ${
          defaultLayout ?? "default"
        } button-card`}
        cssStyles={cssStyles}
        style={{
          ...(style ?? {}),
        }}
      >
        <StyledButtonCard
          {...longPressEvent}
          disabled={disabled || isUnavailable}
          layoutId={
            typeof _entity === "string"
              ? `${_entity}-${id ? `${id}-` : ""}button-card`
              : undefined
          }
          className={`${active ? "active " : ""}`}
          {...rest}
          onClick={onClickHandler}
        >
          <LayoutBetween
            className={`layout-between ${
              defaultLayout === "slim-vertical" ? "vertical" : ""
            }`}
          >
            <Fab
              brightness={
                (on && entity?.custom.brightness) || "brightness(100%)"
              }
              className={`fab-card-inner icon`}
              backgroundColor={on ? "var(--ha-S500)" : "var(--ha-S400)"}
              textColor={
                entity
                  ? on
                    ? entity.custom.rgbColor
                    : "var(--ha-S500-contrast)"
                  : on
                  ? "var(--ha-A400)"
                  : "var(--ha-S500-contrast)"
              }
            >
              {iconElement || entityIcon || domainIcon}
            </Fab>
            {isDefaultLayout && (
              <Toggle active={on} className="toggle">
                {!isUnavailable && (
                  <ToggleState active={on} className="toggle-state" />
                )}
              </Toggle>
            )}
            {isSlimLayout && (
              <Column
                fullWidth
                alignItems={
                  defaultLayout === "slim-vertical" ? "center" : "flex-start"
                }
              >
                <Description className="description">{description}</Description>
                {!hideDetails && (
                  <Title className={`title ${defaultLayout ?? ""}`}>
                    {title} {renderState()}
                    {entity && !hideLastUpdated
                      ? ` - ${entity.custom.relativeTime}`
                      : ""}
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
                    {isUnavailable && entity && !hideState
                      ? ` - ${entity.state}`
                      : ""}
                  </Title>
                )}
                {description && (
                  <Description className="description">
                    {description}
                  </Description>
                )}
                {!hideDetails && entity && !hideLastUpdated && (
                  <Title className="title">
                    Updated: {entity.custom.relativeTime}
                  </Title>
                )}
              </Title>
            </Footer>
          )}
          {children && <div className="children">{children}</div>}
        </StyledButtonCard>
      </StyledRipples>
      {typeof _entity === "string" && (
        <ModalByEntityDomain
          entity={_entity as EntityName}
          title={title ?? "Unknown title"}
          onClose={() => {
            setOpenModal(false);
          }}
          open={openModal}
          id={`${_entity}-${id ? `${id}-` : ""}button-card`}
        />
      )}
    </>
  );
}
/**
 * The ButtonCard component is an easy way to represent the state and control of an entity with a simple button, eventually I'll provide further options per domain, like being able to set the colours for lights etc...
 * Below are a few examples of layouts that the ButtonCard supports
 * */
export function ButtonCard<E extends EntityName>(props: ButtonCardProps<E>) {
  return (
    <ErrorBoundary {...fallback({ prefix: "ButtonCard" })}>
      <_ButtonCard {...props} />
    </ErrorBoundary>
  );
}
