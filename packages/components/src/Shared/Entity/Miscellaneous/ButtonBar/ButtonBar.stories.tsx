import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, ButtonBar, ButtonBarButton, Row, Alert } from "@components";
import type { ButtonBarProps } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Template(args?: Partial<ButtonBarProps>) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider includeThemeControls />
      <Row
        gap="1rem"
        style={{
          padding: `1rem`,
          backgroundColor: `var(--ha-S500)`,
        }}
      >
        <ButtonBar {...args}>
          <ButtonBarButton entity="light.fake_light_1" service="toggle" />
          <ButtonBarButton title="Power Me!" icon="mdi:power" />
          <ButtonBarButton title="Settings" icon="mdi:cog" />
        </ButtonBar>
        <ButtonBar gap="0.5rem" layoutType="bubble" {...args}>
          <ButtonBarButton entity="light.fake_light_1" service="toggle" />
          <ButtonBarButton title="Power Me!" icon="mdi:power" />
          <ButtonBarButton title="Settings" icon="mdi:cog" />
        </ButtonBar>
      </Row>
      <Alert type="info" style={{ marginTop: `1rem` }}>
        <p>
          The background color above is not part of the component, was only set as these buttons have a similar colour to the main
          background color as they're typically used within other cards which have a lighter background.
        </p>
      </Alert>
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
