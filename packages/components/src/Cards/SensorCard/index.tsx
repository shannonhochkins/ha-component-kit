import { ReactNode } from "react";
import styled from "@emotion/styled";
import type { EntityName, HistoryOptions } from "@hakit/core";
import { useEntity, useIconByDomain, useIcon, useIconByEntity, computeDomain, isUnavailableState } from "@hakit/core";
import { ErrorBoundary } from "react-error-boundary";
import { fallback, SvgGraph, Alert, AvailableQueries, CardBase, type CardBaseProps } from "@components";

const StyledSensorCard = styled(CardBase)`
  cursor: default;
  &.has-on-click {
    cursor: pointer;
  }
`;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
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

type OmitProperties = "title" | "as" | "active" | "ref" | "entity";
export interface SensorCardProps<E extends EntityName> extends Omit<CardBaseProps<"button", E>, OmitProperties> {
  /** the entity to display */
  entity: E;
  /** An optional override for the title */
  title?: ReactNode;
  /** an optional description to add to the card */
  description?: ReactNode;
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
  className,
  hideGraph,
  service,
  serviceData,
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
  const hasOnClick = typeof rest.onClick === "function";
  return (
    <StyledSensorCard
      as="button"
      disableActiveState
      title={title}
      // @ts-expect-error - don't know the entity name, so we can't know the service type
      service={service}
      // @ts-expect-error - don't know the entity name, so we can't know the service data
      serviceData={serviceData}
      entity={_entity}
      className={`sensor-card ${className ?? ""} ${hasOnClick ? "has-on-click" : ""}`}
      disabled={disabled}
      whileTap={{ scale: disabled || !hasOnClick ? 1 : 0.9 }}
      {...rest}
    >
      <Contents>
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
              <Alert className={"no-state-history"} description="No state history found." />
            )}
          </div>
        )}
      </Contents>
    </StyledSensorCard>
  );
}
/** The SensorCard is a component similar to the SensorCard from home assistant, currently it doesn't do anything other than display the graph of the recent history data for the entity if available. */
export function SensorCard<E extends EntityName>(props: SensorCardProps<E>) {
  const defaultColumns: AvailableQueries = {
    xxs: 12,
    xs: 6,
    sm: 6,
    md: 4,
    lg: 4,
    xlg: 3,
  };
  return (
    <ErrorBoundary {...fallback({ prefix: "SensorCard" })}>
      <_SensorCard {...defaultColumns} {...props} />
    </ErrorBoundary>
  );
}
