import type { Meta, StoryObj } from "@storybook/react-vite";
import { HassConnect } from "@core";
import type { HassConnectProps } from "@core";
import { HassConnect as HassConnectFake } from "@hass-connect-fake";
import { Source } from "@storybook/addon-docs/blocks";
import windowContextExample from "./examples/windowContext.code?raw";
import portalRootExample from "./examples/portalRoot.code?raw";
import suspendResume from "./examples/suspendResume.code?raw";
import statusViaStore from "./examples/statusViaStore.code?raw";
import specifyingLanguage from "./examples/specifyingLanguage.code?raw";
import renderError from "./examples/renderError.code?raw";

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
        <p>
          <i>
            <b>Note: </b>For performance optimisations, similar to Home Assistant, on inactive tabs, or &quot;frozen&quot; tabs, the
            connection will be suspended after 5 minutes (by default) and will resume once the browser is in focus/visible again.
            There&apos;s examples on how to configure this below.
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
        <h3>Advanced - Configuring Suspend/Resume logic</h3>
        <p>
          If you want to enable debugging, capture the status changes, or change the behavior of how long it takes to suspend the
          connection, or disable this behavior entirely:
        </p>
        <Source code={suspendResume} dark language="tsx" />
        <p>Or you can retrieve the status directly from the store</p>
        <Source code={statusViaStore} dark />
        <h3>Advanced - Specifying Locale/language</h3>
        <p>
          By default, HassConnect will use the locale set within your Home Assistant instance. You can override this by providing a
          different locale in the options.
        </p>
        <Source code={specifyingLanguage} dark language="tsx" />
        <h3>Advanced - Rendering Errors</h3>
        <p>
          In some cases, where authentication fails, or the connection is lost, you may want to render the displayed error message in your
          own styles which you can do by providing the following override:
        </p>
        <Source code={renderError} dark language="tsx" />
      </>
    ),
  },
} satisfies Meta<typeof HassConnect>;
export type Story = StoryObj<typeof HassConnect>;
export const Docs: Story = {
  render: Render,
  args: {
    hassUrl: "http://localhost:8123",
  },
};
