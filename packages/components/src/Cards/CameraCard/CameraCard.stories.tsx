import type { Meta, StoryObj, Args } from "@storybook/react";
import { ThemeProvider, CameraCard, ButtonBarButton, Column } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Render(args?: Args) {
  return (
    <HassConnect hassUrl="https://homeassistant.local:8123">
      <ThemeProvider includeThemeControls />
      <Column gap="1rem" fullWidth>
        <CameraCard
          entity="camera.demo_camera"
          headerSensors={[<ButtonBarButton entity="binary_sensor.vehicle" key="a" />, <ButtonBarButton entity="switch.record" key="b" />]}
          {...args}
        />
      </Column>
    </HassConnect>
  );
}

export default {
  title: "components/Cards/CameraCard",
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
