import { HassConnect } from "hass-connect-fake";
import { Story } from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { HelperFunctionsExample } from "./helperFunctions.code";
import { ThemeProvider } from "@hakit/components";

function Helpers() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <ThemeProvider />
      <HelperFunctionsExample />
    </HassConnect>
  );
}

const meta: Meta<typeof Helpers> = {
  component: Helpers,
};

export default meta;
type Story = StoryObj<typeof Helpers>;

export const HelpersExample: Story = {
  args: {
    label: "HelpersExample",
  },
  /*
   * All stories in this file will:
   * - NOT be included in the docs page
   * - Not appear in Storybook's sidebar
   */
  tags: ["!dev", "!autodocs"],
  parameters: {
    docs: {
      canvas: {
        sourceState: "none",
      },
    },
  },
};
