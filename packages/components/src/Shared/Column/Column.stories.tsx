import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, Column, ButtonCard } from "@components";
import type { ColumnProps } from "@components";
import { HassConnect } from "@stories/HassConnectFake";

function Template(args?: Partial<ColumnProps>) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <Column {...args}>
        <ButtonCard entity="light.fake_light_1" />
        <ButtonCard entity="switch.fake_gaming_switch" />
        <ButtonCard entity="media_player.fake_tv" />
      </Column>
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Shared/Column",
  component: Column,
  tags: ["autodocs"],
  parameters: {
    centered: true,
  },
  argTypes: {
    theme: { table: { disable: true } },
    justifyContent: {
      control: "text",
      description: "standard flex css properties for justify-content",
    },
    alignItems: {
      control: "text",
      description: "standard flex css properties for align-items",
    },
    gap: { control: "text", description: "standard css gap property values" },
  },
} satisfies Meta<typeof Column>;
export type TimeStory = StoryObj<typeof Column>;
export const ColumnExample: TimeStory = {
  render: Template,
  args: {
    gap: "0.5rem",
  },
};
