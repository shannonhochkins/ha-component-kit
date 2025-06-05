import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeProvider, Column, Alert, ThemeControlsModal } from "@components";
import type { AlertProps } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Template(args?: Partial<AlertProps>) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <ThemeControlsModal />
      <Column gap="1rem" fullWidth>
        <Alert {...args} type="error" />
        <Alert {...args} type="info" />
        <Alert {...args} type="warning" />
        <Alert {...args} type="success" />
      </Column>
    </HassConnect>
  );
}

export default {
  title: "components/Shared/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    fillWidth: true,
  },
} satisfies Meta<typeof Alert>;
export type TimeStory = StoryObj<typeof Alert>;
export const Docs: TimeStory = {
  render: Template,
  args: {
    type: "error",
    title: "Dude?",
    description: `Where's my car? Dude? I haven't seen your car?`,
  },
};
