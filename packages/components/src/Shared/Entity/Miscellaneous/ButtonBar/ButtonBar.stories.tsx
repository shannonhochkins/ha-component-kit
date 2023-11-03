import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, ButtonBar, ButtonBarButton } from "@components";
import type { ButtonBarProps } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Template(args?: Partial<ButtonBarProps>) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider includeThemeControls />
      <ButtonBar {...args}>
        <ButtonBarButton entity="light.fake_light_1" service="toggle" />
        <ButtonBarButton title="Power Me!" icon="mdi:power" />
        <ButtonBarButton title="Settings" icon="mdi:cog" />
      </ButtonBar>
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Shared/Entity/Miscellaneous/ButtonBar",
  component: ButtonBar,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof ButtonBar>;
export type TimeStory = StoryObj<typeof ButtonBar>;
export const Example: TimeStory = {
  render: Template,
  args: {},
};
