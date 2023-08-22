import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, FabCard } from "@components";
import type { FabCardProps } from "@components";
import { HassConnect } from "@stories/HassConnectFake";
import type { DomainService, ExtractDomain } from "@core";

function Template(
  args: FabCardProps<
    "light.something",
    DomainService<ExtractDomain<"light.something">>
  >,
) {
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
export type FabCardStory = StoryObj<typeof FabCard>;
export const FabCardExample: FabCardStory = {
  // @ts-expect-error - TODO will fix later
  render: Template,
  args: {
    title: "Office",
    entity: "light.fake_light_1",
    icon: "mdi:office-chair",
    // @ts-expect-error - TODO will fix later
    service: "toggle",
  },
};
