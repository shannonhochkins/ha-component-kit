import { Row, PersonCard, ThemeProvider } from "@components";
import { HassConnect } from "@hass-connect-fake";
import type { Args, Meta, StoryObj } from "@storybook/react";

function Render(args?: Args) {
  return (
    <HassConnect hassUrl="https://homeassistant.local:8123">
      <ThemeProvider includeThemeControls />
      <Row gap="1rem" fullWidth>
        <PersonCard entity="person.john_doe" {...args} />
        <PersonCard entity="person.jane_doe" {...args} />
      </Row>
    </HassConnect>
  );
}

export default {
  title: "components/Cards/FamilyCard/PersonCard",
  component: PersonCard,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof PersonCard>;
export type PersonStory = StoryObj<typeof PersonCard>;
export const Example: PersonStory = {
  render: Render,
  args: {},
};
