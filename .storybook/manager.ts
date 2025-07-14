import { create } from 'storybook/theming/create';
import { addons } from 'storybook/manager-api';

const theme = create({
    base: 'dark',
    brandUrl: 'https://www.npmjs.com/package/@hakit/core',
    brandImage: process.env.NODE_ENV === 'production' ? '/ha-component-kit/logo.png' : '/logo.png',
    brandTarget: '_self',
    appBg: '#0e1118',
});

addons.setConfig({
    bottomPanelHeight: 0,
    rightPanelWidth: 0,
    theme,
    sidebar: {
      renderLabel(item) {
        if (item.type === 'root' && item.name.toLowerCase() === 'core') {
          return '@hakit/core';
        }
        if (item.type === 'root' && item.name.toLowerCase() === 'components') {
          return '@hakit/components';
        }
        if (item.type === 'root' && item.name.toLowerCase() === 'editor') {
          return '@hakit/editor';
        }
        return item.name;
      }
    }
    
});


const context = window.parent ? window.parent.document : document;
const stylesheet = context.createElement('style');
stylesheet.innerHTML = `
  .sidebar-header div img {
    max-width: 100% !important
  }
`;
context.head.appendChild(stylesheet);
