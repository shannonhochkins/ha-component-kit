import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, RangeSlider } from "@components";
import type { RangeSliderProps } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Template(props: RangeSliderProps): JSX.Element {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <ThemeProvider includeThemeControls />
      <RangeSlider
        {...props}
        style={{
          width: "100%",
          maxWidth: "12rem",
        }}
      />
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Shared/RangeSlider",
  component: RangeSlider,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
  argTypes: {},
} satisfies Meta<typeof RangeSlider>;
export type TimeStory = StoryObj<typeof RangeSlider>;
export const RangeSliderExample: TimeStory = {
  render: Template,
  args: {
    min: 0,
    max: 1000,
    value: 200,
    step: 2,
  },
};
