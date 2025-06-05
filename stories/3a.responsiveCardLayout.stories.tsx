import { Story, Source } from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { HassConnect } from '@hass-connect-fake';
import {
  ThemeProvider,
  Row,
  ButtonCard,
  useBreakpoint,
} from '@components';


export default {
  title: "INTRODUCTION/Responsive Layouts/Dynamic Card Width",
  component: Render,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `Every available card can change it's width dynamically by the determined active breakpoint, or you can simply have different sized cards on the same breakpoint.`
      }
    },
    hideComponentProps: true,
    afterPrimary: <>
    <p>Note: If you want all buttons to align on a single row, you&apos;ll need each number provided to the breakpoint to add up to 12 as there&apos;s 12 precalculated &quot;columns&quot;, for example or one row and 3 buttons, you&apos;ll need: md={3} md={6} md={3}</p>
      <Source dark code={`
function DynamicCardWidth() {
  return <HassConnect hassUrl="https://homeassistant.local:8123">
    <ThemeProvider />
    <Row fullWidth gap="1rem">
      <ButtonCard id="default" entity="light.fake_light_1" service="toggle" xs={12} sm={6} md={3} lg={4} xlg={2} />
      <ButtonCard id="default" entity="light.fake_light_1" service="toggle" xs={12} sm={6} md={6} lg={4} xlg={6} />
      <ButtonCard id="default" entity="light.fake_light_1" service="toggle" xs={12} sm={12} md={3} lg={4} xlg={4} />
    </Row>
  </HassConnect>
}        
`} />
    </>
  },
} satisfies Meta;

export type Story = StoryObj;
export const Docs: Story = {
  args: {},
};

function Render() {
  return <Connector>
    <DynamicCardWidth />
  </Connector>;
}

function Connector({ children }: {
  children: React.ReactNode;
}) {
  return <HassConnect hassUrl="https://homeassistant.local:8123">
    {children}
  </HassConnect>
}


function DynamicCardWidth() {
  const activeBreakpoint = useBreakpoint();
  return <>
    <ThemeProvider />
    <p><b>TIP: </b>Resize your browser to see the layout change!</p>
    <Source dark code={`// active breakpoint values from the \`useBreakpoint\` hook:\n${JSON.stringify(activeBreakpoint, null, 2)}`} />
    <Row fullWidth gap="1rem">
      <ButtonCard id="default" entity="light.fake_light_1" service="toggle" xs={12} sm={6} md={3} lg={4} xlg={2} />
      <ButtonCard id="default" entity="light.fake_light_1" service="toggle" xs={12} sm={6} md={6} lg={4} xlg={6} />
      <ButtonCard id="default" entity="light.fake_light_1" service="toggle" xs={12} sm={12} md={3} lg={4} xlg={4} />
    </Row>
  </>
}
