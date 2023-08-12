import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, Group, ButtonCard } from "@components";
import { HassConnect } from "@stories/HassConnectFake";

function Render(args: Story["args"]) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <Group title="default" {...args}>
        <ButtonCard service="toggle" entity="light.fake_light_1" />
        <ButtonCard service="toggle" entity="switch.fake_gaming_switch" />
        <ButtonCard service="toggle" entity="media_player.fake_tv" />
      </Group>
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Group",
  component: Group,
  tags: ["autodocs"],
  parameters: {
    centered: true,
  },
  argTypes: {
    title: { control: "text" },
  },
} satisfies Meta<typeof Group>;
export type Story = StoryObj<typeof Group>;
export const Example: Story = {
  render: Render,
  args: {
    title: "Example Title",
  },
};
