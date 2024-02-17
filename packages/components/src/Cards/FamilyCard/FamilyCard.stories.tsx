import { Column, FamilyCard, ThemeProvider } from "@components";
import { HassConnect } from "@hass-connect-fake";
import type { Args, Meta, StoryObj } from "@storybook/react";

function Render(args?: Args) {
  return (
    <HassConnect hassUrl="https://homeassistant.local:8123">
      <ThemeProvider includeThemeControls />
      <Column gap="1rem" fullWidth>
        <FamilyCard title="State of the Family" personEntities={["person.john_doe", "person.jane_doe"]} {...args} />
      </Column>
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Cards/FamilyCard",
  component: FamilyCard,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof FamilyCard>;
export type FamilyStory = StoryObj<typeof FamilyCard>;
export const Example: FamilyStory = {
  render: Render,
  args: {},
};
