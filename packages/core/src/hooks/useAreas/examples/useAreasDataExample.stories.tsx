import { HassConnect } from "hass-connect-fake";
import { Story } from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Component } from "./useAreasData.code";
import { ThemeProvider } from "@hakit/components";

function UseFloorsData() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <ThemeProvider />
      <Component />
    </HassConnect>
  );
}

const meta: Meta<typeof UseFloorsData> = {
  component: UseFloorsData,
};

export default meta;
type Story = StoryObj<typeof UseFloorsData>;

export const PrimaryExampleData: Story = {
  args: {
    label: "PrimaryExampleData",
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
