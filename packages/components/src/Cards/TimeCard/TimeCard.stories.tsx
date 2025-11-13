import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeProvider, Row, Column, TimeCard, ThemeControlsModal, Alert } from "@components";
import type { TimeCardProps } from "@components";
import { HassConnect } from "@hass-connect-fake";
import { Component } from "./examples/customFormatter.code";
import CustomFormatter from "./examples/customFormatter.code?raw";
import { Source } from "@storybook/addon-docs/blocks";

function Template(args?: Partial<TimeCardProps>) {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <ThemeProvider />
      <ThemeControlsModal />
      <Row gap="1rem">
        <TimeCard {...args} />
        <TimeCard timeFormat="hh:mm:ss A" dateFormat={"MMM DD"} {...args} />
      </Row>
    </HassConnect>
  );
}

function WithoutDate(args?: Partial<TimeCardProps>) {
  return (
    <div>
      <h2>TimeCard without the date</h2>
      <Template hideDate {...args} />
    </div>
  );
}

export default {
  title: "components/Cards/TimeCard",
  component: TimeCard,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
    afterPrimary: (
      <HassConnect
        hassUrl="http://homeassistant.local:8123"
        wrapperProps={{
          style: {
            height: "auto",
          },
        }}
        loading={null}
      >
        <ThemeProvider />
        <Alert
          type="warning"
          style={{
            marginTop: "2rem",
            marginBottom: "2rem",
          }}
        >
          <p>
            By default this card will render time and date using your Home Assistant instance preferences (timezone, language, date/time
            format). If the <code>sensor.time</code> and <code>sensor.date</code> entities exist they drive updates directly via websocket
            events.
          </p>
          <p>
            If those entities are missing or you supply <code>timeFormat</code>/<code>dateFormat</code> props, the card falls back to a
            local ticking clock for the underlying Date object but still formats output using the Home Assistant locale & timezone so it
            matches the rest of your UI.
          </p>
          <p>
            To enable the time/date entities (optional) see the guide{" "}
            <a href="https://www.home-assistant.io/integrations/time_date/" target="_blank" rel="noreferrer">
              here
            </a>
            . Custom formats bypass the entity values but retain HA formatting context; no manual locale/timezone wiring needed.
          </p>
        </Alert>
        <Column alignItems="flex-start" justifyContent="flex-start" gap="1rem">
          <h3>Custom Formatter Example</h3>
          <Component />
          <h2>Example Code from above</h2>
          <Source dark language="typescript" code={CustomFormatter.replace("@hass-connect-fake", "@hakit/core")} />
        </Column>
      </HassConnect>
    ),
  },
} satisfies Meta<typeof TimeCard>;
export type TimeStory = StoryObj<typeof TimeCard>;
export const Docs: TimeStory = {
  render: Template,
  args: {},
  parameters: {
    docs: {
      source: {
        dark: false,
        excludeDecorators: false,
      },
    },
  },
};

export const WithoutDateExample: TimeStory = {
  render: WithoutDate,
  args: {},
};
