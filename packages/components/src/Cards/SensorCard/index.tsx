import styled from "@emotion/styled";
import type { EntityName } from "@hakit/core";
import { useHass } from "@hakit/core";
import { ErrorBoundary } from "react-error-boundary";
import { AvailableQueries } from "@components";
import { ButtonCard, type ButtonCardProps } from "../ButtonCard";
import { fallback } from "../../Shared/ErrorBoundary";

const StyledSensorCard = styled(ButtonCard)``;

type OmitProperties = "as" | "active" | "ref" | "entity";
export interface SensorCardProps<E extends EntityName> extends Omit<ButtonCardProps<E>, OmitProperties> {
  /** the entity to display */
  entity: E;
}

function _SensorCard<E extends EntityName>({
  entity: _entity,
  className,
  cssStyles,
  hideToggle = true,
  service,
  serviceData,
  ...rest
}: SensorCardProps<E>): React.ReactNode {
  const { useStore } = useHass();
  const globalComponentStyle = useStore((state) => state.globalComponentStyles);
  return (
    <StyledSensorCard
      disableActiveState
      hideToggle={hideToggle}
      // @ts-expect-error - don't know the entity name, so we can't know the service type
      service={service}
      // @ts-expect-error - don't know the entity name, so we can't know the service data
      serviceData={serviceData}
      graph={{
        entity: _entity,
        // content spacing is 1rem, so we offset it here by the same amount
        adjustGraphSpaceBy: "1rem",
      }}
      entity={_entity}
      className={`sensor-card ${className ?? ""}`}
      cssStyles={`
        ${globalComponentStyle?.sensorCard ?? ""}
        ${cssStyles ?? ""}
      `}
      {...rest}
    />
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
