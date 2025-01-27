import type { Meta, StoryObj } from "@storybook/react";
import { HassConnect } from "@core";
import type { HassConnectProps } from "@core";
import { HassConnect as HassConnectFake } from "@hass-connect-fake";

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
  },
} satisfies Meta<typeof HassConnect>;
export type Story = StoryObj<typeof HassConnect>;
export const Example: Story = {
  render: Render,
  args: {
    hassUrl: "http://localhost:8123",
  },
};
