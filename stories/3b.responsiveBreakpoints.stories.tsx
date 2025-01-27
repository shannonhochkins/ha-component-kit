import { Story, Source } from "@storybook/blocks";
import type { Meta, StoryObj } from "@storybook/react";
// @ts-expect-error - Ignore this, project structure screws vite environnement from here.
import breakpointExample from './codeExamples/breakpointExample.code?raw';

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
      <p>Also, with the hook <a href="/?path=/docs/components-hooks-usebreakpoint--docs">useBreakpoint</a>, the .md property will be true.</p>
      <p>The breakpoint settings above, translate to the following auto generated media queries:</p>
      <Source dark code={`
export const getBreakpoints = (breakpoints: BreakPoints): Record<BreakPoint, string> => {
  const { xxs, xs, sm, md, lg } = breakpoints;
  return {
    xxs: \`(max-width: $\{xxs}px)\`,
    xs: \`(min-width: $\{xxs + 1}px) and (max-width: $\{xs}px)\`,
    sm: \`(min-width: $\{xs + 1}px) and (max-width: $\{sm}px)\`,
    md: \`(min-width: $\{sm + 1}px) and (max-width: $\{md}px)\`,
    lg: \`(min-width: $\{md + 1}px) and (max-width: $\{lg}px)\`,
    xlg: \`(min-width: $\{lg + 1}px)\`,
  };
};
`} />
    </>
  },
} satisfies Meta;

export type Story = StoryObj;
export const Docs: Story = {
  args: {},
};

