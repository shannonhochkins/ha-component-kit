import type { Meta, StoryObj, Args } from "@storybook/react";
import { ThemeProvider, AlarmControls, Row } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Render(args?: Args) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider includeThemeControls />
      <Row gap="2rem" fullHeight fullWidth>
        <AlarmControls {...args} entity="alarm_control_panel.home_alarm" />
      </Row>
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Shared/Entity/Alarm/AlarmControls",
  component: AlarmControls,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof AlarmControls>;
export type AlarmStory = StoryObj<typeof AlarmControls>;
export const AlarmControlsExample: AlarmStory = {
  render: Render,
  args: {
    entity: "alarm_control_panel.alarm",
  },
};
