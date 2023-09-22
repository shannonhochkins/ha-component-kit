import type { Meta, StoryObj } from "@storybook/react";
import { SensorCard } from "@components";
import { HassConnect, useEntity } from "@hakit/core";

function Child() {
  const entity = useEntity("light.all_office_downlights");
  console.log("rerender", entity);
  return (
    <div
      style={{
        backgroundColor: entity.custom.rgbColor,
      }}
    >
      {entity.state}
    </div>
  );
}

function Render() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <Child />
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
