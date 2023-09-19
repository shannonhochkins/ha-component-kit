import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, TimeCard } from "@components";
import type { TimeCardProps } from "@components";
import { HassConnect } from "@hakit/core";

function Template(args?: Partial<TimeCardProps>) {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123" options={{
      allowNonSecure: true
    }}>
      <ThemeProvider includeThemeControls />
      <TimeCard {...args} />
    </HassConnect>
  );
}

function WithoutDate(args?: Partial<TimeCardProps>) {
  return (
    <div>
      <h2>TimeCard without the date</h2>
      <Template includeDate={false} {...args} />
    </div>
  );
}

export default {
  title: "COMPONENTS/Cards/TimeCard",
  component: TimeCard,
  tags: ["autodocs"],
  parameters: {
    centered: true,
  },
  argTypes: {
    title: { control: "text" },
    icon: { control: "text" },
    includeDate: { control: "boolean" },
    includeIcon: { control: "boolean" },
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
