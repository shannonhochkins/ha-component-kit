import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, ControlSliderCircular, Row } from "@components";
import type { ControlSliderCircularProps } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Template(args?: Partial<ControlSliderCircularProps>) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider includeThemeControls />
      <Row gap={"1rem"} fullWidth>
        <ControlSliderCircular
          current={20}
          dual={true}
          low={10}
          high={30}
          label="xx"
          min={6}
          max={36}
          value={24}
          disabled={false}
          {...args}
          onChange={(value) => {
            console.log("onChange", value);
          }}
          onChangeApplied={(value) => {
            console.log("onChangeApplied", value);
          }}
        />
      </Row>
    </HassConnect>
  );
}

export default {
  title: "components/Shared/ControlSliderCircular",
  component: ControlSliderCircular,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof ControlSliderCircular>;
export type TimeStory = StoryObj<typeof ControlSliderCircular>;
export const ControlSliderCircularExample: TimeStory = {
  render: Template,
  args: {},
};
