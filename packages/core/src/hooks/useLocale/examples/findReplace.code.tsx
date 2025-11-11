import { HassConnect, localize, useCamera } from "@hakit/core";

export function MyComponent() {
  const camera = useCamera("camera.mycamera");
  return (
    <>
      {localize("messages.changed_to_state", {
        search: "{state}",
        replace: camera.state,
        fallback: "Camera is not available", // this will be used if \`changed_to_state\` is not available in the locales
      })}
    </>
  );
}

export function App() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <MyComponent />
    </HassConnect>
  );
}
