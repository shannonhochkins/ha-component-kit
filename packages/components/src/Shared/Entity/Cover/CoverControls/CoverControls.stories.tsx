import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeProvider, CoverControls, Row, ThemeControlsModal } from "@components";
import type { CoverControlsProps } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Template(args?: Partial<CoverControlsProps>) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <ThemeControlsModal />
      <Row gap="5rem" fullWidth alignItems="flex-start">
        <CoverControls entity="cover.cover_with_tilt" {...args} />
        <CoverControls entity="cover.cover_position_only" {...args} />
        <CoverControls entity="cover.cover_no_position" {...args} />
      </Row>
    </HassConnect>
  );
}

export default {
  title: "components/Shared/Entity/Cover/CoverControls",
  component: CoverControls,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof CoverControls>;
export type TimeStory = StoryObj<typeof CoverControls>;
export const Docs: TimeStory = {
  render: Template,
  args: {},
};
