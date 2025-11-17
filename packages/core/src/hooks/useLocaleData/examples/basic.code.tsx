import { HassConnect, useLocaleData } from "@hakit/core";

export function Component() {
  const localeData = useLocaleData();
  return (
    <div>
      Home Assistant Language: {localeData?.language}, timezone: {localeData?.time_zone}
    </div>
  );
}

export function App() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <Component />
    </HassConnect>
  );
}
