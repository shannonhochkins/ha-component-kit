import { useCallback, useRef, useState } from "react";
import styled from "@emotion/styled";
import type { EntityName, ExtractDomain, HassEntityWithApi } from "@hakit/core";
import {
  useEntity,
  useIconByDomain,
  useIcon,
  useIconByEntity,
  computeDomain,
  isUnavailableState,
} from "@hakit/core";
import { ErrorBoundary } from "react-error-boundary";
import { Ripples, fallback } from "@components";
import { motion } from "framer-motion";
import { MotionProps } from "framer-motion";

const StyledTriggerCard = styled(motion.button)`
  all: unset;
  padding: 1rem;
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  width: var(--ha-device-scene-card-width);
  aspect-ratio: 2/0.74;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  cursor: pointer;
  background-color: var(--ha-S300);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: box-shadow, background-color;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.8;
  }
  &:not(:disabled):hover {
    background-color: var(--ha-S400);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  }
`;

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
  color: ${(props) =>
    !props.active ? "var(--ha-300)" : "var(--ha-300-contrast)"};
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
  transform: ${(props) =>
    props.active
      ? "translate3d(calc(-100% - 5px), 0, 0)"
      : "translate3d(calc(0% + 5px), 0, 0)"};
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
  background-color: ${(props) =>
    props.active ? "var(--ha-300)" : "var(--ha-S200)"};
  border-radius: 3rem;
  width: 10rem;
  height: 2.5rem;
  flex-grow: 0;
  flex-shrink: 0;
  transition: background-color var(--ha-transition-duration) var(--ha-easing);
  margin-left: 1.5rem;
  overflow: hidden;
`;

const LayoutBetween = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
`;

const Title = styled.div`
  color: var(--ha-text-2);
  font-size: 0.7rem;
`;
const Description = styled.div<{
  disabled?: boolean;
}>`
  color: var(--ha-text-1);
  ${(props) => props.disabled && `color: var(--ha-text-2);`}
  font-size: 0.9rem;
  span {
    display: block;
    width: 100%;
    color: var(--ha-text-2);
    margin-top: 0.3rem;
    line-height: 1rem;
    font-size: 0.7rem;
  }
`;
type Extendable = MotionProps &
  Omit<React.ComponentPropsWithoutRef<"button">, "title" | "onClick">;
export interface TriggerCardProps<E extends EntityName> extends Extendable {
  /** An optional override for the title */
  title?: string;
  /** an optional description to add to the card */
  description?: string;
  /** The name of your entity */
  entity: E;
  /** the onClick handler is called when the card is pressed  */
  onClick?: (entity: HassEntityWithApi<ExtractDomain<E>>) => void;
  /** optional override to replace the icon that appears in the card */
  icon?: string;
  /** optional override for the slider icon */
  sliderIcon?: string;
  /** override for the slider text when the state is active @default "Success..." */
  sliderTextActive?: string;
  /** override for the slider text when the state is active @default "Run {domain}" */
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
  sliderIcon: _sliderIcon,
  sliderTextActive,
  sliderTextInactive,
  activeStateDuration = 5000,
  hideArrow = false,
  ...rest
}: TriggerCardProps<E>): JSX.Element {
  const domain = computeDomain(_entity);
  const entity = useEntity(_entity);
  const entityIcon = useIconByEntity(_entity);
  const domainIcon = useIconByDomain(domain);
  const timeRef = useRef<NodeJS.Timeout | null>(null);
  const [active, setActive] = useState(false);
  const icon = useIcon(_icon ?? null);
  const sliderIcon = useIcon(_sliderIcon ?? null);
  const powerIcon = useIcon("mdi:power");
  const arrowIcon = useIcon("mingcute:arrows-right-line", {
    style: {
      fontSize: "16px",
    },
  });
  const isUnavailable = isUnavailableState(entity.state);
  const disabled = _disabled || isUnavailable;
  const useApiHandler = useCallback(() => {
    setActive(true);
    if (typeof onClick === "function" && !isUnavailable) onClick(entity);
    if (timeRef.current) clearTimeout(timeRef.current);
    timeRef.current = setTimeout(() => {
      setActive(false);
    }, activeStateDuration);
  }, [entity, onClick, activeStateDuration, isUnavailable]);

  return (
    <Ripples
      borderRadius="1rem"
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.9 }}
    >
      <StyledTriggerCard disabled={disabled} {...rest} onClick={useApiHandler}>
        <LayoutBetween>
          <Description disabled={disabled}>
            {title || entity.attributes.friendly_name || _entity}
            {description && <span>{description}</span>}
          </Description>
          {icon ?? entityIcon ?? domainIcon}
        </LayoutBetween>
        <Gap />
        <LayoutBetween>
          <Title>
            {entity.custom.relativeTime}
            {disabled ? ` - ${entity.state}` : ""}
          </Title>
          <Toggle active={disabled ? false : active}>
            {disabled ? null : (
              <>
                <ToggleState active={active}>
                  {sliderIcon ?? powerIcon}
                </ToggleState>
                <ToggleMessage hideArrow={hideArrow} active={active}>
                  {active
                    ? sliderTextActive ?? "Success..."
                    : sliderTextInactive ?? `Run ${domain}`}{" "}
                  {!active && !hideArrow && arrowIcon}
                </ToggleMessage>
              </>
            )}
          </Toggle>
        </LayoutBetween>
      </StyledTriggerCard>
    </Ripples>
  );
}
/** The TriggerCard is a simple to use component to make it easy to trigger and a scene, automation, script or any other entity to trigger. */
export function TriggerCard<E extends EntityName>(props: TriggerCardProps<E>) {
  return (
    <ErrorBoundary {...fallback({ prefix: "TriggerCard" })}>
      <_TriggerCard {...props} />
    </ErrorBoundary>
  );
}
