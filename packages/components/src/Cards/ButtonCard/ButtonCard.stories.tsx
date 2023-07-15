import { Source } from "@storybook/blocks";
import type { Meta, StoryObj, Args } from "@storybook/react";
import { ThemeProvider, Group, ButtonCard } from "@hakit/components";
import { HassConnect } from "@stories/HassConnectFake";
// @ts-expect-error - Don't have types for jsx-to-string
import jsxToString from "jsx-to-string";

function Template() {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <Group title="Examples">
        <ButtonCard
          entity="switch.fake_gaming_switch"
          onClick={(entity) => {
            entity.api.toggle();
          }}
        />
        <ButtonCard service="toggle" entity="light.fake_light" />
        <ButtonCard service="toggle" entity="media_player.fake_tv" />
      </Group>
    </HassConnect>
  );
}

function TemplateOnclick() {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <ButtonCard
        entity="climate.air_conditioner"
        onClick={(entity) => {
          entity.api.setHvacMode({
            hvac_mode: entity.state === "off" ? "heat" : "off",
          });
          entity.api.setTemperature({
            temperature: 25,
          });
        }}
      />
    </HassConnect>
  );
}

function LayoutExampleTemplate() {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <Group title="Examples">
        <ButtonCard
          layout="slim"
          title="Slim example"
          entity="switch.fake_gaming_switch"
          service="toggle"
        />
        <ButtonCard
          layout="default"
          title="Default example"
          entity="switch.fake_gaming_switch"
          service="toggle"
        />
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
      <h3>Custom onClick</h3>
      <p>
        If you don't want to call a specific service or want to do multiple
        things with the entity, you can omit the service prop and perform your
        logic manually
      </p>
      <TemplateOnclick />
      <h3>Source Code</h3>
      <Source
        code={`
      <HassConnect hassUrl="http://localhost:8123">
        <ThemeProvider />
        <ButtonCard
          entity="climate.air_conditioner"
          onClick={entity => {
            entity.api.setHvacMode({
              hvac_mode: entity.state === 'off' ? 'heat' : 'off',
            });
            entity.api.setTemperature({
              temperature: 25,
            });
          }}
        />
      </HassConnect>
    `}
      />
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

export type LayoutStory = StoryObj<typeof LayoutExampleTemplate>;
export const LayoutExample: LayoutStory = {
  render() {
    return <LayoutExampleTemplate />;
  },
};
