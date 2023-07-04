import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, Group, ButtonCard } from "ha-component-kit";
import { HassConnect } from "@stories/HassConnectFake";

function Render(args: Story["args"]) {
  return (
    <HassConnect hassUrl="fake">
      <ThemeProvider />
      <Group title="default" {...args}>
        <ButtonCard domain="light" service="toggle" entity="light.fake_light" />
        <ButtonCard
          domain="switch"
          service="toggle"
          entity="switch.fake_gaming_switch"
        />
        <ButtonCard
          domain="mediaPlayer"
          service="toggle"
          entity="media_player.fake_tv"
        />
      </Group>
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Group",
  component: Group,
  tags: ["autodocs"],
  parameters: {
    width: "100%",
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
