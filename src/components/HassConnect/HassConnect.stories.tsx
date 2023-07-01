import { Story, Source, Title, Description } from "@storybook/blocks";
import { ArgsTable } from '@storybook/addon-docs';
import type { Meta, StoryObj } from "@storybook/react";
import { HassConnect } from "./";


const Page = () => (<>
  <Title />
  <Description />
  <h2>Component Props</h2>
  <ArgsTable of={HassConnect} />
</>);

function Template() {
  return (
    <div>
        <h2>How to connect</h2>
        <p>This is a top level component that takes care of the Authentication logic for you and all you have to do is login like you normally would.</p>
        <i><b>Note: </b>You will have to login on each device as HassConnect will store tokens per device.</i>

        <h2>Example Usage</h2>
        <Source code={`<HassConnect hassUrl="http://localhost:1234" fallback={<>Loading...</>}>\n\t<div>Will render once connected and authenticated</div>\n</HassConnect>`} />
    </div>
  );
}

export default {
  title: "COMPONENTS/HassConnect",

  component: Template,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `This component will show the Home Assistant login form you're used to seeing normally when logging into HA, once logged in you shouldn't see
        this again unless you clear device storage, once authenticated it will render the child components of HassConnect and provide access to the api.
        `
      },
      page: Page
    }
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

export const Playground = Template.bind({});
