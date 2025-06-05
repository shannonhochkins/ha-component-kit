import type { Meta, StoryObj, Args } from "@storybook/react-vite";
import { ThemeProvider, CardBase, Column, ThemeControlsModal } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Render(args?: Args) {
  return (
    <HassConnect hassUrl="https://homeassistant.local:8123">
      <ThemeProvider />
      <ThemeControlsModal />
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
  title: "components/Cards/CardBase",
  component: CardBase,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof CardBase>;
export type LightStory = StoryObj<typeof CardBase>;
export const Docs: LightStory = {
  render: Render,
  args: {},
};
