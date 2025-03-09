import { HassConnect } from "hass-connect-fake";
import { Story } from "@storybook/blocks";
import type { Meta, StoryObj } from "@storybook/react";
import { Component } from "./basic.code";
import { ThemeProvider, FabCard } from "@hakit/components";
import { useHass } from "@hakit/core";
import { Column, Row } from "@components";

function ShutDown() {
  const { useStore } = useHass();
  const setConfig = useStore((state) => state.setConfig);
  const config = useStore((state) => state.config);

  if (!config) return null;
  // This example code here will not actually trigger the shutdown in a real world scenario
  // This is just to emulate the behavior of a real world scenario
  return (
    <Row gap="1rem">
      <FabCard
        cssStyles={`width: 200px`}
        onClick={() => {
          setConfig({ ...config, state: "STOPPING" });
          setTimeout(() => setConfig({ ...config, state: "NOT_RUNNING" }), 1000);
        }}
        icon="mdi:power"
      >
        POWER OFF
      </FabCard>
      <FabCard
        cssStyles={`width: 200px`}
        onClick={() => {
          setConfig({ ...config, state: "STARTING" });
          setTimeout(() => setConfig({ ...config, state: "RUNNING" }), 1000);
        }}
        icon="mdi:power"
      >
        POWER UP
      </FabCard>
    </Row>
  );
}

function Primary() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <ThemeProvider />
      <Column gap="1rem">
        <ShutDown />
        <Component />
      </Column>
    </HassConnect>
  );
}

const meta: Meta<typeof Primary> = {
  component: Primary,
};

export default meta;
type Story = StoryObj<typeof Primary>;

export const PrimaryExample: Story = {
  args: {
    label: "PrimaryExample",
  },
  /*
   * All stories in this file will:
   * - NOT be included in the docs page
   * - Not appear in Storybook's sidebar
   */
  tags: ["!dev", '!autodocs'],
  parameters: {
    docs: {
      canvas: {
        sourceState: "none",
      },
    },
  },
};
