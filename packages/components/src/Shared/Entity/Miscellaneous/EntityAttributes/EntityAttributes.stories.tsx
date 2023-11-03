import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, EntityAttributes, Row } from "@components";
import type { EntityAttributesProps } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Template(args?: Partial<EntityAttributesProps>) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider includeThemeControls />
      <Row gap="5rem" fullWidth>
        <EntityAttributes entity="cover.cover_with_tilt" {...args} />
      </Row>
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Shared/Entity/Miscellaneous/EntityAttributes",
  component: EntityAttributes,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof EntityAttributes>;
export type TimeStory = StoryObj<typeof EntityAttributes>;
export const EntityAttributesExample: TimeStory = {
  render: Template,
  args: {},
};
