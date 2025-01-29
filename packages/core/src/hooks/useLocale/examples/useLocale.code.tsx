// usage with the localize function
import { useLocale, LocaleKeys, HassConnect } from "@hakit/core";

export function MyComponent() {
  const value = useLocale("{{selectedKey}}" as LocaleKeys);
  return <>{value}</>; // should translate to "{{value}}"
}

export function App() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <MyComponent />
    </HassConnect>
  );
}
