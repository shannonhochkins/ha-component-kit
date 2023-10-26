import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, PreloadImage } from "@components";
import type { PreloadImageProps } from "@components";
import { HassConnect } from "@hass-connect-fake";
import image from "./living-room.jpg";

function Template(args?: Partial<PreloadImageProps>) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider includeThemeControls />
      <PreloadImage
        {...args}
        src={image}
        lazy
        cssStyles={`
          width: 400px;
          aspect-ratio: 16 / 9;
        `}
      />
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Shared/PreloadImage",
  component: PreloadImage,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof PreloadImage>;
export type TimeStory = StoryObj<typeof PreloadImage>;
export const Example: TimeStory = {
  render: Template,
  args: {},
};
