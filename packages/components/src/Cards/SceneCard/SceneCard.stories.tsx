import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, SceneCard, SceneCardProps } from "@hakit/components";
import { HassConnect } from "@stories/HassConnectFake";

function Render(args: SceneCardProps) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <SceneCard {...args} />
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Cards/SceneCard",
  component: SceneCard,
  tags: ["autodocs"],
  parameters: {
    width: "100%",
  },
  argTypes: {
    title: { control: "text" },
  },
} satisfies Meta<typeof SceneCard>;
export type Story = StoryObj<typeof SceneCard>;
export const Example: Story = {
  render: Render,
  args: {
    entity: "scene.good_morning",
  },
};
