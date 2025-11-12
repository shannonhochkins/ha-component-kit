import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeProvider, LightControls, ThemeControlsModal, Column, Row } from "@components";
import type { LightControlsProps } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Template(args?: Partial<LightControlsProps>) {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <ThemeProvider />
      <ThemeControlsModal />
      <Row gap="1rem" wrap="nowrap">
        <LightControls {...args} entity="light.fake_light_1" />
      </Row>
    </HassConnect>
  );
}

function OnlyBrightnessTemplate(args?: Partial<LightControlsProps>) {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <ThemeProvider />
      <ThemeControlsModal />
      <Column gap="1rem" wrap="nowrap">
        <LightControls {...args} entity="light.no_color" />
      </Column>
    </HassConnect>
  );
}

function NoTemperatureTemplate(args?: Partial<LightControlsProps>) {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <ThemeProvider />
      <ThemeControlsModal />
      <Column gap="1rem" wrap="nowrap">
        <LightControls {...args} entity="light.only_color" />
      </Column>
    </HassConnect>
  );
}

function TemplateAdvanced(args?: Partial<LightControlsProps>) {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <ThemeProvider />
      <ThemeControlsModal />
      <Column gap="1rem" wrap="nowrap">
        <p>All features supported</p>
        <LightControls {...args} entity="light.fake_light_1" />
        <p>Light not supporting color, temperature, only brightness</p>
        <LightControls entity="light.no_color" />
        <p>Light not supporting brightness/color/temperature</p>
        <LightControls entity="light.simple_light" />
      </Column>
    </HassConnect>
  );
}

// all_office_lights_2

export default {
  title: "components/Shared/Entity/Light/LightControls",
  component: LightControls,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof LightControls>;
export type TimeStory = StoryObj<typeof LightControls>;
export const Docs: TimeStory = {
  render: Template,
  args: {},
};

// more advanced examples
export const DetailedExample: TimeStory = {
  render: TemplateAdvanced,
  args: {},
};

export const OnlyBrightness: TimeStory = {
  render: OnlyBrightnessTemplate,
  args: {},
};

export const NoTemperature: TimeStory = {
  render: NoTemperatureTemplate,
  args: {},
};
