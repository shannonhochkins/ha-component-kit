import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
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
        const order = ['INTRODUCTION', 'HOOKS', 'COMPONENTS'];

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
    }
  },
};

export default preview;
