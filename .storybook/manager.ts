import { create } from '@storybook/theming/create';
// import logo from './logo.png';

const theme = create({
    base: 'light',
    fontBase: '"Public Sans", sans-serif',
    brandTitle: 'HA Component Kit',
    brandUrl: 'https://www.npmjs.com/package/ha-component-kit',
    // brandImage: logo,
    brandTarget: '_self'
});

import { addons } from '@storybook/manager-api';

addons.setConfig({
    panelPosition: 'right',
    theme
});
