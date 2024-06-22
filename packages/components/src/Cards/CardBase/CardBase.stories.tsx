import type { Meta, StoryObj, Args } from "@storybook/react";
import { ThemeProvider, CardBase, Column } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Render(args?: Args) {
  return (
    <HassConnect hassUrl="https://homeassistant.local:8123">
      <ThemeProvider includeThemeControls />
      <Column gap="1rem" fullWidth>
        <CardBase {...args}>
          <div
            style={{
              padding: "2rem",
            }}
          >
            IM AN EMPTY SHELL!
          </div>
        </CardBase>
      </Column>
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Cards/CardBase",
  component: CardBase,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof CardBase>;
export type LightStory = StoryObj<typeof CardBase>;
export const Example: LightStory = {
  render: Render,
  args: {},
};
