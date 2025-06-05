import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeProvider, Menu, Row, FabCard, ThemeControlsModal } from "@components";
import type { MenuProps } from "@components";
import { HassConnect } from "@hass-connect-fake";
import { useState } from "react";

function Template(args?: Partial<MenuProps>) {
  const [value, setValue] = useState("high");
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <ThemeControlsModal />
      <Row
        gap={"1rem"}
        fullWidth
        style={{
          minHeight: 300,
        }}
      >
        <Menu
          {...args}
          placement="top"
          items={[
            {
              label: "High",
              icon: "mdi:fan-speed-3",
              active: value === "high",
              onClick: () => setValue("high"),
            },
            {
              label: "Medium",
              icon: "mdi:fan-speed-2",
              active: value === "medium",
              onClick: () => setValue("medium"),
            },
            {
              label: "Low",
              icon: "mdi:fan-speed-1",
              active: value === "low",
              onClick: () => setValue("low"),
            },
          ]}
        >
          <FabCard icon={value === "low" ? "mdi:fan-speed-1" : value === "high" ? "mdi:fan-speed-3" : "mdi:fan-speed-2"} />
        </Menu>
        <Menu
          {...args}
          placement="top"
          items={[
            {
              label: "High",
              icon: "mdi:fan-speed-3",
              active: value === "high",
              onClick: () => setValue("high"),
            },
            {
              label: "Medium",
              icon: "mdi:fan-speed-2",
              active: value === "medium",
              onClick: () => setValue("medium"),
            },
            {
              label: "Low",
              icon: "mdi:fan-speed-1",
              active: value === "low",
              onClick: () => setValue("low"),
            },
          ]}
        >
          <FabCard icon={value === "low" ? "mdi:fan-speed-1" : value === "high" ? "mdi:fan-speed-3" : "mdi:fan-speed-2"}>FAN SPEED</FabCard>
        </Menu>
      </Row>
    </HassConnect>
  );
}

export default {
  title: "components/Shared/Menu",
  component: Menu,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof Menu>;
export type TimeStory = StoryObj<typeof Menu>;
export const Docs: TimeStory = {
  render: Template,
  args: {},
};
