import type { Meta, StoryObj, Args } from "@storybook/react";
import { ThemeProvider, ClimateCard } from "@components";
import { HassConnect } from "@stories/HassConnectFake";

function Render(args?: Args) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <ClimateCard entity={"climate.air_conditioner"} {...args} />
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Cards/ClimateCard",
  component: ClimateCard,
  tags: ["autodocs"],
  parameters: {
    centered: true,
  },
} satisfies Meta<typeof ClimateCard>;
export type ClimateStory = StoryObj<typeof ClimateCard>;
export const ClimateCardExample: ClimateStory = {
  render: Render,
  args: {
    entity: "climate.air_conditioner",
  },
};

export const ClimateCardWithCustomHvacExample: ClimateStory = {
  render: Render,
  args: {
    entity: "climate.air_conditioner",
    hvacModes: ["heat", "cool", "off"],
  },
};

export const ClimateCardUnavailableExample: ClimateStory = {
  render: Render,
  args: {
    entity: "climate.unavailable",
  },
};
