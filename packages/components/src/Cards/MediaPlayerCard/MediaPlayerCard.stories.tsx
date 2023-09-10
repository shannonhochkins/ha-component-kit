import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, MediaPlayerCard, MediaPlayerCardProps } from "@components";
import { HassConnect } from "@hakit/core";

function Template(
  args?: Partial<MediaPlayerCardProps>,
) {
  return (
    <HassConnect hassUrl={'http://homeassistant.local:8123'}>
      <ThemeProvider />
      <MediaPlayerCard
        entity="media_player.dark_google_speaker"
        group={['media_player.test_players']}
        {...args}
      />
      <MediaPlayerCard
        entity="media_player.dark_google_speaker"
        volumeLayout={'slider'}
        showThumbnail
        group={['media_player.test_players']}
        {...args}
      />
      <MediaPlayerCard
        layout="slim"
        volumeLayout={'slider'}
        entity="media_player.dark_google_speaker"
        group={['media_player.test_players']}
        {...args}
      />
      <MediaPlayerCard
        layout="slim"
        showThumbnail
        entity="media_player.dark_google_speaker"
        group={['media_player.test_players']}
        {...args}
      />
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Cards/MediaPlayerCard",
  component: MediaPlayerCard,
  tags: ["autodocs"],
  parameters: {
    centered: true,
  },
  argTypes: {
    entity: { control: "text" },
  },
} satisfies Meta<typeof MediaPlayerCard>;
export type MediaPlayerCardStory = StoryObj<
  typeof MediaPlayerCard
>;
export const MediaPlayerCardExample: MediaPlayerCardStory = {
  render: Template,
  args: {
    
  },
};