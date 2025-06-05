import { Story, Source } from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react-vite";
import mqHelperInput from './codeExamples/mqHelperInput.code?raw';
import mqHelperOutput from './codeExamples/mqHelperOutput.code?raw';
import { redirectToStory } from '../.storybook/redirect';

export default {
  title: "INTRODUCTION/Responsive Layouts/Media Query Helper",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `There's a helper method called \`mq\` which is available to use to help drive css values and connect back to the breakpoints provided by the ThemeProvider.`
      }
    },
    hidePrimary: true,
    hideComponentProps: true,
    afterPrimary: <>
      <Source dark code={mqHelperInput} />
      <p>As you can see with the example above, you provide the breakpoint name in the first param as an array of breakpoints, and the second value will be a CSS string which will be applied with this breakpoint.</p>
      <p>This function is actually quite simple and is designed to be used with styled component libraries, this will actually generate css like this:</p>
      <Source dark code={mqHelperOutput} />
      <p>See more about the available helper classes <a href="#" onClick={(e) => {
        e.preventDefault();
        redirectToStory('/docs/introduction-responsive-layouts-css-classes--docs');
      }}>here</a>.</p>
    </>
  },
} satisfies Meta;

export type Story = StoryObj;
export const Docs: Story = {
  args: {},
};

