import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, FabCard, FabCardProps } from "@components";
import { HassConnect } from "@stories/HassConnectFake";

function Template(
  args?: Partial<FabCardProps<"light.fake_light_1" | "light.unavailable">>,
) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <FabCard
        {...args}
        onClick={(entity) => {
          entity.api.toggle();
        }}
      />
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
