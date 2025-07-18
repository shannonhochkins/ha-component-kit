import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeProvider, Ripples, ThemeControlsModal } from "@components";
import type { RipplesProps } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Template({ duration, color, onClick, borderRadius, className }: RipplesProps) {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <Ripples
        {...{
          duration,
          color,
          onClick,
          borderRadius,
          className,
        }}
      >
        <ThemeProvider />
        <ThemeControlsModal />
        <div
          style={{
            overflow: "hidden",
            padding: 40,
            borderRadius: "20px",
            backgroundColor: "var(--ha-S200)",
            textAlign: "center",
          }}
        >
          CLICK ME
        </div>
      </Ripples>
    </HassConnect>
  );
}

export default {
  title: "components/Shared/Ripples",
  component: Ripples,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
  argTypes: {},
} satisfies Meta<typeof Ripples>;
export type TimeStory = StoryObj<typeof Ripples>;
export const Docs: TimeStory = {
  render: Template,
  args: {
    borderRadius: "20px",
  },
};
