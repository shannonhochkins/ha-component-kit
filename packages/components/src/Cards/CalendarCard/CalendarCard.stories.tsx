import type { Meta, StoryObj, Args } from "@storybook/react";
import { ThemeProvider, CalendarCard, Column } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Render(args?: Args) {
  return (
    <HassConnect hassUrl="https://homeassistant.local:8123">
      <ThemeProvider includeThemeControls />
      <Column gap="1rem" fullWidth>
        <CalendarCard entities={["calendar.google_calendar", "calendar.another_google_calendar"]} {...args} />
      </Column>
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Cards/CalendarCard",
  component: CalendarCard,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof CalendarCard>;
export type LightStory = StoryObj<typeof CalendarCard>;
export const Example: LightStory = {
  render: Render,
  args: {},
};
