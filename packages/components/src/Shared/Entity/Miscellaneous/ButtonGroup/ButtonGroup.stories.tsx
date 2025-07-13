import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeProvider, ButtonGroup, ButtonGroupButton, ThemeControlsModal } from "@components";
import type { ButtonGroupProps } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Template(args?: Partial<ButtonGroupProps>) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <ThemeControlsModal />
      <ButtonGroup {...args}>
        <ButtonGroupButton
          entity="light.fake_light_1"
          service="toggle"
          serviceData={{
            brightness_pct: 50,
          }}
        />
        <ButtonGroupButton entity="binary_sensor.vehicle" />
        <ButtonGroupButton entity="switch.record" service="toggle" />
      </ButtonGroup>
    </HassConnect>
  );
}

export default {
  title: "components/Shared/Entity/Miscellaneous/ButtonGroup",
  component: ButtonGroup,
  subcomponents: { ButtonGroupButton: ButtonGroupButton as React.ComponentType<unknown> },
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof ButtonGroup>;
export type TimeStory = StoryObj<typeof ButtonGroup>;
export const Docs: TimeStory = {
  render: Template,
  args: {},
};
