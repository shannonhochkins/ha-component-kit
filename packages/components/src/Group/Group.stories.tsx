import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, Row, Group, ButtonCard } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Render(args: Story["args"]) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider includeThemeControls />
      <Row fullWidth>
        <Group title="default" {...args}>
          <ButtonCard service="toggle" entity="light.fake_light_1" />
          <ButtonCard service="toggle" entity="switch.fake_switch" />
          <ButtonCard service="toggle" entity="media_player.fake_tv" />
        </Group>
      </Row>
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Group",
  component: Group,
  tags: ["autodocs"],
  parameters: {
    centered: true,
    fillWidth: true,
  },
  argTypes: {
    title: { control: "text" },
  },
} satisfies Meta<typeof Group>;
export type Story = StoryObj<typeof Group>;
export const Example: Story = {
  render: Render,
  args: {
    title: "Example Title",
  },
};
