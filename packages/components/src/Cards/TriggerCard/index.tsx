import { useCallback } from "react";
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
  background-color: var(--ha-primary-background);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: box-shadow, background-color;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.8;
  }
  &:(:disabled):hover {
    background-color: var(--ha-primary-background-hover);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  }
`;

const ToggleMessage = styled.span<ToggleProps>`
  font-size: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding: 0 6px 0 8px;
  transition: var(--ha-transition-duration) var(--ha-easing);
  transition-property: justify-content, color;
  justify-content: ${(props) => (props.active ? `flex-start` : `flex-end`)};
  color: ${(props) =>
    !props.active ? "var(--ha-secondary-color)" : "var(--ha-primary-inactive)"};
`;

const ToggleState = styled.div<ToggleProps>`
  background-color: white;
  border-radius: 100%;
  width: 30px;
  height: 30px;
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
    color: ${(props) =>
      props.active ? "var(--ha-primary-active)" : "var(--ha-primary-inactive)"};
    font-size: 40px;
  }
`;

interface ToggleProps {
  active: boolean;
}
const Gap = styled.div`
  height: 20px;
`;
const Toggle = styled.div<ToggleProps>`
  position: relative;
  background-color: ${(props) =>
    props.active ? "var(--ha-primary-active)" : "var(--ha-secondary-inactive)"};
  border-radius: 30px;
  width: 120px;
  height: 40px;
  flex-grow: 0;
  flex-shrink: 0;
  transition: background-color var(--ha-transition-duration) var(--ha-easing);
  margin-left: 20px;
  overflow: hidden;
`;

const LayoutBetween = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
`;

const Title = styled.div`
  color: var(--ha-secondary-color);
  font-size: 0.7rem;
`;
const Description = styled.div<{
  disabled?: boolean;
}>`
  color: var(--ha-primary-active);
  ${(props) => props.disabled && `color: var(--ha-secondary-color);`}
  font-size: 0.9rem;
`;
type Extendable = MotionProps &
  Omit<React.ComponentPropsWithoutRef<"button">, "title" | "onClick">;
export interface TriggerCardProps<E extends EntityName> extends Extendable {
  /** An optional override for the title */
  title?: string;
  /** The name of your entity */
  entity: E;
  /** the onClick handler is called when the card is pressed  */
  onClick?: (entity: HassEntityWithApi<ExtractDomain<E>>) => void;
}

/** The TriggerCard is a simple to use component to make it easy to trigger and a scene, automation, script or any other entity to trigger. */
function _TriggerCard<E extends EntityName>({
  entity: _entity,
  title,
  onClick,
  disabled: _disabled,
  ...rest
}: TriggerCardProps<E>): JSX.Element {
  const domain = computeDomain(_entity);
  const entity = useEntity(_entity);
  const entityIcon = useIconByEntity(_entity);
  const domainIcon = useIconByDomain(domain);
  const powerIcon = useIcon("mdi:power");
  const arrowIcon = useIcon("mingcute:arrows-right-line", {
    style: {
      fontSize: "16px",
    },
  });
  const isUnavailable = isUnavailableState(entity.state);
  const disabled = _disabled || isUnavailable;
  const useApiHandler = useCallback(() => {
    if (typeof onClick === "function" && !isUnavailable) onClick(entity);
  }, [entity, onClick, isUnavailable]);

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
          </Description>
          {entityIcon || domainIcon}
        </LayoutBetween>
        <Gap />
        <LayoutBetween>
          <Title>
            {entity.custom.relativeTime}
            {disabled ? ` - ${entity.state}` : ""}
          </Title>
          <Toggle active={disabled ? false : entity.custom.active}>
            {disabled ? null : (
              <>
                <ToggleState active={entity.custom.active}>
                  {powerIcon}
                </ToggleState>
                <ToggleMessage active={entity.custom.active}>
                  {entity.custom.active ? "Success..." : `Start ${domain}`}{" "}
                  {!entity.custom.active && arrowIcon}
                </ToggleMessage>
              </>
            )}
          </Toggle>
        </LayoutBetween>
      </StyledTriggerCard>
    </Ripples>
  );
}

export function TriggerCard<E extends EntityName>(props: TriggerCardProps<E>) {
  return (
    <ErrorBoundary {...fallback({ prefix: "TriggerCard" })}>
      <_TriggerCard {...props} />
    </ErrorBoundary>
  );
}
