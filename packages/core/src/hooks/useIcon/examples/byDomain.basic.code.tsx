import { HassConnect, useIconByDomain } from '@hakit/core';

export function IconExample() {
  const icon = useIconByDomain('light');
  return <div>{icon}</div>
}

export function App() {
  return <HassConnect hassUrl="https://homeassistant.local:8123">
    <IconExample />
  </HassConnect>;
}