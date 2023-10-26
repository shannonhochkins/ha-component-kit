import { ReactNode, useCallback } from "react";
import styled from "@emotion/styled";
import type {
  EntityName,
  HassEntityWithApi,
  ExtractDomain,
  HistoryOptions,
} from "@hakit/core";
import {
  useEntity,
  useIconByDomain,
  useIcon,
  useIconByEntity,
  computeDomain,
  isUnavailableState,
} from "@hakit/core";
import { ErrorBoundary } from "react-error-boundary";
import { Ripples, fallback, SvgGraph, Alert, mq } from "@components";
import { motion } from "framer-motion";
import { MotionProps } from "framer-motion";

const StyledSensorCard = styled(motion.button)`
  all: unset;
  position: relative;
  overflow: hidden;
  padding: 0;
  border-radius: 1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  &.has-on-click {
    cursor: pointer;
  }
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

const StyledRipples = styled(Ripples)`
  flex-shrink: 1;
  ${mq(
    ["mobile"],
    `
    width: 100%;
  `,
  )}
  ${mq(
    ["tablet", "smallScreen"],
    `
    width: calc(50% - var(--gap, 0rem) / 2);
  `,
  )}
  ${mq(
    ["desktop", "mediumScreen"],
    `
    width: calc(((100% - 2 * var(--gap, 0rem)) / 3));
  `,
  )}
  ${mq(
    ["largeDesktop"],
    `
    width: calc(((100% - 3 * var(--gap, 0rem)) / 4));
  `,
  )}
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
const State = styled.div`
  color: var(--ha-S500-contrast);
  font-size: 0.9rem;
  font-weight: bold;
  margin-top: 0.5rem;
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
  title?: ReactNode;
  /** an optional description to add to the card */
  description?: ReactNode;
  /** The name of your entity */
  entity: E;
  /** the onClick handler is called when the card is pressed  */
  onClick?: (entity: HassEntityWithApi<ExtractDomain<E>>) => void;
  /** optional override to replace the icon that appears in the card */
  icon?: string;
  /** override the unit displayed alongside the state */
  unit?: ReactNode;
  /** options to pass to the history request */
  historyOptions?: HistoryOptions;
  /** hide the graph on the card */
  hideGraph?: boolean;
}

function _SensorCard<E extends EntityName>({
  entity: _entity,
  title,
  description,
  disabled: _disabled,
  icon: _icon,
  historyOptions,
  unit,
  onClick,
  cssStyles,
  className,
  id,
  hideGraph,
  ...rest
}: SensorCardProps<E>): JSX.Element {
  const domain = computeDomain(_entity);
  const entity = useEntity(_entity, {
    historyOptions: {
      disable: false,
      ...historyOptions,
    },
  });
  const entityIcon = useIconByEntity(_entity);
  const domainIcon = useIconByDomain(domain);
  const icon = useIcon(_icon ?? null);
  const isUnavailable = isUnavailableState(entity.state);
  const disabled = _disabled || isUnavailable;
  const hasOnClick = typeof onClick === "function";
  const useApiHandler = useCallback(() => {
    if (typeof onClick === "function" && !isUnavailable) onClick(entity);
  }, [entity, onClick, isUnavailable]);
  return (
    <StyledRipples
      cssStyles={cssStyles}
      id={id ?? ""}
      className={`${className ?? ""} sensor-card`}
      borderRadius="1rem"
      disabled={disabled || !hasOnClick}
      whileTap={{ scale: disabled || !hasOnClick ? 1 : 0.9 }}
    >
      <StyledSensorCard
        className={`wrapper ${hasOnClick ? "has-on-click" : ""}`}
        disabled={disabled}
        {...rest}
        onClick={useApiHandler}
      >
        <Inner className={"inner"}>
          <LayoutBetween className={"layout-between"}>
            <Description disabled={disabled} className={"description"}>
              {title || entity.attributes.friendly_name || _entity}
              {entity.state && (
                <State className={"state"}>
                  {entity.state}
                  {unit ?? entity.attributes.unit_of_measurement ?? ""}
                </State>
              )}
              {description && <span className={"text"}>{description}</span>}
            </Description>
            {icon ?? entityIcon ?? domainIcon}
          </LayoutBetween>
          <Gap className={"gap"} />
          <LayoutBetween className={"layout-between"}>
            <Title className={"title"}>
              {entity.custom.relativeTime}
              {disabled ? ` - ${entity.state}` : ""}
            </Title>
          </LayoutBetween>
        </Inner>
        {!hideGraph && (
          <div className={"history"}>
            {entity.history.loading ? (
              <Alert className={"loading"} description="Loading..." />
            ) : entity.history.coordinates.length > 0 ? (
              <SvgGraph coordinates={entity.history.coordinates} />
            ) : (
              <Alert
                className={"no-state-history"}
                description="No state history found."
              />
            )}
          </div>
        )}
      </StyledSensorCard>
    </StyledRipples>
  );
}
/** The SensorCard is a component similar to the SensorCard from home assistant, currently it doesn't do anything other than display the graph of the recent history data for the entity if available. */
export function SensorCard<E extends EntityName>(props: SensorCardProps<E>) {
  return (
    <ErrorBoundary {...fallback({ prefix: "SensorCard" })}>
      <_SensorCard {...props} />
    </ErrorBoundary>
  );
}
