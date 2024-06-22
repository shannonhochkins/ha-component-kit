import type { Meta, StoryObj, Args } from "@storybook/react";
import { ThemeProvider, ClimateCard, Row } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Render(args?: Args) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider includeThemeControls />
      <Row gap="2rem">
        <ClimateCard entity={"climate.air_conditioner"} {...args} />
        <ClimateCard layoutType="slim-vertical" hvacModes={["cool", "heat"]} entity={"climate.air_conditioner"} {...args} />
        <ClimateCard layoutType="slim" entity={"climate.air_conditioner"} {...args} />
      </Row>
    </HassConnect>
  );
}

function TempRender(args?: Args) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider includeThemeControls />
      <Row gap="2rem">
        <ClimateCard showTemperatureControls entity={"climate.air_conditioner"} {...args} />
        <ClimateCard
          showTemperatureControls
          layoutType="slim-vertical"
          hvacModes={["cool", "heat"]}
          entity={"climate.air_conditioner"}
          {...args}
        />
        <ClimateCard showTemperatureControls layoutType="slim" entity={"climate.air_conditioner"} {...args} />
      </Row>
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Cards/ClimateCard",
  component: ClimateCard,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof ClimateCard>;
export type ClimateStory = StoryObj<typeof ClimateCard>;
export const ClimateCardExample: ClimateStory = {
  render: Render,
  args: {
    entity: "climate.air_conditioner",
  },
};

export const ClimateWithTemperatureControlsExample: ClimateStory = {
  render: TempRender,
  args: {
    entity: "climate.air_conditioner",
  },
};

export const ClimateCardWithCustomHvacExample: ClimateStory = {
  render: Render,
  args: {
    entity: "climate.air_conditioner",
    hvacModes: ["heat", "cool", "off"],
  },
};

export const ClimateCardUnavailableExample: ClimateStory = {
  render: Render,
  args: {
    entity: "climate.unavailable",
  },
};
