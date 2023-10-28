import { useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, LogBookRenderer, Row, Column } from "@components";
import type { LogBookRendererProps } from "@components";
import { HassConnect } from "@hass-connect-fake";


function Template(args?: Partial<LogBookRendererProps>) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider includeThemeControls />
      <LogBookRenderer entity="light.fake_light_1" />
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Shared/LogBookRenderer",
  component: LogBookRenderer,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof LogBookRenderer>;
export type TimeStory = StoryObj<typeof LogBookRenderer>;
export const LogBookRendererExample: TimeStory = {
  render: Template,
  args: {},
};
