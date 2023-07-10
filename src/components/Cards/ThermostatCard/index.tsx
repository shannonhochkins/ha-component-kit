import { useState, useEffect } from "react";
import { Thermostat } from "react-thermostat";
import type { ThermostatProps } from "react-thermostat";
import { useEntity, useApi } from "@hooks";
import { merge } from "lodash";
import { useDebouncedCallback } from "use-debounce";

export interface ThermostatCardProps
  extends Partial<Omit<ThermostatProps, "value" | "min" | "max" | "disabled">> {
  /** This uses all available props from https://www.npmjs.com/package/react-thermostat, except value, disabled, min and max are set automatically.  */
  entity: string;
}
const COLOURS = {
  off: ["#848484", "#383838"],
  cool: ["#dae8eb", "#2c8e98"],
  dry: ["#fff", "#ffc0bd"],
  fan_only: ["#fff", "#f9f9f9"],
  heat: ["#cfac48", "#cd5401"],
  heat_cool: ["#cfac48", "#cd5401"],
};

/** WIP - This is a wrapper for https://www.npmjs.com/package/react-thermostat, another react component i've built however this integrates seamlessly to home assistant via the entity id of the climate entity. */
export function ThermostatCard({
  entity: entityId,
  valueSuffix = "°",
  track = {},
  ...thermostatProps
}: ThermostatCardProps) {
  const entity = useEntity(entityId);
  const climateService = useApi("climate");
  const [value, setValue] = useState(entity.attributes.temperature);
  const state = entity.state as keyof typeof COLOURS;
  const isOff = state === "off";
  useEffect(() => {
    const interpretedValue = isOff
      ? entity.attributes.current_temperature
      : entity.attributes.temperature;
    if (value !== interpretedValue) {
      setValue(interpretedValue);
    }
  }, [
    value,
    entity.attributes.current_temperature,
    entity.attributes.temperature,
    isOff,
  ]);
  const debouncedHandler = useDebouncedCallback((temperature) => {
    climateService.setTemperature(entityId, {
      temperature,
    });
  }, 500);
  console.log("entity", valueSuffix, entity);
  return (
    <>
      <Thermostat
        {...thermostatProps}
        disabled={isOff}
        min={entity.attributes.min_temp}
        max={entity.attributes.max_temp}
        track={merge(
          {
            colors: COLOURS[state] || COLOURS.off,
          },
          track
        )}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          debouncedHandler(newValue);
        }}
      />
      <button
        onClick={() => {
          climateService.setHvacMode(entityId, {
            hvac_mode: state === "off" ? "heat" : "off",
          });
        }}
      >
        TOGGLE
      </button>
    </>
  );
}
