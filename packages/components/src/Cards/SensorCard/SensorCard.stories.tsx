import type { Meta, StoryObj } from "@storybook/react";
import { SensorCard, ThemeProvider } from "@components";
import { HassConnect } from "@hakit/core";


function Render() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <ThemeProvider />
      <SensorCard entity="sensor.air_conditioner_inside_temperature" />
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Cards/SensorCard",
  component: SensorCard,
  tags: ["autodocs"],
  parameters: {
    centered: true,
  },
  argTypes: {
    title: { control: "text" },
    entity: { control: "text" },
  },
} satisfies Meta<typeof SensorCard>;
export type Story = StoryObj<typeof SensorCard>;
export const Example: Story = {
  render: Render,
  args: {},
};
