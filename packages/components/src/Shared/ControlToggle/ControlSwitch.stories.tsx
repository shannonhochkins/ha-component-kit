import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, ControlToggle, Row, Column } from "@components";
import type { ControlToggleProps } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Template(args?: Partial<ControlToggleProps>) {
  const controlSwitches = [
    {
      checked: true,
    },
    {
      checked: true,
      color: "#c54040",
    },
    {
      checked: false,
      disabled: true,
    },
    {
      checked: true,
      disabled: true,
    },
  ] satisfies ControlToggleProps[];
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider includeThemeControls />
      <h2>Vertical Switches</h2>
      <Row gap={"1rem"} fullWidth justifyContent="flex-start">
        {controlSwitches.map((props, index) => (
          <ControlToggle key={index} {...props} {...args} />
        ))}
      </Row>
      <h2>Horizontal Switches</h2>
      <Column gap={"1rem"} fullWidth alignItems="flex-start">
        {controlSwitches.map((props, index) => (
          <ControlToggle key={index} vertical={false} {...props} {...args} />
        ))}
      </Column>
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Shared/ControlToggle",
  component: ControlToggle,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof ControlToggle>;
export type TimeStory = StoryObj<typeof ControlToggle>;
export const ControlToggleExample: TimeStory = {
  render: Template,
  args: {},
};
