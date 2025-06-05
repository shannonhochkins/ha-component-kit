import type { Meta, StoryObj, Args } from "@storybook/react-vite";
import { ThemeProvider, CalendarCard, Column, ThemeControlsModal } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Render(args?: Args) {
  return (
    <HassConnect hassUrl="https://homeassistant.local:8123">
      <ThemeProvider />
      <ThemeControlsModal />
      <Column gap="1rem" fullWidth>
        <CalendarCard entities={["calendar.google_calendar", "calendar.another_google_calendar"]} {...args} />
      </Column>
    </HassConnect>
  );
}

export default {
  title: "components/Cards/CalendarCard",
  component: CalendarCard,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof CalendarCard>;
export type LightStory = StoryObj<typeof CalendarCard>;
export const Docs: LightStory = {
  render: Render,
  args: {},
};
