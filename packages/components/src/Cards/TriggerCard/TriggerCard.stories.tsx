import type { Meta, StoryObj, Args } from "@storybook/react";
import { ThemeProvider, TriggerCard, Column } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Render(args?: Args) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider includeThemeControls />
      <Column gap="1rem" fullWidth>
        <TriggerCard
          entity="scene.good_morning"
          {...args}
          onClick={(entity) => {
            entity.service.turnOn();
          }}
        />
        <TriggerCard
          entity="automation.dim_lights"
          description="Will dim all the lights linked to the automation"
          sliderIcon="mdi:downlight"
          sliderTextActive="Dimming..."
          sliderTextInactive="Dim me!"
          hideArrow
          {...args}
          onClick={(entity) => {
            entity.service.turnOn();
          }}
        />
        <TriggerCard
          entity="light.unavailable"
          onClick={(entity) => {
            // will not fire when unavailable
            entity.service.turnOn();
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
    fillWidth: true,
  },
  argTypes: {
    title: { control: "text" },
    entity: { control: "text" },
  },
} satisfies Meta<typeof TriggerCard>;
export type Story = StoryObj<typeof TriggerCard>;
export const Example: Story = {
  render: Render,
  args: {},
};
