import type { Meta, StoryObj, Args } from "@storybook/react-vite";
import { SensorCard, ThemeProvider, Row, ThemeControlsModal } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Render(args: Args) {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <ThemeProvider />
      <ThemeControlsModal />
      <Row gap="1rem">
        <SensorCard entity="sensor.air_conditioner_inside_temperature" {...args} />
        <SensorCard entity="sensor.air_conditioner_inside_temperature" layoutType="slim-vertical" {...args} />
        <SensorCard entity="sensor.air_conditioner_inside_temperature" layoutType="slim" {...args} />
      </Row>
    </HassConnect>
  );
}

export default {
  title: "components/Cards/SensorCard",
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
export const Docs: Story = {
  render: Render,
  args: {
    onClick: undefined,
  },
};
