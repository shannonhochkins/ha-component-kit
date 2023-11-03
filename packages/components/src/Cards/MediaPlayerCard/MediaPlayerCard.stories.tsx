import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, MediaPlayerCard, MediaPlayerCardProps, Column } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Template(args?: Partial<MediaPlayerCardProps>) {
  return (
    <HassConnect hassUrl={"http://homeassistant.local:8123"}>
      <ThemeProvider includeThemeControls />
      <Column gap="1rem" fullWidth>
        <Column gap="1rem" fullWidth>
          <p>Default Display</p>
          <MediaPlayerCard entity="media_player.fake_speaker" {...args} />
        </Column>
        <Column gap="1rem" fullWidth>
          <p>Volume controls as buttons, no thumbnail</p>
          <MediaPlayerCard entity="media_player.fake_speaker" volumeLayout={"buttons"} hideThumbnail={true} {...args} />
        </Column>
        <Column gap="1rem" fullWidth>
          <p>Slim Card - default layout</p>
          <MediaPlayerCard layout="slim" entity="media_player.fake_speaker" {...args} />
        </Column>
        <Column gap="1rem" fullWidth>
          <p>Slim Card - volume buttons, no thumbnail</p>
          <MediaPlayerCard layout="slim" volumeLayout={"buttons"} hideThumbnail={true} entity="media_player.fake_speaker" {...args} />
        </Column>
      </Column>
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Cards/MediaPlayerCard",
  component: MediaPlayerCard,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
  argTypes: {
    entity: { control: "text" },
  },
} satisfies Meta<typeof MediaPlayerCard>;
export type MediaPlayerCardStory = StoryObj<typeof MediaPlayerCard>;
export const MediaPlayerCardExample: MediaPlayerCardStory = {
  render: Template,
  args: {},
};
