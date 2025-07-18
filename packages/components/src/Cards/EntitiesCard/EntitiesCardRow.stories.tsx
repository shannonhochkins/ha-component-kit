import { Row, EntitiesCardRow, ThemeProvider, ThemeControlsModal } from "@components";
import { HassConnect } from "@hass-connect-fake";
import type { Args, Meta, StoryObj } from "@storybook/react-vite";

function Render(args?: Args) {
  return (
    <HassConnect hassUrl="https://homeassistant.local:8123">
      <ThemeProvider />
      <ThemeControlsModal />
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
  title: "components/Cards/EntitiesCard/EntitiesCardRow",
  component: EntitiesCardRow,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof EntitiesCardRow>;
export type EntitiesCardRowStory = StoryObj<typeof EntitiesCardRow>;
export const Docs: EntitiesCardRowStory = {
  render: Render,
  args: {},
};
