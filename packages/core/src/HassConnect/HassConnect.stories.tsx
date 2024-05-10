import type { Meta, StoryObj } from "@storybook/react";
import { Title, Description, Primary, ArgTypes } from "@storybook/blocks";
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
  title: "COMPONENTS/HassConnect",
  component: HassConnect,
  tags: ["autodocs"],
  parameters: {
    centered: true,
    docs: {
      page: () => (
        <>
          <Title />
          <Description />
          <p>
            This is a top level component that takes care of the Authentication logic for you and all you have to do is login like you
            normally would.
          </p>
          <p>
            <i>
              <b>Note: </b>You will have to login on each device as HassConnect will store tokens per device.
            </i>
          </p>
          <iframe
            style={{
              margin: "auto",
              display: "block",
              marginTop: "20px",
            }}
            width="560"
            height="315"
            frameBorder={0}
            src="https://www.youtube.com/embed/9LLQWlLmtak"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
          <br />
          <h2>Example</h2>
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
