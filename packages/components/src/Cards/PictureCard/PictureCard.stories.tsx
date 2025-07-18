import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeProvider, PictureCard, ThemeControlsModal } from "@components";
import type { PictureCardProps } from "@components";
import { HassConnect } from "@hass-connect-fake";
import office from "./office.jpg";

function Template(args: PictureCardProps) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <ThemeControlsModal />
      <PictureCard {...args} />
    </HassConnect>
  );
}

export default {
  title: "components/Cards/PictureCard",
  component: PictureCard,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
  argTypes: {
    title: { control: "text" },
    image: { control: "text" },
  },
} satisfies Meta<typeof PictureCard>;
export type PictureCardStory = StoryObj<typeof PictureCard>;
export const Docs: PictureCardStory = {
  render: Template,
  args: {
    title: "Office",
    image: office,
    icon: "mdi:office-chair",
  },
};
