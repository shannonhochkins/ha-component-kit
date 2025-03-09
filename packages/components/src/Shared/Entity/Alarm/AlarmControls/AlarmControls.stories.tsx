import type { Meta, StoryObj, Args } from "@storybook/react";
import { ThemeProvider, AlarmControls, Row, ThemeControlsModal } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Render(args?: Args) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <ThemeControlsModal />
      <Row gap="2rem" fullHeight fullWidth>
        <AlarmControls {...args} entity="alarm_control_panel.home_alarm" />
      </Row>
    </HassConnect>
  );
}

export default {
  title: "components/Shared/Entity/Alarm/AlarmControls",
  component: AlarmControls,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof AlarmControls>;
export type AlarmStory = StoryObj<typeof AlarmControls>;
export const Docs: AlarmStory = {
  render: Render,
  args: {
    entity: "alarm_control_panel.alarm",
  },
};
