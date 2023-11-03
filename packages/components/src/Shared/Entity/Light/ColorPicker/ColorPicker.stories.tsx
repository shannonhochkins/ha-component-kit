import { useRef, useCallback } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, Column, ColorPicker, ButtonCard } from "@components";
import type { ColorPickerProps, ColorPickerOutputColors } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Template(args?: Partial<ColorPickerProps>) {
  const valueRef = useRef<HTMLDivElement>(null);
  const updateText = useCallback(({ hex, hs, rgb }: ColorPickerOutputColors) => {
    if (valueRef.current && hex) {
      valueRef.current.innerText = `HEX: ${hex} | HS: [${(hs || []).map(Math.round).join(", ")}] | RBB: [${(rgb || [])
        .map(Math.round)
        .join(", ")}]`;
      valueRef.current.style.color = hex;
    }
  }, []);

  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider includeThemeControls />
      <Column gap={"1rem"} fullWidth>
        <ColorPicker entity="light.fake_light_1" {...args} onChangeApplied={updateText} onChange={updateText} />
        <span ref={valueRef}></span>
        <ButtonCard entity={"light.fake_light_1"} service="toggle" />
      </Column>
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Shared/Entity/Light/ColorPicker",
  component: ColorPicker,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof ColorPicker>;
export type TimeStory = StoryObj<typeof ColorPicker>;
export const ColorPickerExample: TimeStory = {
  render: Template,
  args: {},
};
