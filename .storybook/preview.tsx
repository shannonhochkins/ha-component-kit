import type { Preview } from "@storybook/react";
import { Title, Description, Primary, ArgTypes } from "@storybook/blocks";
import React from "react";
import { withThemeFromJSXProvider } from '@storybook/addon-themes'
import { GlobalStyles } from './theme';

export default {
  decorators: [
    withThemeFromJSXProvider({
      GlobalStyles,
    }),
    (Story, args) => {
      const centered = args.parameters.centered ? {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
      } : {};
      return <div id="storybook-inner-preview">
        <div style={{
          padding: args.parameters.padding ?? '2rem',
          width: args.parameters.width ?? 'calc(100% - 4rem)',
          height: args.parameters.height,
          ...centered,
        }}><Story /></div>
      </div>
    },
  ],

  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },    
    options: {
      storySort: (a, b) => {
        // Split the ID into parts on '/'
        const aSplit = a.title.split('/');
        const bSplit = b.title.split('/');

        // Get the top-level titles
        const aTopLevel = aSplit[0];
        const bTopLevel = bSplit[0];


        // Define the order
        const order = ['INTRODUCTION', 'HOOKS', 'COMPONENTS', 'ADVANCED'];

        // Compare the top-level titles based on the order array
        const aTopLevelOrder = order.indexOf(aTopLevel);
        const bTopLevelOrder = order.indexOf(bTopLevel);

        // If both stories are in the order array, compare based on the order array
        if (aTopLevelOrder !== -1 && bTopLevelOrder !== -1) {
          return aTopLevelOrder - bTopLevelOrder;
        }

        // If only one story is in the order array, put it first
        if (aTopLevelOrder !== -1) {
          return -1;
        }
        if (bTopLevelOrder !== -1) {
          return 1;
        }

        // If neither story is in the order array, compare alphabetically
        return aTopLevel.localeCompare(bTopLevel);
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

