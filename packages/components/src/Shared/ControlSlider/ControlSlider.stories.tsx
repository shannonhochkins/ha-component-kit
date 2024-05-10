import { useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, ControlSlider, Row, Column } from "@components";
import type { ControlSliderProps } from "@components";
import { HassConnect } from "@hass-connect-fake";

interface SliderProps {
  value: number;
  thickness: number;
  ref: React.RefObject<HTMLDivElement>;
  sliderColor?: [number, number, number];
}

function Template(args?: Partial<ControlSliderProps>) {
  const slider1Ref = useRef<HTMLDivElement>(null);
  const slider2Ref = useRef<HTMLDivElement>(null);
  const slider3Ref = useRef<HTMLDivElement>(null);
  const slider4Ref = useRef<HTMLDivElement>(null);

  const sliders = [
    {
      value: 5,
      thickness: 45,
      ref: slider1Ref,
    },
    {
      value: 50,
      thickness: 70,
      ref: slider2Ref,
      sliderColor: [240, 59, 59],
    },
    {
      value: 70,
      thickness: 100,
      ref: slider3Ref,
      sliderColor: [59, 240, 60],
    },
    {
      value: 85,
      thickness: 150,
      ref: slider4Ref,
      sliderColor: [59, 60, 240],
    },
  ] satisfies SliderProps[];
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider includeThemeControls />
      <Row gap={"1rem"} fullWidth>
        {sliders.map(({ value, thickness, sliderColor, ref }, index) => (
          <Column key={index} gap="0.5rem">
            <ControlSlider
              thickness={thickness}
              sliderColor={sliderColor}
              value={value}
              {...args}
              onChange={(value) => {
                if (ref.current) ref.current.innerText = Math.round(value).toString() + "%";
              }}
              onChangeApplied={(value) => {
                if (ref.current) ref.current.innerText = Math.round(value).toString() + "%";
              }}
            />
            <span ref={ref}>{args?.disabled ? "disabled" : `${value}%`}</span>
          </Column>
        ))}
      </Row>
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Shared/ControlSlider",
  component: ControlSlider,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof ControlSlider>;
export type TimeStory = StoryObj<typeof ControlSlider>;
export const ControlSliderExample: TimeStory = {
  render: Template,
  args: {},
};
