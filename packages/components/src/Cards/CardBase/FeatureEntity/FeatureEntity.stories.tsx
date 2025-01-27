import type { Meta, StoryObj, Args } from "@storybook/react";
import { ThemeProvider, Row, CardBase, FeatureEntity } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Render(args?: Args) {
  return (
    <HassConnect hassUrl="https://homeassistant.local:8123">
      <ThemeProvider includeThemeControls />
      <Row gap="1rem" fullWidth>
        <CardBase
          disableActiveState
          features={[
            <FeatureEntity key="a" entity="switch.record" service="toggle" />,
            <FeatureEntity key="b" {...args} entity="switch.fake_switch" service="toggle" />,
            <FeatureEntity key="c" {...args} entity="switch.unavailable" service="toggle" />,
            <FeatureEntity key="d" {...args} entity="light.fake_light_1" service="toggle" />,
            <FeatureEntity key="e" {...args} entity="light.fake_light_2" service="toggle" />,
            <FeatureEntity key="f" {...args} entity="light.fake_light_3" service="toggle" />,
          ]}
        >
          <Row
            fullWidth
            fullHeight
            style={{
              padding: "4rem",
            }}
          >
            Showing how feature entities work by default
          </Row>
        </CardBase>
        <CardBase
          disableActiveState
          features={[
            <FeatureEntity key="a" entity="switch.record" service="toggle">
              RECORD
            </FeatureEntity>,
            <FeatureEntity
              {...args}
              key="b"
              entity="switch.fake_switch"
              service="toggle"
              onClick={() => {
                console.log("clicked");
              }}
            >
              SWITCH
            </FeatureEntity>,
          ]}
        >
          <Row
            fullWidth
            fullHeight
            style={{
              padding: "4rem",
            }}
          >
            Showing how feature entities work by default
          </Row>
        </CardBase>
      </Row>
    </HassConnect>
  );
}

export default {
  title: "components/Cards/CardBase/FeatureEntity",
  component: FeatureEntity,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof FeatureEntity>;
export type LightStory = StoryObj<typeof FeatureEntity>;
export const Example: LightStory = {
  render: Render,
  args: {},
};
