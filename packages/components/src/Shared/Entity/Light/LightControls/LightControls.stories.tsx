import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, LightControls } from "@components";
import type { LightControlsProps } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Template(args?: Partial<LightControlsProps>) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider includeThemeControls />
      <LightControls {...args} entity="light.fake_light_1" />
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Shared/Entity/Light/LightControls",
  component: LightControls,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof LightControls>;
export type TimeStory = StoryObj<typeof LightControls>;
export const LightControlsExample: TimeStory = {
  render: Template,
  args: {},
};
