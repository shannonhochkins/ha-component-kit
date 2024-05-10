import type { Meta, StoryObj, Args } from "@storybook/react";
import { ThemeProvider, VacuumCard } from "@components";
import { HassConnect } from "@hass-connect-fake";

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
    fullWidth: true,
  },
} satisfies Meta<typeof VacuumCard>;
export type VacuumStory = StoryObj<typeof VacuumCard>;
export const VacuumCardExample: VacuumStory = {
  render: Render,
  args: {},
};

export const CustomShortcuts: VacuumStory = {
  render: Render,
  args: {
    shortcuts: [{
      title: 'Send to home!',
      icon: 'mdi:home',
      onClick(entity) {
        entity.service.returnToBase();
      }
    }, {
      title: 'Set fan speed',
      icon: 'mdi:fan',
      onClick(entity) {
        entity.service.setFanSpeed({
          fan_speed: 'high',
        });
      }
    }, {
      title: 'Clean spot',
      icon: 'mdi:vacuum-cleaner',
      onClick(entity) {
        entity.service.cleanSpot();
      }
    }],
  },
};
