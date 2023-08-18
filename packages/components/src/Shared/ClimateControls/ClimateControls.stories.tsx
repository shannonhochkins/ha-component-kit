import type { Meta, StoryObj, Args } from "@storybook/react";
import {
  ThemeProvider,
  ClimateControls,
  Row,
} from "@components";
import { HassConnect } from "@stories/HassConnectFake";

function Render(args?: Args) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <Row gap="1rem" fullHeight fullWidth>
        <ClimateControls {...args} entity="climate.air_conditioner" />
      </Row>
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Shared/ClimateControls",
  component: ClimateControls,
  tags: ["autodocs"],
  parameters: {
    centered: true,
  },
} satisfies Meta<typeof ClimateControls>;
export type ClimateStory = StoryObj<typeof ClimateControls>;
export const ClimateControlsExample: ClimateStory = {
  render: Render,
  args: {
    entity: "climate.air_conditioner",
  },
};