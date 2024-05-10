import { WeatherCard, Row, type WeatherCardProps } from "@components";
import type { EntityName, FilterByDomain } from "@hakit/core";
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
