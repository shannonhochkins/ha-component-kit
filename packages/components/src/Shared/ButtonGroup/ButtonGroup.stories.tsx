import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, ButtonGroup } from "@components";
import type { ButtonGroupProps } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Template(args?: Partial<ButtonGroupProps>) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider includeThemeControls />
      <ButtonGroup
        {...args}
        buttons={[
          {
            title: "Click me Title",
            children: "CLICK ME",
            onClick() {
              console.log("CLICKED");
            },
          },
          {
            title: "Power me!",
            icon: "mdi:power",
          },
          {
            title: "Settings",
            icon: "mdi:cog",
          },
        ]}
      />
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Shared/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof ButtonGroup>;
export type TimeStory = StoryObj<typeof ButtonGroup>;
export const Example: TimeStory = {
  render: Template,
  args: {},
};
