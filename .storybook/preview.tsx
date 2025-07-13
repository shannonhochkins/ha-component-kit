import type { Preview } from "@storybook/react-vite";
import React from "react";
import { withThemeFromJSXProvider } from '@storybook/addon-themes';
import { ThemeProvider } from 'storybook/theming';
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
        // return aTitle.localeCompare(bTitle);
        const splitAndTakeFirst = (str) => str.split('/')[0];
        const stripGroup = (full, group) => full.replace(`${group}/`, '');

        const groupOrder = ['INTRODUCTION', 'EDITOR', 'COMPONENTS', 'HOOKS'];

        const aGroup = splitAndTakeFirst(a.title).toUpperCase();
        const bGroup = splitAndTakeFirst(b.title).toUpperCase();

        const aIdx = groupOrder.indexOf(aGroup);
        const bIdx = groupOrder.indexOf(bGroup);

        // if they’re in different top-level groups, respect custom order
        if (aIdx !== bIdx) {
          // put unknown groups at the end
          const ai = aIdx === -1 ? Infinity : aIdx;
          const bi = bIdx === -1 ? Infinity : bIdx;
          return ai - bi;
        }

        // same group: strip off the "HOOKS/" (or "COMPONENTS/", etc.) prefix
        const aName = stripGroup(a.title, aGroup);
        const bName = stripGroup(b.title, bGroup);

        // then just do a normal string compare
        return aName.localeCompare(bName);
      },
    },
    docs: {
      canvas: {
        sourceState: 'shown',
      },
      source: {
        dark: true,
        language: 'tsx',
        excludeDecorators: false,
        format: 'dedent',
      },
      page: Page
    }
  },
} satisfies Preview;
