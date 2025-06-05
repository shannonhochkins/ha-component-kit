import { Story, Source } from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { redirectToStory } from '../.storybook/redirect';
import breakpointExample from './codeExamples/breakpointExample.code?raw';
import { DEFAULT_BREAKPOINTS, getBreakpoints } from "@components";

export default {
  title: "INTRODUCTION/Responsive Layouts/Breakpoints",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `You can customize the default breakpoints using the ThemeProvider.`
      }
    },
    hidePrimary: true,
    hideComponentProps: true,
    afterPrimary: <>
      <Source dark code={breakpointExample} />
      <p>The values provided above are the defaults, they should range from smallest to largest and they represent the screen width not the container size.</p>
      <p>If you screen size is 1600px wide, by default the `md` breakpoint will be active, and all cards with an `md` prop provided (or the default values) will be activated and used to determine the size of the cards.</p>
      <p>Also, with the hook <a href="" onClick={(e) => {
          e.preventDefault();
          redirectToStory('/docs/components-hooks-usebreakpoint--docs');
        }}>useBreakpoint</a>, the .md property will be true.</p>
      <p>The breakpoint settings above, translate to the following auto generated media queries:</p>
      <Source dark code={JSON.stringify(getBreakpoints(DEFAULT_BREAKPOINTS), null, 2)} />
      <h2>Custom Breakpoints</h2>
      <p>You can also omit certain breakpoints from the ThemeProvider, meaning you can disable some of the more granular breakpoints if need be, see <a href="#" onClick={(e) => {
          e.preventDefault();
          redirectToStory('/story/components-hooks-usebreakpoint--custom-breakpoints');
        }}>Custom Breakpoints</a> for more information</p>
    </>
  },
} satisfies Meta;

export type Story = StoryObj;
export const Docs: Story = {
  args: {},
};

