import type { Meta, StoryObj } from "@storybook/react";
import { Story, Source, Title, Description } from "@storybook/blocks";
import { getBreakpoints, ThemeProvider, useBreakpoint, useThemeStore } from "@components";
import { HassConnect } from "@hass-connect-fake";
import jsxToString from "react-element-to-jsx-string";
import customBreakpointsExample from "./examples/some-breakpoints.code?raw";
import { redirectToStory } from ".storybook/redirect";

function Wrapper() {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <ExampleUsage />
    </HassConnect>
  );
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
`;
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
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <Wrapper />
    </HassConnect>
  );
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
export type Story = StoryObj;
export const Docs: Story = {
  args: {},
};

function LimitedBreakpoints() {
  // the bp object will still contain all breakpoints, but only the ones you provided will be active
  // the rest will be false
  const bp = useBreakpoint();
  const breakpoints = useThemeStore((store) => store.breakpoints);
  const queries = getBreakpoints(breakpoints);
  return (
    <>
      <div
        style={{
          padding: 20,
          backgroundColor: " var(--ha-S500)",
        }}
      >
        {bp.xxs && <p>xxs active</p>}
        {bp.xs && <p>xs active</p>}
        {bp.sm && <p>sm active</p>}
        {bp.md && <p>md active</p>}
        {bp.lg && <p>lg active</p>}
        {bp.xlg && <p>xlg active</p>}
      </div>
      <p>Media queries will be derived by the input breakpoints like so:</p>
      <Source code={JSON.stringify(queries, null, 2)} dark />
    </>
  );
}

function RenderCustomBreakpoints() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <ThemeProvider
        breakpoints={{
          xs: 576,
          lg: 1200,
        }}
      />
      <LimitedBreakpoints />
    </HassConnect>
  );
}

export const CustomBreakpoints: Story = {
  args: {
    label: "CustomBreakpoints",
  },
  render: () => (
    <>
      <h4>Disabling some breakpoints</h4>
      <p>
        By default, there&apos;s a wide range of breakpoints set, this may not be ideal for users, so you can opt-in or opt-out of certain
        breakpoints by passing custom breakpoints to the{" "}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            redirectToStory("/docs/components-themeprovider--docs");
          }}
        >
          ThemeProvider
        </a>
      </p>
      <Source dark code={customBreakpointsExample} />
      <h4>Example Output</h4>
      <p>Below, is the output from the above examples, resize your page to see the component update!</p>
      <RenderCustomBreakpoints />
    </>
  ),
};
