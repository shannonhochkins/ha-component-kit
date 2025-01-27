import type { Meta, StoryObj } from "@storybook/react";
import { Story, Source, Title, Description } from "@storybook/blocks";
import { ThemeProvider, useBreakpoint } from "@components";
import { HassConnect } from "@hass-connect-fake";
import jsxToString from "react-element-to-jsx-string";

function Wrapper() {
  return <HassConnect hassUrl="http://localhost:8123">
    <ThemeProvider />
    <ExampleUsage />
  </HassConnect>
}

function ExampleUsage() {
  const bp = useBreakpoint();
  return (
    <div>
      {bp.xxs && <p>Extra small Screen</p>}
      {bp.xs && <p>Small Screen</p>}
      {bp.sm && <p>Medium Screen</p>}
      {bp.md && <p>Large Screen</p>}
      {bp.lg && <p>Extra large Screen</p>}
    </div>
  );
}

const str = `
function ExampleUsage() {
  const bp = useBreakpoint();
  return (
    <div>
      {bp.xxs && <p>Extra small Screen Size</p>}
      {bp.xs && <p>Small Screen Size</p>}
      {bp.sm && <p>Medium Screen Size</p>}
      {bp.md && <p>Large Screen Size</p>}
      {bp.lg && <p>Extra large Screen Size</p>}
    </div>
  );
}  
`
function Component() {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <Source dark code={jsxToString(Wrapper())} />
      <Source dark code={str} />
    </HassConnect>
  );
}

function Render() {
  return <HassConnect hassUrl="http://localhost:8123">
    <ThemeProvider />
    <Wrapper />
  </HassConnect>
}

export default {
  title: "components/hooks/useBreakpoint",
  
  tags: ["autodocs"],
  component: Component,
  parameters: {
    padding: "2rem",
    docs: {
      description: {
        component: `This hook can be used to programmatically change the layout/content or functionality based on the current breakpoint. This will return an object with all breakpoint key names and their active state.`,
      },
      page: () => (
        <>
          <Title />
          <h5>
            <mark>{`useBreakpoints()`}</mark>
          </h5>
          <Description />
          <p>The following is the use of the hook in it&apos;s default form:</p>
          <Source dark code={`import { useBreakpoints } from '@hakit/components';\nconst bp = useBreakpoints();`} />
          <Component />
          <p>Below, is the output from the above examples, resize your page to see the component update!</p>
          <Render />
        </>
      ),
    },
  },
} satisfies Meta<typeof Render>;
// export const Example: Story = {
//   render: Render,
// };
export type Story = StoryObj;
export const Docs: Story = {
  args: {},
};