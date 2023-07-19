import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, Row, ButtonCard } from "@components";
import type { RowProps } from "@components";
import { HassConnect } from "@stories/HassConnectFake";

function Template(args?: Partial<RowProps>) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <Row {...args}>
        <ButtonCard entity="light.fake_light" />
        <ButtonCard entity="switch.fake_gaming_switch" />
        <ButtonCard entity="media_player.fake_tv" />
      </Row>
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Shared/Row",
  component: Row,
  tags: ["autodocs"],
  parameters: {
    width: "100%",
  },
  argTypes: {
    theme: { table: { disable: true } },
    as: { table: { disable: true } },
    justifyContent: { control: "text" },
    alignItems: { control: "text" },
    gap: { control: "text" },
  },
} satisfies Meta<typeof Row>;
export type TimeStory = StoryObj<typeof Row>;
export const RowExample: TimeStory = {
  render: Template,
  args: {
    gap: "0.5rem",
  },
};
