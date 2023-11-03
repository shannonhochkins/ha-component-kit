import { Story, Source } from "@storybook/blocks";
import type { Meta, StoryObj } from "@storybook/react";
import { HassConnect } from '@hass-connect-fake';
import {
  ThemeProvider,
  Row,
  Column,
  ButtonCard,
  Group,
  useBreakpoint,
} from '@components';
import { css, Global } from "@emotion/react";
// @ts-expect-error - Don't have types for jsx-to-string
import jsxToString from "jsx-to-string";

function ResponsiveGroupsExample() {
  return <Row fullWidth  justifyContent="flex-start" alignItems="stretch" gap="1rem">
    <Group
      sm={6}
      md={6}
      lg={6}
      xlg={6}
      title="Button Card"
      justifyContent="flex-start"
      alignItems="stretch">
      <ButtonCard id="default" entity="light.fake_light_1" service="toggle" sm={6} md={4} lg={4} xlg={3} />
      <ButtonCard id="default" entity="light.fake_light_2" service="toggle" icon="mdi:power" sm={6} md={4} lg={4} xlg={3} />
      <ButtonCard id="default" entity="light.fake_light_3" service="toggle" sm={6} md={4} lg={4} xlg={3}/>
    </Group>
    <Group
      sm={6}
      md={6}
      lg={6}
      xlg={6}
      title="ButtonCard"
      justifyContent="flex-start"
      alignItems="stretch">
      <ButtonCard id="slim" defaultLayout="slim" entity="light.fake_light_1" service="toggle" sm={6} md={6} lg={4} xlg={4} />
      <ButtonCard id="slim" defaultLayout="slim" entity="light.fake_light_2" service="toggle" sm={6} icon="mdi:power" md={6} lg={4} xlg={4} />
      <ButtonCard id="slim" defaultLayout="slim" entity="light.fake_light_3" service="toggle" sm={6} md={6} lg={4} xlg={4} />
    </Group>
  </Row>;
}

function ButtonsDifferentSizes() {
  return <Row fullWidth  justifyContent="flex-start" alignItems="stretch" gap="1rem">
    <Group
      title="Button Card"
      justifyContent="flex-start"
      alignItems="stretch">
      <ButtonCard id="default" entity="light.fake_light_1" service="toggle" sm={3} md={6} lg={6} xlg={6} />
      <ButtonCard id="default" entity="light.fake_light_2" service="toggle" icon="mdi:power" sm={6} md={3} lg={3} xlg={4} />
      <ButtonCard id="default" entity="light.fake_light_3" service="toggle" sm={3} md={3} lg={5} xlg={2}/>
    </Group>
  </Row>;
}


function Template() {
  const device = useBreakpoint();
  return <Row fullWidth wrap="nowrap" fullHeight alignItems="stretch">
    <Column fullWidth gap="1rem" wrap="nowrap" alignItems="flex-start" justifyContent="flex-start" style={{
      padding: device.xxs || device.xs ? '1rem' : '2rem',
      overflowY: 'auto',
    }}>
      <h2>Responsive Layouts</h2>
      <p>You can specify individual card sizes by providing the breakpoint props to any card!</p>
      <p>Every card has default properties assigned and should flow nicely by default, however they're designed in a way expecting the parent container to be full width of the screen, so if you want a panel that should have half of the screen width for desktop, and full sized for mobile, here's how you can achieve that!</p>
      <p>NOTE: If you want to know what breakpoints are currently active, you can inspect the body of the document, and you should see a `bp-md, or bp-sm` etc class added to the element.</p>
      <p>The default breakpoint values are also configurable from the `ThemeProvider` under the property `breakpoints`.</p>
      <ResponsiveGroupsExample />
      <p>Full source of the above demo:</p>
      <Source
        dark
        code={jsxToString(ResponsiveGroupsExample(), {
          useFunctionCode: true,
        })}
      />
      <p>This means you can resize anything, to any expected 12 column layout, where some buttons, you want wider than others, try resizing the browser to see the effect and see the cards swapping sizes!</p>
      <ButtonsDifferentSizes />
      <p>Full source of the above demo:</p>
      <Source
        dark
        code={jsxToString(ButtonsDifferentSizes(), {
          useFunctionCode: true,
        })}
      />
    </Column>
  </Row>
}

function Connector() {
  return <HassConnect hassUrl="https://homeassistant.local:8123">
    <ThemeProvider includeThemeControls darkMode={true} />
    <Global styles={css`
      .docblock-source.sb-unstyled {
        width: 100%;
        overflow: initial;
      }
    `} />  
    <Template />
  </HassConnect>
}

export default {
  title: "INTRODUCTION/Responsive Layouts",
  parameters: {
    standalone: true,
    addons: {
      showPanel: false,
    },
    docs: {
      description: {
        component: `@hakit provides a series of tools to easily authenticate and communicate with your home assistant instance from React!`
      }
    }
  },
} satisfies Meta;

export type Story = StoryObj<typeof Connector>;

export const Default = Connector.bind({});