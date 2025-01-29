import { useLocales, HassConnect } from "@hakit/core";

export function MyComponent() {
  const locales = useLocales();
  return <>{Object.keys(locales).join(", ")}</>;
}

export function App() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <MyComponent />
    </HassConnect>
  );
}
