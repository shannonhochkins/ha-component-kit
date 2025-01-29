import { HassConnect, useEntity, useLightBrightness } from '@hakit/core';
import { Column, LightControls } from '@hakit/components';

export function Dashboard() {
  const light = useEntity('light.fake_light_1');

  const brightness = useLightBrightness(light);
  // can now access all properties relating to the weather for this entity.
  return <Column gap="1rem">
    <Column gap="1rem" style={{
      background: light.custom.rgbColor,
      padding: '20px',
      color: 'black',
      filter: `brightness(${brightness}%)`
    }}>
      <span>Brightness: {brightness}</span>
    </Column>
    <LightControls entity='light.fake_light_1' />
  </Column>
}
export function App() {
  return <HassConnect hassUrl="http://homeassistant.local:8123">
    <Dashboard />
  </HassConnect>
}