import { HassConnect } from "hass-connect-fake";
import { ThemeProvider } from "@hakit/components";
import { Story } from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Dashboard } from "./basic.code";

function Primary() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <ThemeProvider />
      <Dashboard />
    </HassConnect>
  );
}

const meta: Meta<typeof Primary> = {
  component: Primary,
};

export default meta;
type Story = StoryObj<typeof Primary>;

export const PrimaryExample: Story = {
  args: {
    label: "PrimaryExample",
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
