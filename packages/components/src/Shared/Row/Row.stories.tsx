import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeProvider, Row, ButtonCard, ThemeControlsModal } from "@components";
import type { RowProps } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Template(args?: Partial<RowProps>) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <ThemeControlsModal />
      <Row {...args}>
        <ButtonCard entity="light.fake_light_1" />
        <ButtonCard entity="switch.fake_switch" />
        <ButtonCard entity="media_player.fake_tv" />
      </Row>
    </HassConnect>
  );
}

export default {
  title: "components/Shared/Row",
  component: Row,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
  argTypes: {
    justifyContent: { control: "text" },
    alignItems: { control: "text" },
    gap: { control: "text" },
  },
} satisfies Meta<typeof Row>;
export type TimeStory = StoryObj<typeof Row>;
export const Docs: TimeStory = {
  render: Template,
  args: {
    gap: "0.5rem",
    fullWidth: true,
  },
};
