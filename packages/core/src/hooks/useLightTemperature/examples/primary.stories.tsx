import { HassConnect } from 'hass-connect-fake';
import { Story } from "@storybook/blocks";
import type { Meta, StoryObj } from "@storybook/react";
import { Dashboard } from './basic.code';
import { ThemeProvider } from '@hakit/components';

function Primary() {
  return <HassConnect hassUrl="http://homeassistant.local:8123">
    <ThemeProvider />
    <Dashboard />
  </HassConnect>
}

const meta: Meta<typeof Primary> = {
  component: Primary,
};

export default meta;
type Story = StoryObj<typeof Primary>;
 
export const PrimaryExample: Story = {
  args: {
    label: 'PrimaryExample',
  },
  parameters: {
    docs: {
      canvas: {
        sourceState: "none",
      }
    }
  }
};
