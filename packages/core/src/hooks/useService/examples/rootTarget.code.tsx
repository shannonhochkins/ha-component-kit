import { HassConnect, useService } from "@hakit/core";
function UseServiceExample() {
  const lightService = useService("light", "light.some_light_entity");
  return <button onClick={() => lightService.toggle()}>TOGGLE LIGHT</button>;
}
export function App() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <UseServiceExample />
    </HassConnect>
  );
}
