import styled from "@emotion/styled";
import type { EntityName } from "@hakit/core";
import {
  useEntity,
  useIconByDomain,
  useIcon,
  useIconByEntity,
  computeDomain,
  isUnavailableState,
} from "@hakit/core";
import { ErrorBoundary } from "react-error-boundary";
import { Ripples, fallback, SvgGraph } from "@components";
import { motion } from "framer-motion";
import { MotionProps } from "framer-motion";
import { HistoryOptions } from "packages/core/src/hooks/useHistory";

const StyledSensorCard = styled(motion.button)`
  all: unset;
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  width: var(--ha-device-scene-card-width);
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

const Inner = styled.div`
  width: 100%;
  padding: 1rem;
`;

const Gap = styled.div`
  height: 20px;
`;

const LayoutBetween = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
`;

const Title = styled.div`
  color: var(--ha-S500-contrast);
  font-size: 0.7rem;
`;
const Description = styled.div<{
  disabled?: boolean;
}>`
  color: var(--ha-S500-contrast);
  ${(props) => props.disabled && `color: var(--ha-S50-contrast);`}
  font-size: 0.9rem;
  span {
    display: block;
    width: 100%;
    color: var(--ha-S50-contrast);
    margin-top: 0.3rem;
    line-height: 1rem;
    font-size: 0.7rem;
  }
`;
type Extendable = MotionProps &
  Omit<React.ComponentPropsWithoutRef<"button">, "title" | "onClick">;
export interface SensorCardProps<E extends EntityName> extends Extendable {
  /** An optional override for the title */
  title?: string;
  /** an optional description to add to the card */
  description?: string;
  /** The name of your entity */
  entity: E;
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
  /** options to pass to the history request */
  historyOptions?: HistoryOptions;
}

function _SensorCard<E extends EntityName>({
  entity: _entity,
  title,
  description,
  disabled: _disabled,
  icon: _icon,
  historyOptions,
  ...rest
}: SensorCardProps<E>): JSX.Element {
  const domain = computeDomain(_entity);
  const entity = useEntity(_entity, {
    historyOptions: historyOptions
  });
  console.log('entity', entity);
  const entityIcon = useIconByEntity(_entity);
  const domainIcon = useIconByDomain(domain);
  const icon = useIcon(_icon ?? null);
  const isUnavailable = isUnavailableState(entity.state);
  const disabled = _disabled || isUnavailable;

  return (
    <Ripples
      borderRadius="1rem"
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.9 }}
    >
      <StyledSensorCard
        disabled={disabled}
        {...rest}
        onClick={() => {
          console.log("test");
        }}
      >
        <Inner>
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
          </LayoutBetween>
        </Inner>
        <div><SvgGraph coordinates={entity.history.coordinates} /></div>
      </StyledSensorCard>
    </Ripples>
  );
}
/** The SensorCard is a simple to use component to make it easy to trigger and a scene, automation, script or any other entity to trigger. */
export function SensorCard<E extends EntityName>(props: SensorCardProps<E>) {
  return (
    <ErrorBoundary {...fallback({ prefix: "SensorCard" })}>
      <_SensorCard {...props} />
    </ErrorBoundary>
  );
}
