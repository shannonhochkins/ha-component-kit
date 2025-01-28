import { HassConnect, useEntity } from '@hakit/core';

function UseServiceExample() {
  const entity = useEntity('light.some_light_entity');
  return <button onClick={() => entity.service.toggle()} >TOGGLE LIGHT</button>
}

export function App() {
  return <HassConnect hassUrl="http://localhost:1234">
    <UseServiceExample />
  </HassConnect>
} 