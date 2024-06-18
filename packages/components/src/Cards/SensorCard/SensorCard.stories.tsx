import type { Meta, StoryObj, Args } from "@storybook/react";
import { SensorCard, ThemeProvider, Row } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Render(args: Args) {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <ThemeProvider />
      <Row gap="1rem">
        <SensorCard entity="sensor.air_conditioner_inside_temperature" {...args} />
        <SensorCard entity="sensor.air_conditioner_inside_temperature" layoutType="slim-vertical" {...args} />
        <SensorCard entity="sensor.air_conditioner_inside_temperature" layoutType="slim" {...args} />
      </Row>
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Cards/SensorCard",
  component: SensorCard,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
  argTypes: {
    title: { control: "text" },
    entity: { control: "text" },
  },
} satisfies Meta<typeof SensorCard>;
export type Story = StoryObj<typeof SensorCard>;
export const Example: Story = {
  render: Render,
  args: {
    onClick: undefined,
  },
};
