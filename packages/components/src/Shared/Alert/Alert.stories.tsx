import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, Column, Alert } from "@components";
import type { AlertProps } from "@components";
import { HassConnect } from "@stories/HassConnectFake";

function Template(args?: Partial<AlertProps>) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <Column gap="1rem">
        <Alert {...args} type="error" />
        <Alert {...args} type="info" />
        <Alert {...args} type="warning" />
        <Alert {...args} type="success" />
      </Column>
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Shared/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    centered: true,
  },
} satisfies Meta<typeof Alert>;
export type TimeStory = StoryObj<typeof Alert>;
export const AlertExample: TimeStory = {
  render: Template,
  args: {
    type: "error",
    title: "Dude?",
    description: `Where's my car? Dude? I haven't seen your car?`,
  },
};
