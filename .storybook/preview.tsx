import type { Preview } from "@storybook/react";
import React from "react";
import { withThemeFromJSXProvider } from '@storybook/addon-themes';
import { ThemeProvider } from '@storybook/theming';
import { Page } from "./page";
import { redirectToStory } from './redirect';
import './global.css';


const theme = {
  typography: {
    fonts: {
      base: 'Arial, sans-serif',
      mono: 'Courier, monospace'
    }
  }
};



export default {
  tags: ['autodocs'],
  decorators: [
    withThemeFromJSXProvider({
      themes: {
        dark: theme,
        light: theme,
      },
      defaultTheme: 'dark',
      Provider: ThemeProvider,
    }),
    (Story, args) => {
      // sometimes, you might want to have one story listed in two places, storybook doesn't handle this
      // so we redirect from one story to another
      if (args.parameters.redirectTo) {
        if (window.top) {
          redirectToStory(args.parameters.redirectTo);
        }
      }
      const centered = args.parameters.centered ? {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        padding: '1rem',
      } : {};
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
        }}>
          <Story />
        </div></div>
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
    addons: {
      showPanel: false,
      showTabs: false,
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
      canvas: {
        sourceState: 'shown',
      },
      page: Page
    }
  },
} satisfies Preview;
