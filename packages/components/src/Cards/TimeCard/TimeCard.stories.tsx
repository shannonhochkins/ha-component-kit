import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, TimeCard } from "@components";
import type { TimeCardProps } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Template(args?: Partial<TimeCardProps>) {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <ThemeProvider includeThemeControls />
      <TimeCard {...args} />
    </HassConnect>
  );
}

function WithoutDate(args?: Partial<TimeCardProps>) {
  return (
    <div>
      <h2>TimeCard without the date</h2>
      <Template hideDate {...args} />
    </div>
  );
}

export default {
  title: "COMPONENTS/Cards/TimeCard",
  component: TimeCard,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof TimeCard>;
export type TimeStory = StoryObj<typeof TimeCard>;
export const TimeExample: TimeStory = {
  render: Template,
  args: {},
};

export const WithoutDateExample: TimeStory = {
  render: WithoutDate,
  args: {},
};
