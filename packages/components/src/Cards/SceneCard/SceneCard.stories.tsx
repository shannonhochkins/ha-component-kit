import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, SceneCard, SceneCardProps } from "@components";
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
    centered: true,
  },
  argTypes: {
    title: { control: "text" },
    entity: { control: "text" },
  },
} satisfies Meta<typeof SceneCard>;
export type Story = StoryObj<typeof SceneCard>;
export const Example: Story = {
  render: Render,
  args: {
    entity: "scene.good_morning",
  },
};
