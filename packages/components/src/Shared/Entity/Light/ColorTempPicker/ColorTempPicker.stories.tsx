import { useRef, useCallback } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, Column, ColorTempPicker, ButtonCard } from "@components";
import type { ColorTempPickerProps, ColorPickerOutputColors } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Template(args?: Partial<ColorTempPickerProps>) {
  const valueRef = useRef<HTMLDivElement>(null);
  const updateText = useCallback((kelvin: number, { hex, hs, rgb }: ColorPickerOutputColors) => {
    if (valueRef.current) {
      valueRef.current.innerText = `${kelvin}k, HEX: ${hex} | HS: [${(hs || []).map(Math.round).join(", ")}] | RBB: [${(rgb || [])
        .map(Math.round)
        .join(", ")}]`;
      valueRef.current.style.color = hex;
    }
  }, []);

  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider includeThemeControls />
      <Column gap={"1rem"} fullWidth>
        <ColorTempPicker entity={"light.fake_light_1"} {...args} onChangeApplied={updateText} onChange={updateText} />
        <span ref={valueRef}>3000k</span>
        <ButtonCard entity={"light.fake_light_1"} service="toggle" />
      </Column>
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Shared/Entity/Light/ColorTempPicker",
  component: ColorTempPicker,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof ColorTempPicker>;
export type TimeStory = StoryObj<typeof ColorTempPicker>;
export const ColorTempPickerExample: TimeStory = {
  render: Template,
  args: {},
};
