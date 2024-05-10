import type { Meta, StoryObj } from "@storybook/react";
import { Source } from "@storybook/blocks";
import { ThemeProvider, Column, GarbageCollectionCard, Row } from "@components";
import type { GarbageCollectionCardProps } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Template(args?: GarbageCollectionCardProps) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider includeThemeControls />
      <GarbageCollectionCard schedules={[]} {...args} />
    </HassConnect>
  );
}

function Detailed() {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider includeThemeControls />
      <Column gap="1rem" alignItems="flex-start" fullWidth>
        <p>If you normally get your bins picked up on a weekly interval on a Thursday, and it's red one week, and green the next:</p>
        <Row gap="1rem" fullWidth>
          <GarbageCollectionCard
            schedules={[
              {
                day: "Thursday",
                frequency: "weekly",
                weeks: [
                  // week 1
                  ["#b62525", "#009b00"],
                  // week 2
                  ["#b62525", "#c8c804"],
                  // week 3
                  ["#b62525", "#009b00"],
                  // week 4
                  ["#b62525", "#c8c804"],
                ],
              },
            ]}
          />
          <Source
            dark
            code={`
<GarbageCollectionCard schedules={[{
  day: 'Thursday',
  frequency: 'weekly',
  weeks: [
    // week 1
    ['#b62525', '#009b00'],
    // week 2
    ['#b62525', '#c8c804'],
    // week 3
    ['#b62525', '#009b00'],
    // week 4
    ['#b62525', '#c8c804']
  ]
}]} />
            `}
          />
        </Row>
        <p>If you get one bin picked up fortnightly, and another weekly, just omit the bin from the week:</p>
        <Row gap="1rem" fullWidth>
          <GarbageCollectionCard
            schedules={[
              {
                day: "Thursday",
                frequency: "weekly",
                weeks: [
                  // week 1
                  ["#2533b6"],
                  // week 2
                  ["#2533b6", "#c8c804"],
                  // week 3
                  ["#2533b6"],
                  // week 4
                  ["#2533b6", "#c8c804"],
                ],
              },
            ]}
          />
          <Source
            dark
            code={`
<GarbageCollectionCard schedules={[{
  day: 'Thursday',
  frequency: 'weekly',
  weeks: [
    // week 1
    ['#2533b6'],
    // week 2
    ['#2533b6', '#c8c804'],
    // week 3
    ['#2533b6'],
    // week 4
    ['#2533b6', '#c8c804']
  ]
}]} />
            `}
          />
        </Row>
        <p>
          If you get your bins picked up fortnightly, set the frequency to fortnightly, and set the weeks that don't have pickup to null
        </p>
        <Row gap="1rem" fullWidth>
          <GarbageCollectionCard
            schedules={[
              {
                day: "Tuesday",
                frequency: "fortnightly",
                weeks: [
                  // week 1
                  ["#2533b6"],
                  // week 2
                  null,
                  // week 3
                  ["#2533b6"],
                  // week 4
                  null,
                ],
              },
            ]}
          />
          <Source
            dark
            code={`
<GarbageCollectionCard schedules={[{
  day: 'Tuesday',
  frequency: 'fortnightly',
  weeks: [
    // week 1
    ['#2533b6'],
    // week 2
    null,
    // week 3
    ['#2533b6'],
    // week 4
    null,
  ]
}]} />
            `}
          />
        </Row>
      </Column>
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Cards/GarbageCollectionCard",
  component: GarbageCollectionCard,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
  argTypes: {},
} satisfies Meta<typeof GarbageCollectionCard>;
export type Story = StoryObj<typeof GarbageCollectionCard>;
export const Example: Story = {
  render: Template,
  args: {
    description: "Here's the upcoming garbage collection schedule.",
    schedules: [
      {
        day: "Thursday",
        frequency: "weekly",
        weeks: [
          [
            {
              color: "#b62525",
              name: "General Waste",
            },
            {
              color: "#009b00",
              name: "Garden Waste",
            },
          ],
          [
            {
              color: "#b62525",
              textColor: "white",
              name: "Waste",
            },
            {
              color: "#c8c804",
              name: "Recycling",
            },
          ],
          [
            {
              color: "#b62525",
              icon: "game-icons:nuclear-waste",
            },
            {
              color: "#009b00",
              name: "Garden",
            },
          ],
          ["#b62525", "#c8c804"],
        ],
      },
    ],
  },
};

export const DetailedExamples: Story = {
  render: Detailed,
  args: {},
};
