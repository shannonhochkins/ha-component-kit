import type { Meta, StoryObj, Args } from "@storybook/react";
import { ThemeProvider, EntitiesCard, Alert, Column } from "@components";
import { HassConnect } from "@stories/HassConnectFake";

function Render(args?: Args) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <Column gap="1rem">
        <EntitiesCard {...args} />
        <Alert
          type="warning"
          description="Error above is intentional to show how error boundaries are handled."
        />
      </Column>
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Cards/EntitiesCard",
  component: EntitiesCard,
  tags: ["autodocs"],
  parameters: {
    centered: true,
  },
} satisfies Meta<typeof EntitiesCard>;
export type LightStory = StoryObj<typeof EntitiesCard>;
export const Example: LightStory = {
  render: Render,
  args: {
    entities: [
      "sensor.time",
      "sensor.date",
      "light.unavailable",
      {
        entity: "switch.fake_switch",
        icon: "mdi:gamepad-classic",
        name: "Gaming Computer",
        onClick: (entity) => {
          alert(`You clicked on ${entity.attributes.friendly_name}!`);
        },
        renderState: (entity) => {
          return entity.state === "on" ? <span>On!</span> : <span>Off!</span>;
        },
      },
      "light.missing_entity_example",
    ],
  },
};
