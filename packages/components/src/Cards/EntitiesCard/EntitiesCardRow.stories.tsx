import { Row, EntitiesCardRow, ThemeProvider } from "@components";
import { HassConnect } from "@hass-connect-fake";
import type { Args, Meta, StoryObj } from "@storybook/react";

function Render(args?: Args) {
  return (
    <HassConnect hassUrl="https://homeassistant.local:8123">
      <ThemeProvider includeThemeControls />
      <Row gap="1rem" fullWidth>
        <EntitiesCardRow {...args} entity="sensor.time" />
        <EntitiesCardRow {...args} entity="sensor.date" />
        <EntitiesCardRow {...args} entity="person.john_doe" />
        <EntitiesCardRow {...args} entity="climate.air_conditioner" />
      </Row>
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Cards/EntitiesCard/EntitiesCardRow",
  component: EntitiesCardRow,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof EntitiesCardRow>;
export type EntitiesCardRowStory = StoryObj<typeof EntitiesCardRow>;
export const Example: EntitiesCardRowStory = {
  render: Render,
  args: {},
};
