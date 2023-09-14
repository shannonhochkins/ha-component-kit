import type { Meta, StoryObj } from "@storybook/react";
import {
  Title,
  Description,
  Primary,
  ArgTypes,
  Source,
} from "@storybook/blocks";
import { ThemeProvider, RoomCard, Row, ButtonCard } from "@components";
import type { RoomCardProps } from "@components";
import { useHash } from "@hakit/core";
// @ts-expect-error - Don't have types for jsx-to-string
import jsxToString from "jsx-to-string";
import { HassConnect } from "@hass-connect-fake";
import office from "./office.jpg";
import livingRoom from "./living-room.jpg";
function Template(args: RoomCardProps) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <Row fullHeight>
        <RoomCard {...args}>The {args.hash} room is active!</RoomCard>
      </Row>
    </HassConnect>
  );
}

function MultiRoomExample() {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <Row gap="1rem" fullWidth>
        <RoomCard
          {...{
            hash: "office",
            image: office,
            title: "Office",
            icon: "mdi:office-chair",
          }}
        >
          <Row gap="1rem">
            <ButtonCard
              entity="light.fake_light_1"
              service="toggle"
              title="Office Light"
              description={"An office Light"}
            />
            <ButtonCard
              entity="media_player.fake_tv"
              service="toggle"
              title="Office TV"
              description={"An office TV"}
            />
          </Row>
        </RoomCard>
        <RoomCard
          {...{
            hash: "living-room",
            image: livingRoom,
            title: "Living Room",
            icon: "mdi:sofa",
          }}
        >
          <Row gap="1rem">
            <ButtonCard
              entity="light.fake_light_2"
              service="toggle"
              title="Living Room Light"
              description={"An living-room Light"}
            />
            <ButtonCard
              entity="light.fake_light_3"
              service="toggle"
              title="Striplights"
              description={"Striplights bottom shelf"}
            />
          </Row>
        </RoomCard>
      </Row>
    </HassConnect>
  );
}

function TemplateFull() {
  return (
    <>
      <MultiRoomExample />
      <h2>Full source example of the above</h2>
      <Source
        dark
        code={jsxToString(MultiRoomExample(), {
          useFunctionCode: true,
        })}
      />
    </>
  );
}

function UseHashExample() {
  const [, setHash] = useHash();
  return (
    <Row fullHeight>
      <RoomCard
        image={office}
        title="Office"
        icon="mdi:office-chair"
        hash="office"
      >
        The office is active!
      </RoomCard>
      <ButtonCard
        title="Trigger the office!"
        onClick={() => {
          setHash("office");
        }}
      />
    </Row>
  );
}

export default {
  title: "COMPONENTS/Cards/RoomCard",
  component: RoomCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Description />
          <p>
            When the room is clicked, the URL hash will be set, so you can
            refresh the page and the room will become active again.
          </p>
          <Primary />
          <p>
            You can set the hash programmatically from anywhere and the room
            will activate! There's a helper hook designed to help with this!
          </p>
          <Source
            dark
            code={jsxToString(UseHashExample(), {
              useFunctionCode: true,
            })}
          />
          <h2>Component Props</h2>
          <ArgTypes />
        </>
      ),
    },
  },
  argTypes: {
    hash: { control: "text" },
  },
} satisfies Meta<typeof RoomCard>;
export type RoomStory = StoryObj<typeof RoomCard>;
export const RoomExample: RoomStory = {
  render: Template,
  args: {
    hash: "office",
    image: office,
    title: "Office",
    icon: "mdi:office-chair",
  },
};

export const MultipleRoomsExample: RoomStory = {
  render: TemplateFull,
  args: {},
};
