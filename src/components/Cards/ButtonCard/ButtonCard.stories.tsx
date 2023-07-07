import { Source } from "@storybook/blocks";
import type { Meta, StoryObj, Args } from "@storybook/react";
import { ThemeProvider, Group, ButtonCard } from "ha-component-kit";
import { HassConnect } from "@stories/HassConnectFake";
// @ts-expect-error - Don't have types for jsx-to-string
import jsxToString from "jsx-to-string";

function Template() {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <Group title="Examples">
        <ButtonCard
          service="setTemperature"
          entity="climate.air_conditioner"
          serviceData={{
            temperature: 25,
          }}
        />
        <ButtonCard service="toggle" entity="light.fake_light" />
        <ButtonCard service="toggle" entity="media_player.fake_tv" />
      </Group>
    </HassConnect>
  );
}

function ExampleDocs() {
  return (
    <div>
      <h2>ButtonCard</h2>
      <p>
        This component is designed to make it very easy to use and control a
        device, the code below is all you need to control your device.
      </p>
      <p>
        This will automatically extract the friendly name, icon, last updated,
        state, light color and group of the entity to render the ButtonCard
        below, if there's no icon linked in home assistant it will use a
        predefined default by domain.
      </p>
      <Template />
      <h3>Source Code</h3>
      <p>
        This example shows how you can use the Group component to create a group
        of cards.
      </p>
      <Source code={jsxToString(Template())} />
    </div>
  );
}

function Render(args: Args) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <ButtonCard {...args} />
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Cards/ButtonCard",
  component: ButtonCard,
  tags: ["autodocs"],
  parameters: {
    width: "100%",
  },
  argTypes: {
    title: { control: "text" },
  },
} satisfies Meta<typeof ButtonCard>;
export type LightStory = StoryObj<
  typeof ButtonCard<"light.fake_light", "toggle">
>;
export const LightExample: LightStory = {
  render: Render,
  args: {
    service: "toggle",
    entity: "light.fake_light",
  },
};
export type SwitchStory = StoryObj<
  typeof ButtonCard<"switch.fake_gaming_switch", "toggle">
>;
export const SwitchExample: SwitchStory = {
  render: Render,
  args: {
    service: "toggle",
    entity: "switch.fake_gaming_switch",
  },
};
export type GroupStory = StoryObj<typeof ExampleDocs>;
export const DetailedExample: GroupStory = {
  render() {
    return <ExampleDocs />;
  },
};
