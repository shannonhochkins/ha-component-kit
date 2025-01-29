import { ColorPicker, ThemeProvider, Column } from '@hakit/components';
import { HassConnect, isOffState, useEntity, useLightColor, hs2rgb } from '@hakit/core';

export function Dashboard() {
  const light = useEntity('light.fake_light_1');
  const { hs } = useLightColor(light);
  if (isOffState(light) || hs === undefined) {
    return <>
      Light must be on to calculate colors
    </>;
  }
  // convert the HS to RGB
  const rgb = hs2rgb(hs);
  return <Column gap="1rem">
    <Column gap="1rem" style={{
      background: `rgb(${rgb.join(',')})`,
      padding: '20px',
      color: 'black',
    }}>
      <span>HS: {hs.map(v => Math.round(v)).join(', ')}</span>
      <span>RGB: {rgb.map(v => Math.round(v)).join(', ')}</span>
    </Column>
    <ColorPicker entity="light.fake_light_1" />
  </Column>
}
export function App() {
  return <HassConnect hassUrl="http://homeassistant.local:8123">
    <ThemeProvider />
    <Dashboard />
  </HassConnect>
}