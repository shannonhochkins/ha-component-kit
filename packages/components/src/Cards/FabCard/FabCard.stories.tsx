import type { Meta, StoryObj, Args } from "@storybook/react";
import { ThemeProvider, FabCard } from "@components";
import { HassConnect } from "@stories/HassConnectFake";

function Template(args?: Args) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <FabCard {...args} />
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Cards/FabCard",
  component: FabCard,
  tags: ["autodocs"],
  parameters: {
    centered: true,
  },
  argTypes: {
    title: { control: "text" },
    entity: { control: "text" },
  },
} satisfies Meta<typeof FabCard>;
export type FabCardStory = StoryObj<
  typeof FabCard<"light.fake_light_1" | "light.unavailable">
>;
export const FabCardExample: FabCardStory = {
  render: Template,
  args: {
    title: "Office",
    entity: "light.fake_light_1",
    icon: "mdi:office-chair",
    service: "toggle",
  },
};

export const FabCardUnavailableExample: FabCardStory = {
  render: Template,
  args: {
    entity: "light.unavailable",
  },
};
