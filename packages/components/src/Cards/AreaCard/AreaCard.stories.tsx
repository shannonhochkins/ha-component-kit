import type { Meta, StoryObj } from "@storybook/react";
import { Title, Description, Primary, ArgTypes, Source } from "@storybook/blocks";
import { ThemeProvider, AreaCard, Row, ButtonCard } from "@components";
import type { AreaCardProps } from "@components";
import { useHass } from "@hakit/core";
// @ts-expect-error - Don't have types for jsx-to-string
import jsxToString from "jsx-to-string";
import { HassConnect } from "@hass-connect-fake";
import office from "./office.jpg";
import livingRoom from "./living-room.jpg";
function Template(args: AreaCardProps) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider includeThemeControls />
      <Row fullHeight>
        <AreaCard {...args}>The {args.hash} area is active!</AreaCard>
      </Row>
    </HassConnect>
  );
}

function MultiAreaExample() {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider includeThemeControls />
      <Row gap="1rem" fullWidth>
        <AreaCard
          {...{
            hash: "office",
            image: office,
            title: "Office",
            icon: "mdi:office-chair",
          }}
        >
          <Row gap="1rem" fullWidth>
            <ButtonCard entity="light.fake_light_1" service="toggle" title="Office Light" description={"An office Light"} />
            <ButtonCard entity="media_player.fake_tv" service="toggle" title="Office TV" description={"An office TV"} />
          </Row>
        </AreaCard>
        <AreaCard
          {...{
            hash: "living-room",
            image: livingRoom,
            title: "Living Room",
            icon: "mdi:sofa",
          }}
        >
          <Row gap="1rem" fullWidth>
            <ButtonCard entity="light.fake_light_2" service="toggle" title="Living Room Light" description={"An living-room Light"} />
            <ButtonCard entity="light.fake_light_3" service="toggle" title="Striplights" description={"Striplights bottom shelf"} />
          </Row>
        </AreaCard>
      </Row>
    </HassConnect>
  );
}

function TemplateFull() {
  return (
    <>
      <MultiAreaExample />
      <h2>Full source example of the above</h2>
      <Source
        dark
        code={jsxToString(MultiAreaExample(), {
          useFunctionCode: true,
        })}
      />
    </>
  );
}

function UseHashExample() {
  const { useStore } = useHass();
  const setHash = useStore((store) => store.setHash);
  return (
    <Row fullHeight fullWidth>
      <AreaCard image={office} title="Office" icon="mdi:office-chair" hash="office">
        The office is active!
      </AreaCard>
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
  title: "COMPONENTS/Cards/AreaCard",
  component: AreaCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Description />
          <p>When the area is clicked, the URL hash will be set, so you can refresh the page and the area will become active again.</p>
          <Primary />
          <p>
            You can set the hash programmatically from anywhere and the area will activate! There's a helper hook designed to help with
            this!
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
} satisfies Meta<typeof AreaCard>;
export type AreaStory = StoryObj<typeof AreaCard>;
export const AreaExample: AreaStory = {
  render: Template,
  args: {
    hash: "office",
    image: office,
    title: "Office",
    icon: "mdi:office-chair",
  },
};

export const MultipleAreasExample: AreaStory = {
  render: TemplateFull,
  args: {},
};
