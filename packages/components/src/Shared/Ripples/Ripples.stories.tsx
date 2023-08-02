import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, Ripples } from "@components";
import type { RipplesProps } from "@components";

function Template({
  duration,
  color,
  onClick,
  borderRadius,
  className,
}: RipplesProps): JSX.Element {
  return (
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
      <div
        style={{
          overflow: "hidden",
          padding: 40,
          borderRadius: "20px",
          backgroundColor: "var(--ha-primary-background)",
          textAlign: "center",
        }}
      >
        CLICK ME
      </div>
    </Ripples>
  );
}

export default {
  title: "COMPONENTS/Shared/Ripples",
  component: Ripples,
  tags: ["autodocs"],
  parameters: {
    centered: true
  },
  argTypes: {},
} satisfies Meta<typeof Ripples>;
export type TimeStory = StoryObj<typeof Ripples>;
export const RipplesExample: TimeStory = {
  render: Template,
  args: {
    borderRadius: "20px",
  },
};
