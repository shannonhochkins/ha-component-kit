import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, SwitchControls, Row } from "@components";
import type { SwitchControlsProps } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Template(args?: Partial<SwitchControlsProps>) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider includeThemeControls />
      <Row gap={"1rem"} fullWidth justifyContent="flex-start">
        <SwitchControls {...args} entity="switch.fake_switch" />
        <SwitchControls {...args} entity="switch.unavailable" />
      </Row>
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Shared/Entity/Switch/SwitchControls",
  component: SwitchControls,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof SwitchControls>;
export type TimeStory = StoryObj<typeof SwitchControls>;
export const SwitchControlsExample: TimeStory = {
  render: Template,
  args: {},
};
