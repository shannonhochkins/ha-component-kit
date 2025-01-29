import { HassConnect, useService } from "@hakit/core";
function UseServiceExample() {
  const lightService = useService("light");
  return (
    <button
      onClick={() =>
        lightService.toggle({
          target: "light.some_light_entity",
        })
      }
    >
      TOGGLE LIGHT
    </button>
  );
}
export function App() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <UseServiceExample />
    </HassConnect>
  );
}
