import { useHass, HassConnect } from "@hakit/core";

export function SomeComponent() {
  const { joinHassUrl } = useHass();
  const url = joinHassUrl("/something");
  return <p>{url}</p>; // expected output: 'https://homeassistant.local:8123/something'
}

export function App() {
  return (
    <HassConnect hassUrl="https://homeassistant.local:8123">
      <SomeComponent />
    </HassConnect>
  );
}
