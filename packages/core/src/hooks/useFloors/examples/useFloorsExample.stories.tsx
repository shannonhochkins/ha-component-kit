import { HassConnect } from "hass-connect-fake";
import { Story } from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Component } from "./basic.code";
import { ThemeProvider } from "@hakit/components";

function UseFloors() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <ThemeProvider />
      <Component />
    </HassConnect>
  );
}

const meta: Meta<typeof UseFloors> = {
  component: UseFloors,
};

export default meta;
type Story = StoryObj<typeof UseFloors>;

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
