import { Column, FamilyCard, PersonCard, ThemeProvider } from "@components";
import { HassConnect } from "@hass-connect-fake";
import type { Args, Meta, StoryObj } from "@storybook/react";

function Render(args?: Args) {
  return (
    <HassConnect hassUrl="https://homeassistant.local:8123">
      <ThemeProvider includeThemeControls />
      <Column gap="1rem" fullWidth>
        <FamilyCard title="State of a single person" {...args}>
          <PersonCard entity="person.john_doe" />
        </FamilyCard>
        <FamilyCard title="State of two people" {...args}>
          <PersonCard entity="person.john_doe" />
          <PersonCard entity="person.jane_doe" />
        </FamilyCard>
        <FamilyCard title="State of 3 or more" {...args}>
          <PersonCard entity="person.john_doe" />
          <PersonCard entity="person.jane_doe" />
          <PersonCard entity="person.john_doe" />
        </FamilyCard>
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
