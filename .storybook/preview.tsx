import type { Preview } from "@storybook/react";
import { Title, Description, Primary, ArgTypes } from "@storybook/blocks";
import React from "react";
import './global.css';

export default {
  decorators: [
    (Story, args) => {
      const centered = args.parameters.centered ? {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        padding: '1rem',
      } : {};
      if (window.parent) {
        const parentDocument = window.parent.document;
        const panel = parentDocument.getElementById('storybook-panel-root');
        if (args.parameters?.addons?.showPanel === false && panel !== null && panel.parentElement !== null) {
          panel.parentElement.style.display = 'none';
          if (panel.parentElement.parentElement?.previousElementSibling) {
            // @ts-ignore - it's correct.
            panel.parentElement.parentElement.previousElementSibling.style.width = '100%';
            // @ts-ignore - it's correct.
            panel.parentElement.parentElement.previousElementSibling.style.height = '100%';
          }
        } else if (panel !== null && panel.parentElement !== null) {
          panel.parentElement.style.display = 'flex';
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
        const splitAndTakeFirst = (str, delimiter) => str.split(delimiter)[0];
        const getOrderIndex = (order, item) => order.indexOf(item);
        const getNumericPrefix = (str) => parseInt(str.match(/\d+/)?.[0] || "-1", 10);
      
        const aTitle = splitAndTakeFirst(a.title, '/');
        const bTitle = splitAndTakeFirst(b.title, '/');
      
        const order = ['INTRODUCTION', 'HOOKS', 'COMPONENTS', 'ADVANCED'];
      
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

