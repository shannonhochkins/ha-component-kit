import { Source } from "@storybook/blocks";
import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, ThermostatCard } from "ha-component-kit";
import { HassConnect } from "@stories/HassConnectFake";
// @ts-expect-error - Don't have types for jsx-to-string
import jsxToString from "jsx-to-string";

function Template() {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <ThermostatCard entity="climate.air_conditioner" />
    </HassConnect>
  );
}

function ExampleDocs() {
  return (
    <div>
      <h2>ThermostatCard</h2>
      <p>WIP</p>
      <Template />
      <h3>Source Code</h3>
      <Source code={jsxToString(Template())} />
    </div>
  );
}

function Render() {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <ThermostatCard entity="climate.air_conditioner" />
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Cards/ThermostatCard",
  component: ThermostatCard,
  tags: ["autodocs"],
  parameters: {
    width: "100%",
  },
} satisfies Meta<typeof ThermostatCard>;
export type Story = StoryObj<typeof ThermostatCard>;
export const Example: Story = {
  render: Render,
  args: {
    entity: "climate.air_conditioner",
  },
};

export type DetailedStory = StoryObj<typeof ExampleDocs>;
export const DetailedExample: DetailedStory = {
  render() {
    return <ExampleDocs />;
  },
};
