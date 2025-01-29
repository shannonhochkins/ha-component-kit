import { HassConnect, isOffState, useEntity, useLightTemperature, temperature2rgb } from "@hakit/core";
import { Column, ColorTempPicker, ThemeProvider } from "@hakit/components";

export function Dashboard() {
  const light = useEntity("light.fake_light_2");
  const temperature = useLightTemperature(light);
  if (isOffState(light) || temperature === undefined) {
    return <>Light must be on to calculate temperature</>;
  }
  // convert the temperature to RGB
  const rgb = temperature2rgb(temperature);
  return (
    <Column gap="1rem">
      <Column
        gap="1rem"
        style={{
          background: `rgb(${rgb.join(",")})`,
          padding: "20px",
          color: "black",
        }}
      >
        <span>Kelvin: {temperature}</span>
        <span>RGB: {rgb.map((v) => Math.round(v)).join(", ")}</span>
      </Column>
      <ColorTempPicker entity="light.fake_light_2" />
    </Column>
  );
}

export function App() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <ThemeProvider />
      <Dashboard />
    </HassConnect>
  );
}
