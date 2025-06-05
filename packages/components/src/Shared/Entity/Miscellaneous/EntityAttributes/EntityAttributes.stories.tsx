import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeProvider, EntityAttributes, Row, ThemeControlsModal } from "@components";
import type { EntityAttributesProps } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Template(args?: Partial<EntityAttributesProps>) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <ThemeControlsModal />
      <Row gap="5rem" fullWidth>
        <EntityAttributes entity="cover.cover_with_tilt" {...args} />
      </Row>
    </HassConnect>
  );
}

export default {
  title: "components/Shared/Entity/Miscellaneous/EntityAttributes",
  component: EntityAttributes,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof EntityAttributes>;
export type TimeStory = StoryObj<typeof EntityAttributes>;
export const Docs: TimeStory = {
  render: Template,
  args: {},
};
