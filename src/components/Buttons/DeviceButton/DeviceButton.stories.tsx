import { Story, Source, Title, Description } from "@storybook/blocks";
import { ArgsTable } from '@storybook/addon-docs';
import type { Meta, StoryObj, Args } from "@storybook/react";
import { DeviceButton } from "./";
import { ThemeProvider } from '../../ThemeProvider';
import { HassConnect } from '../../HassConnect';

function Template(args: Args) {
  return (
    <div>
        <h2>DeviceButton</h2>
        <p></p>
        <ThemeProvider />
        <DeviceButton domain="light" service="toggle" entity="light.light_office_downlight_1" />
        <Source code={`<DeviceButton domain="light" service="toggle" target="light.light_office_downlight_1" />`} language="tsx" />
    </div>
  );
}

const Page = () => (<>
  <Title />
  <Description />
  <h2>Component Props</h2>
  <ArgsTable of={DeviceButton} />
</>);

export default {
  title: "COMPONENTS/Buttons/DeviceButton",
  component: Template,
  parameters: {
    layout: "centered",
    width: "100%",
    docs: {
      description: {
          component:
              '`<DeviceButton />` TODO'
      },
      page: Page
  }
  },
  args: {
    
  },
  argTypes: {
    
  }
} satisfies Meta<typeof Template>;

export type Story = StoryObj<typeof DeviceButton>;

export const Playground = Template.bind({});
