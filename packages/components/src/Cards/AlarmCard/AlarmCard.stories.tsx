import type { Meta, StoryObj, Args } from "@storybook/react-vite";
import { ThemeProvider, ThemeControlsModal, AlarmCard, Row, RelatedEntity } from "@components";
import { HassConnect } from "@hass-connect-fake";

function Render(args?: Args) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <ThemeControlsModal />
      <Row gap="2rem">
        <AlarmCard
          entity={"alarm_control_panel.home_alarm"}
          defaultCode={1234}
          {...args}
          relatedEntities={<RelatedEntity entity="sensor.alarm_battery" position="left top" />}
        />
        <AlarmCard entity={"alarm_control_panel.home_alarm"} defaultCode={1234} layoutType="slim" {...args} />
        <AlarmCard
          entity={"alarm_control_panel.home_alarm"}
          defaultCode={1234}
          layoutType="default"
          {...args}
          relatedEntities={<RelatedEntity entity="sensor.alarm_battery" position="right top" />}
        />
      </Row>
    </HassConnect>
  );
}

export default {
  title: "components/Cards/AlarmCard",
  component: AlarmCard,
  tags: ["autodocs"],
  parameters: {
    fullWidth: true,
  },
} satisfies Meta<typeof AlarmCard>;

export type AlarmControlPanelStory = StoryObj<typeof AlarmCard>;
export const Docs: AlarmControlPanelStory = {
  render: Render,
  args: {
    entity: "alarm_control_panel.home_alarm",
  },
};

export const AlarmCardWithNoKeypadSupport: AlarmControlPanelStory = {
  render: Render,
  args: {
    entity: "alarm_control_panel.no_code",
  },
};
