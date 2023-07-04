import type { Meta, StoryObj } from "@storybook/react";
import { Title, Description, Primary, ArgTypes } from "@storybook/blocks";
import { HassConnect, ThemeProvider } from "ha-component-kit";
import { HassConnect as HassConnectFake } from "@stories/HassConnectFake";

function Render(args: Story["args"]) {
  return (
    <HassConnectFake hassUrl="fake" {...args}>
      <ThemeProvider />
      <p>Successfully Authenticated!</p>
    </HassConnectFake>
  );
}

export default {
  title: "COMPONENTS/HassConnect",
  component: HassConnect,
  tags: ["autodocs"],
  parameters: {
    width: "100%",
    docs: {
      page: () => (
        <>
          <Title />
          <Description />
          <p>
            This is a top level component that takes care of the Authentication
            logic for you and all you have to do is login like you normally
            would.
          </p>
          <p>
            <i>
              <b>Note: </b>You will have to login on each device as HassConnect
              will store tokens per device.
            </i>
          </p>
          <Primary />
          <h2>Component Props</h2>
          <ArgTypes />
        </>
      ),
    },
  },
} satisfies Meta<typeof HassConnect>;
export type Story = StoryObj<typeof HassConnect>;
export const Example: Story = {
  render: Render,
  args: {
    hassUrl: "http://localhost:8123",
  },
};
