import { create } from '@storybook/theming/create';

const theme = create({
    base: 'dark',
    brandUrl: 'https://www.npmjs.com/package/@hakit/core',
    brandImage: process.env.NODE_ENV === 'production' ? '/ha-component-kit/logo.png' : '/logo.png',
    brandTarget: '_self',
    appBg: '#0e1118'
});

import { addons } from '@storybook/manager-api';

addons.setConfig({
    panelPosition: 'right',
    showPanel: true,
    showNav: true,
    theme
});
const layout = localStorage.getItem('storybook-layout');
if (layout) {
  let storybookConfig = JSON.parse(layout);
  if (typeof storybookConfig === 'object' && storybookConfig !== null && storybookConfig.resizerNav.x < 320) {
    storybookConfig.resizerNav.x = 320;
    localStorage.setItem('storybook-layout', JSON.stringify(storybookConfig));
    document.location.reload();
  }
} else {
  localStorage.setItem('storybook-layout', JSON.stringify({ resizerNav: { x: 320, y: 0 }, resizerPanel: { x: 0, y: 710 } }));
  document.location.reload();
}


