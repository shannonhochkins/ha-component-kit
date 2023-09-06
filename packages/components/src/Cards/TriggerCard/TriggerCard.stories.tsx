import type { Meta, StoryObj, Args } from "@storybook/react";
import { ThemeProvider, TriggerCard, Column } from "@components";
import { HassConnect } from "@stories/HassConnectFake";

function Render(args?: Args) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <Column gap="1rem">
        <TriggerCard
          entity="scene.good_morning"
          {...args}
          onClick={(entity) => {
            entity.api.turnOn();
          }}
        />
        <TriggerCard
          entity="light.unavailable"
          onClick={(entity) => {
            // will not fire when unavailable
            entity.api.turnOn();
          }}
        />
      </Column>
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Cards/TriggerCard",
  component: TriggerCard,
  tags: ["autodocs"],
  parameters: {
    centered: true,
  },
  argTypes: {
    title: { control: "text" },
    entity: { control: "text" },
  },
} satisfies Meta<typeof TriggerCard>;
export type Story = StoryObj<typeof TriggerCard>;
export const Example: Story = {
  render: Render,
  args: {
    entity: "scene.good_morning",
  },
};
