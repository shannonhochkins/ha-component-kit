import { Story, Source, Title, Description } from "@storybook/blocks";
import type { Meta, StoryObj } from "@storybook/react";

export default {
  title: "HOOKS/useDevice",
  tags: ["autodocs"],
  parameters: {
    centered: true,
    height: "auto",
    docs: {
      page: () => (
        <>
          <Title />
          <h5>
            <mark>{`useDevice(entity: EntityName)`}</mark>
          </h5>
          <Description />
          <p>The following is the use of the hook:</p>
          <Source dark code={`const device = useDevice('camera.some_camera');`} />
          <p>
            The above will either return null or the extended device information, this is not the entity, but rather the device, they're
            different in the eyes of home assistant, and not all entities have devices.
          </p>
          <p>The return type is provided with typescript so you can see the difference.</p>
        </>
      ),
      description: {
        component: `The useDevice hook is designed to return all the additional information related to a device.`,
      },
    },
  },
} satisfies Meta;

export type Story = StoryObj;
export const Docs: Story = {
  args: {},
};
