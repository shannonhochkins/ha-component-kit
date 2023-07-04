import type { Preview } from "@storybook/react";
import { Title, Description, Primary, ArgTypes } from "@storybook/blocks";
import React from "react";
import { withThemeFromJSXProvider } from '@storybook/addon-styling';
import { Global, css } from '@emotion/react';

const GlobalStyles = () => (
  <Global
    styles={css`
      .docs-story {
        background-color: var(--ha-background);
        font-family: var(--ha-font-family);
        font-size: var(--ha-font-size);
        color: var(--ha-color);
      }
    `}
  />
);

export default {
  decorators: [
    (Story) => {
      return <div style={{
          padding: '2rem'
        }}>
        <Story />
      </div>
    },
    withThemeFromJSXProvider({
      GlobalStyles, // Adds your GlobalStyles component to all stories
    }),
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

