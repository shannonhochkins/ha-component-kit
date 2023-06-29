import { Story } from "@storybook/blocks";
import type { Meta, StoryObj } from "@storybook/react";
import { HassConnect } from "./";

export default {
  title: "COMPONENTS/HassConnect",
  component: HassConnect,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    hassUrl: {
      control: false,
    },
    children: {
      control: false,
    },
    fallback: {
      control: false,
    },
  },
} satisfies Meta<typeof HassConnect>;

export type Story = StoryObj<typeof HassConnect>;

export const Default = HassConnect.bind({});
