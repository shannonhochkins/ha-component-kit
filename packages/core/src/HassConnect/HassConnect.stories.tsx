import type { Meta, StoryObj } from "@storybook/react";
import { HassConnect } from "@core";
import type { HassConnectProps } from "@core";
import { HassConnect as HassConnectFake } from "@hass-connect-fake";
import { Source } from "@storybook/blocks";
import windowContextExample from "./examples/windowContext.code?raw";
import portalRootExample from "./examples/portalRoot.code?raw";

function Render(args: Partial<HassConnectProps>) {
  return (
    <HassConnectFake hassUrl="http://localhost:8123" {...args}>
      <p>Successfully Authenticated!</p>
    </HassConnectFake>
  );
}

export default {
  title: "core/HassConnect",
  component: HassConnect,
  tags: ["autodocs"],
  parameters: {
    centered: true,
    afterDescription: (
      <>
        <p>
          This is a top level component that takes care of the Authentication logic for you and all you have to do is login like you
          normally would.
        </p>
        <p>
          <i>
            <b>Note: </b>You will have to login on each device as HassConnect will store tokens per device.
          </i>
        </p>
      </>
    ),
    afterPrimary: (
      <>
        <h3>Advanced - Window Context</h3>
        <p>
          By providing a different window context, we can tell core & components that provided window will be used across all functionality
          throughout the codebase, for example, inserting modals to the correct position, binding events to the right window context,
          calculations from the correct context etc.
        </p>
        <Source code={windowContextExample} dark language="tsx" />
        <h3>Advanced - PortalRoot</h3>
        <p>
          By default, this is set to window.document.body, if you provide a windowContext it will use the body from the window context, or
          you can specify a totally different portal element for Modals, Tooltips, Ripples etc
        </p>
        <Source code={portalRootExample} dark language="tsx" />
      </>
    ),
  },
} satisfies Meta<typeof HassConnect>;
export type Story = StoryObj<typeof HassConnect>;
export const Example: Story = {
  render: Render,
  args: {
    hassUrl: "http://localhost:8123",
  },
};
