import type { Meta, StoryObj, Args } from "@storybook/react";
import { ThemeProvider, ClimateControls, Row } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Render(args?: Args) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider includeThemeControls />
      <Row gap="1rem" fullHeight fullWidth>
        <ClimateControls {...args} entity="climate.air_conditioner" />
      </Row>
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Shared/Entity/Climate/ClimateControls",
  component: ClimateControls,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof ClimateControls>;
export type ClimateStory = StoryObj<typeof ClimateControls>;
export const ClimateControlsExample: ClimateStory = {
  render: Render,
  args: {
    entity: "climate.air_conditioner",
  },
};
