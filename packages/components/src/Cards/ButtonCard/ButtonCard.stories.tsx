import { Source } from "@storybook/blocks";
import type { Meta, StoryObj, Args } from "@storybook/react";
import { ThemeProvider, Group, ButtonCard } from "@components";
import type { ButtonCardProps } from "@components";
import type { DomainService } from "@hakit/core";
import { HassConnect } from "@stories/HassConnectFake";
// @ts-expect-error - Don't have types for jsx-to-string
import jsxToString from "jsx-to-string";

function Template(
  args?: Partial<
    ButtonCardProps<"switch.fake_switch", DomainService<"switch">>
  >,
) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <Group title="Examples">
        <ButtonCard
          {...args}
          entity="switch.fake_switch"
          onClick={(entity) => {
            entity.api.toggle();
          }}
        />
        <ButtonCard service="toggle" entity="light.fake_light_1" />
        <ButtonCard service="toggle" entity="media_player.fake_tv" />
      </Group>
    </HassConnect>
  );
}

function TemplateOnclick(
  args?: Partial<
    ButtonCardProps<"climate.air_conditioner", DomainService<"climate">>
  >,
) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <ButtonCard
        {...args}
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
          defaultLayout="slim"
          title="Slim example"
          entity="switch.fake_switch"
          service="toggle"
        />
        <ButtonCard
          defaultLayout="default"
          title="Default example"
          entity="switch.fake_switch"
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

function Render(args?: Args) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <ButtonCard {...args} />
    </HassConnect>
  );
}

function RenderClimate(args?: Args) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <ButtonCard
        {...args}
        entity="climate.air_conditioner"
        onClick={(entity) => {
          entity.state === "off" ? entity.api.turnOn() : entity.api.turnOff();
        }}
      />
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Cards/ButtonCard",
  component: ButtonCard,
  tags: ["autodocs"],
  parameters: {
    centered: true,
  },
  argTypes: {
    title: { control: "text" },
  },
} satisfies Meta<typeof ButtonCard>;
export type LightStory = StoryObj<
  typeof ButtonCard<"light.fake_light_1", "toggle">
>;
export const LightExample: LightStory = {
  render: Render,
  args: {
    service: "toggle",
    entity: "light.fake_light_1",
  },
};

export const ClimateExample: StoryObj<
  typeof ButtonCard<"climate.air_conditioner", "turnOn">
> = {
  render: RenderClimate,
  args: {},
};
export type SwitchStory = StoryObj<
  typeof ButtonCard<"switch.fake_switch", "toggle">
>;
export const SwitchExample: SwitchStory = {
  render: Render,
  args: {
    service: "toggle",
    entity: "switch.fake_switch",
  },
};
export type GroupStory = StoryObj<typeof ExampleDocs>;
export const DetailedExample: GroupStory = {
  render: ExampleDocs,
};

export type LayoutStory = StoryObj<typeof LayoutExampleTemplate>;
export const LayoutExample: LayoutStory = {
  render: LayoutExampleTemplate,
};
