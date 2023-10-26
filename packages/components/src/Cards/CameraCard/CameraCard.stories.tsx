import type { Meta, StoryObj, Args } from "@storybook/react";
import { ThemeProvider, CameraCard, Column } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Render(args?: Args) {
  return (
    <HassConnect hassUrl="https://homeassistant.local:8123">
      <ThemeProvider includeThemeControls />
      <Column gap="1rem" fullWidth>
        <CameraCard
          entity="camera.demo_camera"
          headerSensors={[
            {
              entity: "binary_sensor.vehicle",
            },
            {
              entity: "switch.record",
            },
          ]}
          {...args}
        />
      </Column>
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Cards/CameraCard",
  component: CameraCard,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof CameraCard>;
export type LightStory = StoryObj<typeof CameraCard>;
export const Example: LightStory = {
  render: Render,
  args: {},
};
