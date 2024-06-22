import type { EntityName, FilterByDomain } from "@hakit/core";
import { WeatherCard, type WeatherCardProps } from "../../../../Cards/WeatherCard";
import { Row } from "../../../Row";
export interface ModalWeatherControlsProps extends Omit<WeatherCardProps, "onClick"> {
  entity: FilterByDomain<EntityName, "weather">;
}

export function ModalWeatherControls({ entity, ...props }: ModalWeatherControlsProps) {
  return (
    <Row fullWidth>
      <WeatherCard entity={entity} {...props} disableScale disableRipples disableActiveState disableColumns />
    </Row>
  );
}
export default ModalWeatherControls;
