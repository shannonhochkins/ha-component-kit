import type { Meta, StoryObj, Args } from "@storybook/react-vite";
import { ThemeProvider, Row, CardBase, RelatedEntity, ThemeControlsModal, Column } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Render(args?: Args) {
  return (
    <HassConnect hassUrl="https://homeassistant.local:8123">
      <ThemeProvider />
      <ThemeControlsModal />
      <Column gap="1rem" fullWidth>
        <CardBase
          relatedEntities={
            <>
              <RelatedEntity {...args} entity="climate.air_conditioner" />
              <RelatedEntity {...args} entity="climate.air_conditioner" position="right bottom" />
              <RelatedEntity {...args} entity="climate.air_conditioner" position="center bottom" />
              <RelatedEntity {...args} entity="climate.air_conditioner" position="left bottom" />
              <RelatedEntity {...args} entity="climate.air_conditioner" position="left top" />
              <RelatedEntity {...args} entity="climate.air_conditioner" position="center top" />
            </>
          }
        >
          <Row
            fullWidth
            fullHeight
            style={{
              padding: "4rem",
            }}
          >
            LOOK HOW MANY ICONS I HAVE
          </Row>
        </CardBase>
      </Column>
    </HassConnect>
  );
}

export default {
  title: "components/Cards/CardBase/RelatedEntity",
  component: RelatedEntity,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof RelatedEntity>;
export type LightStory = StoryObj<typeof RelatedEntity>;
export const Example: LightStory = {
  render: Render,
  args: {},
};
