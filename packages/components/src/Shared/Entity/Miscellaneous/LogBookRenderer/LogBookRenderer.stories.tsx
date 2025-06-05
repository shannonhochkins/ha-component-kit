import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeProvider, LogBookRenderer, ThemeControlsModal } from "@components";
import type { LogBookRendererProps } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Template(args?: Partial<LogBookRendererProps>) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <ThemeControlsModal />
      <LogBookRenderer {...args} entity="light.fake_light_1" />
    </HassConnect>
  );
}

export default {
  title: "components/Shared/Entity/Miscellaneous/LogBookRenderer",
  component: LogBookRenderer,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof LogBookRenderer>;
export type TimeStory = StoryObj<typeof LogBookRenderer>;
export const Docs: TimeStory = {
  render: Template,
  args: {},
};
