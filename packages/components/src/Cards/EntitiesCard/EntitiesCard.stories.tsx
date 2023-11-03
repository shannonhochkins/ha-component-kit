import type { Meta, StoryObj, Args } from "@storybook/react";
import { ThemeProvider, EntitiesCard, EntitiesCardRow, Alert, Column } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Render(args?: Args) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider includeThemeControls />
      <Column gap="1rem" fullWidth>
        <EntitiesCard includeLastUpdated {...args}>
          <EntitiesCardRow entity="sensor.time" />
          <EntitiesCardRow entity="sensor.date" />
          <EntitiesCardRow entity="light.unavailable" />
          <EntitiesCardRow
            entity="switch.fake_switch"
            icon="mdi:gamepad-classic"
            name="Gaming Computer"
            onClick={(entity) => {
              alert(`You clicked on ${entity.attributes.friendly_name}!`);
            }}
            renderState={(entity) => {
              return entity.state === "on" ? <span>On!</span> : <span>Off!</span>;
            }}
          />
          <EntitiesCardRow entity="light.missing_entity_example" />
        </EntitiesCard>
        <Alert type="warning" description="Error above is intentional to show how error boundaries are handled." />
      </Column>
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Cards/EntitiesCard",
  component: EntitiesCard,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof EntitiesCard>;
export type LightStory = StoryObj<typeof EntitiesCard>;
export const Example: LightStory = {
  render: Render,
  args: {},
};
