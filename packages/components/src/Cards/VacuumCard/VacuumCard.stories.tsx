import type { Meta, StoryObj, Args } from "@storybook/react";
import { ThemeProvider, VacuumCard } from "@components";
import { HassConnect } from "@stories/HassConnectFake";

function Render(args?: Args) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <VacuumCard {...args} entity="vacuum.robot_vacuum" />
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Cards/VacuumCard",
  component: VacuumCard,
  tags: ["autodocs"],
  parameters: {
    centered: true,
  },
} satisfies Meta<typeof VacuumCard>;
export type VacuumStory = StoryObj<typeof VacuumCard>;
export const VacuumCardExample: VacuumStory = {
  render: Render,
  args: {},
};

export const VacuumCardWithCustomExample: VacuumStory = {
  render: Render,
  args: {
    fanSpeeds: ["Silent", "Standard", "Medium", "Turbo"],
  },
};
