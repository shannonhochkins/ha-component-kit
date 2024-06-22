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
            <FeatureEntity entity="switch.record" service="toggle" />,
            <FeatureEntity {...args} entity="switch.fake_switch" service="toggle" />,
            <FeatureEntity {...args} entity="switch.unavailable" service="toggle" />,
            <FeatureEntity {...args} entity="light.fake_light_1" service="toggle" />,
            <FeatureEntity {...args} entity="light.fake_light_2" service="toggle" />,
            <FeatureEntity {...args} entity="light.fake_light_3" service="toggle" />,
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
            <FeatureEntity entity="switch.record" service="toggle">
              RECORD
            </FeatureEntity>,
            <FeatureEntity
              {...args}
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
  title: "COMPONENTS/Cards/CardBase/FeatureEntity",
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
