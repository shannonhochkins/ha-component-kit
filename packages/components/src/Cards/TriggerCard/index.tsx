import { useCallback, useRef, useState } from "react";
import styled from "@emotion/styled";
import type { EntityName } from "@hakit/core";
import {
  computeDomainTitle,
  useEntity,
  useHass,
  useIconByDomain,
  useIcon,
  useIconByEntity,
  computeDomain,
  isUnavailableState,
  localize,
} from "@hakit/core";
import { ErrorBoundary } from "react-error-boundary";
import { fallback, CardBase, type AvailableQueries, type CardBaseProps } from "@components";
import { IconProps } from "@iconify/react";

const StyledTriggerCard = styled(CardBase)``;

const ToggleMessage = styled.span<ToggleProps>`
  font-size: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding: 0 0.4rem 0 0.8rem;
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: justify-content, color;
  justify-content: ${(props) => (props.active ? `flex-start` : `flex-end`)};
  color: ${(props) => (!props.active ? "var(--ha-300)" : "var(--ha-300-contrast)")};
  ${(props) => props.hideArrow && `padding-right: 0.8rem;`}
`;

const ToggleState = styled.div<ToggleProps>`
  background-color: var(--ha-S200);
  border-radius: 100%;
  width: 1.9rem;
  height: 1.9rem;
  position: absolute;
  top: 5px;
  left: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: left, transform;
  left: ${(props) => (props.active ? "100%" : "0px")};
  transform: ${(props) => (props.active ? "translate3d(calc(-100% - 5px), 0, 0)" : "translate3d(calc(0% + 5px), 0, 0)")};
  svg {
    color: ${(props) => (props.active ? "var(--ha-A400)" : "var(--ha-200)")};
    font-size: 40px;
  }
`;

interface ToggleProps {
  active: boolean;
  hideArrow?: boolean;
}
const Gap = styled.div`
  height: 20px;
`;
const Toggle = styled.div<ToggleProps>`
  position: relative;
  background-color: ${(props) => (props.active ? "var(--ha-300)" : "var(--ha-S200)")};
  border-radius: 3rem;
  width: 10rem;
  height: 2.5rem;
  flex-grow: 0;
  flex-shrink: 0;
  transition: background-color var(--ha-transition-duration) var(--ha-easing);
  margin-left: 1.5rem;
  overflow: hidden;
`;

const Contents = styled.div`
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const LayoutBetween = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
`;

const Description = styled.div`
  color: var(--ha-S500-contrast);
  font-size: 0.7rem;
  text-align: left;
`;
const Title = styled.div<{
  disabled?: boolean;
}>`
  color: var(--ha-S300-contrast);
  font-size: 0.9rem;
  font-weight: bold;
  ${(props) => props.disabled && `color: var(--ha-S50-contrast);`}

  text-align: left;
  span {
    display: block;
    width: 100%;
    color: var(--ha-S50-contrast);
    margin-top: 0.3rem;
    line-height: 1rem;
    font-size: 0.7rem;
  }
`;

type OmitProperties = "as" | "ref" | "entity";
export interface TriggerCardProps<E extends EntityName> extends Omit<CardBaseProps<"button", E>, OmitProperties> {
  /** The name of your entity */
  entity: E;
  /** an optional description to add to the card */
  description?: string;
  /** optional override to replace the icon that appears in the card */
  icon?: string;
  /** the props for the icon, which includes styles for the icon */
  iconProps?: Omit<IconProps, "icon">;
  /** the props for the icon, which includes styles for the icon */
  sliderIconProps?: Omit<IconProps, "icon">;
  /** optional override for the slider icon */
  sliderIcon?: string;
  /** override for the slider text when the state is active */
  sliderTextActive?: string;
  /** override for the slider text when the state is inactive */
  sliderTextInactive?: string;
  /** how much time in milliseconds must pass before the active state reverts to it's default state @default 5000 */
  activeStateDuration?: number;
  /** display the arrow icon in the slider @default false */
  hideArrow?: boolean;
}

function _TriggerCard<E extends EntityName>({
  entity: _entity,
  title,
  description,
  onClick,
  disabled: _disabled,
  icon: _icon,
  iconProps,
  sliderIconProps,
  sliderIcon: _sliderIcon,
  sliderTextActive,
  sliderTextInactive,
  activeStateDuration = 5000,
  hideArrow = false,
  className,
  service,
  serviceData,
  key,
  cssStyles,
  ...rest
}: TriggerCardProps<E>): React.ReactNode {
  const { useStore } = useHass();
  const globalComponentStyle = useStore((state) => state.globalComponentStyles);
  const domain = computeDomain(_entity);
  const entity = useEntity(_entity);
  const entityIcon = useIconByEntity(_entity, iconProps);
  const domainIcon = useIconByDomain(domain, iconProps);
  const timeRef = useRef<NodeJS.Timeout | null>(null);
  const [active, setActive] = useState(false);
  const icon = useIcon(_icon ?? null, iconProps);
  const sliderIcon = useIcon(_sliderIcon ?? null, sliderIconProps);
  const powerIcon = useIcon("mdi:power", iconProps);
  const arrowIcon = useIcon("mingcute:arrows-right-line", {
    ...iconProps,
    style: {
      fontSize: "16px",
      ...iconProps?.style,
    },
  });
  const isUnavailable = isUnavailableState(entity.state);
  const disabled = _disabled || isUnavailable;
  const useApiHandler = useCallback(
    (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      setActive(true);
      if (typeof onClick === "function" && !isUnavailable) onClick(entity as never, event);
      if (timeRef.current) clearTimeout(timeRef.current);
      timeRef.current = setTimeout(() => {
        setActive(false);
      }, activeStateDuration);
    },
    [entity, onClick, activeStateDuration, isUnavailable],
  );

  return (
    <StyledTriggerCard
      key={key}
      as="button"
      className={`${className ?? ""} trigger-card`}
      disabled={disabled}
      entity={_entity}
      // @ts-expect-error - don't know the entity name, so we can't know the service type
      service={service}
      // @ts-expect-error - don't know the entity name, so we can't know the service data
      serviceData={serviceData}
      onClick={useApiHandler}
      cssStyles={`
        ${globalComponentStyle?.triggerCard ?? ""}
        ${cssStyles ?? ""}
      `}
      {...rest}
    >
      <Contents>
        <LayoutBetween className={`layout-between`}>
          <Title disabled={disabled} className={`description`}>
            {title || entity.attributes.friendly_name || _entity}
            {description && <span>{description}</span>}
          </Title>
          {icon ?? entityIcon ?? domainIcon}
        </LayoutBetween>
        <Gap className={`gap`} />
        <LayoutBetween className={`layout-between`}>
          <Description className={`title`}>
            {entity.custom.relativeTime}
            {disabled ? ` - ${entity.state}` : ""}
          </Description>
          <Toggle active={disabled ? false : active} className={`toggle`}>
            {disabled ? null : (
              <>
                <ToggleState active={active} className={`toggle-state`}>
                  {sliderIcon ?? powerIcon}
                </ToggleState>
                <ToggleMessage hideArrow={hideArrow} active={active} className={`toggle-message`}>
                  {active
                    ? sliderTextActive ??
                      localize("triggered_name", {
                        search: " {name}",
                        replace: "",
                      })
                    : sliderTextInactive ?? `${localize("run")} ${computeDomainTitle(_entity, entity?.attributes?.device_class)}`}{" "}
                  {!active && !hideArrow && arrowIcon}
                </ToggleMessage>
              </>
            )}
          </Toggle>
        </LayoutBetween>
      </Contents>
    </StyledTriggerCard>
  );
}
/** The TriggerCard is a simple to use component to make it easy to trigger and a scene, automation, script or any other entity to trigger. */
export function TriggerCard<E extends EntityName>(props: TriggerCardProps<E>) {
  const defaultColumns: AvailableQueries = {
    xxs: 12,
    xs: 6,
    sm: 6,
    md: 4,
    lg: 4,
    xlg: 3,
  };
  return (
    <ErrorBoundary {...fallback({ prefix: "TriggerCard" })}>
      <_TriggerCard {...defaultColumns} {...props} />
    </ErrorBoundary>
  );
}
