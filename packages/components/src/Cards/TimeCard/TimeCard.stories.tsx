import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeProvider, Row, TimeCard, ThemeControlsModal, Alert } from "@components";
import type { TimeCardProps } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Template(args?: Partial<TimeCardProps>) {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <ThemeProvider />
      <ThemeControlsModal />
      <Row gap="1rem">
        <TimeCard {...args} />
        <TimeCard timeFormat="hh:mm:ss A" dateFormat={"MMM DD"} {...args} />
        <TimeCard
          timeFormat={(date) => {
            return <span>Time: {date.toLocaleTimeString().replace(/:/g, "-")}</span>;
          }}
          hideDate
        />
      </Row>
      <Alert
        type="warning"
        style={{
          marginTop: "2rem",
        }}
      >
        <p>
          Time or Date sensor is not needed to use this card, by default it will use the local clock values from the machine running the
          instance.
        </p>
        <p>
          If you want to use sensors from home assistant you can follow the guide below, the difference being there&apos;s no need to
          perform formatting or updates as updates are emitted from home assistant instead of tracking the time differences with react.
        </p>
        <p>
          To add custom entities, you can follow the guide{" "}
          <a href="https://www.home-assistant.io/integrations/time_date/" target="_blank" rel="noreferrer">
            here
          </a>
          .
        </p>
      </Alert>
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
  },
} satisfies Meta<typeof TimeCard>;
export type TimeStory = StoryObj<typeof TimeCard>;
export const Docs: TimeStory = {
  render: Template,
  args: {},
  parameters: {
    docs: {
      source: {
        // language: 'graphql',
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
