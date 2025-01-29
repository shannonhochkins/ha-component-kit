import { HassConnect, useService } from '@hakit/core';
function UseServiceExample() {
  const api = useService();
  return (
   <>
    <button onClick={() => api('light').toggle({
        target: 'light.some_light_entity',
      })}>TOGGLE LIGHT</button>
      <button onClick={() => api('switch').toggle({
        target: 'switch.some_switch_entity'
      })}>TOGGLE SWITCH</button>
   </>
  );
}

export function App() {
  return <HassConnect hassUrl="http://homeassistant.local:8123">
    <UseServiceExample />
  </HassConnect>
}