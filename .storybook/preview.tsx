import type { Preview } from "@storybook/react";
import { Title, Description, Primary, ArgTypes } from "@storybook/blocks";
import React from "react";
import { withThemeFromJSXProvider } from '@storybook/addon-themes';
import { ThemeProvider } from '@storybook/theming';
import './global.css';

const THEME = {
  typography: {
    fonts: {
      base: 'Arial, sans-serif',
      mono: 'Courier, monospace'
    }
  }
};

export default {
  decorators: [
    withThemeFromJSXProvider({
      themes: {
        dark: THEME,
        light: THEME,
      },
      defaultTheme: 'dark',
      Provider: ThemeProvider,
    }),
    (Story, args) => {
      const centered = args.parameters.centered ? {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        padding: '1rem',
      } : {};
      if (window.parent) {
        const parentDocument = window.parent.document;
        const logo = parentDocument.querySelector('.sidebar-header div img') as HTMLElement;
        if (logo) {
          logo.style.maxWidth = '100%';
        }
        const panel = parentDocument.getElementById('storybook-panel-root');
        const shouldHidePanel = args.parameters?.addons?.showPanel === false;
        if (shouldHidePanel && panel !== null && panel.parentElement !== null) {
          panel.parentElement.style.display = 'none';
        } else if (panel !== null && panel.parentElement !== null) {
          panel.parentElement.style.display = 'flex';
        }
        const previewer = parentDocument.querySelector('#root div div:has(main)') as HTMLElement;
        if (previewer !== null && shouldHidePanel) {
          const rootDiv = parentDocument.querySelector('#root > div') as HTMLElement;
          if (rootDiv !== null) {
            rootDiv.style.display = 'flex';  
            rootDiv.style.flexDirection = 'row-reverse';
            rootDiv.style.flexWrap = 'nowrap';
            const sidebarContainer = parentDocument.querySelector('#root > div > div:has(.sidebar-container)') as HTMLElement;
            if (sidebarContainer) {
              sidebarContainer.style.width = '300px';
            }
          }
          previewer.style.height = '100dvh';
          previewer.style.width = '100%';
        } else {
          // remove the width/height inline styles
          previewer?.removeAttribute('style');
        }
      }
      if (args.parameters.standalone) {
        return <Story />;
      }
      return <div id="storybook-inner-preview">
        <div style={{
          padding: args.parameters.padding ?? '2rem',
          width: args.parameters.width ?? '100%',
          height: args.parameters.height,
          ...centered,
        }}><div style={{
          width: args.parameters.fillWidth || args.parameters.fullWidth ? '100%' : undefined,
          height: args.parameters.fillHeight ? '100%' : undefined,
        }}><Story /></div></div>
      </div>
    },
  ],

  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },    
    options: {
      storySort: (a, b) => {
        const splitAndTakeFirst = (str, delimiter) => str.split(delimiter)[0];
        const getOrderIndex = (order, item) => order.indexOf(item);
        const getNumericPrefix = (str) => parseInt(str.match(/\d+/)?.[0] || "-1", 10);
      
        const aTitle = splitAndTakeFirst(a.title, '/');
        const bTitle = splitAndTakeFirst(b.title, '/');
      
        const order = ['INTRODUCTION', 'COMPONENTS', 'HOOKS', 'ADVANCED'];
      
        const aOrderIndex = getOrderIndex(order, aTitle);
        const bOrderIndex = getOrderIndex(order, bTitle);
      
        if (aOrderIndex !== -1 && bOrderIndex !== -1) {
          if (aOrderIndex === bOrderIndex) {
            // Both have the same top-level title. Sort based on the numeric prefix in importPath.
            const aNumericPrefix = getNumericPrefix(a.importPath);
            const bNumericPrefix = getNumericPrefix(b.importPath);
            return aNumericPrefix - bNumericPrefix;
          }
          return aOrderIndex - bOrderIndex;
        }
      
        if (aOrderIndex !== -1) return -1;
        if (bOrderIndex !== -1) return 1;
      
        return aTitle.localeCompare(bTitle);
      },
    },
    docs: {
      page: () => (<>
        <Title />
        <Description />
        <Primary />
        <h2>Component Props</h2>
        <ArgTypes />
      </>),
    }
  },
} satisfies Preview;

