import { HassConnect, useWeather } from "@hakit/core";

function Dashboard() {
  const weatherEntity = useWeather("weather.weather_entity");
  // can now access all properties relating to the weather for this entity.
  return <div>{JSON.stringify(weatherEntity.forecast, null, 2)}</div>;
}
export function App() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <Dashboard />
    </HassConnect>
  );
}
