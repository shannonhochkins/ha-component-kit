import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, SidebarCard, ButtonCard, Row, RoomCard } from "@components";
import type { SidebarCardProps } from "@components";
import { HassConnect } from "@stories/HassConnectFake";
import office from '../RoomCard/office.jpg';
import livingRoom from '../RoomCard/living-room.jpg';

function Template(args?: Partial<SidebarCardProps>) {
  return (
    <HassConnect hassUrl="http://localhost:8123">
      <ThemeProvider />
      <Row
        alignItems="stretch"
        justifyContent="flex-start"
        fullWidth
        fullHeight
        wrap="nowrap"
      >
        <SidebarCard {...args}>
          <p>You can insert any children in the sidebar here</p>
        </SidebarCard>
        <Row fullWidth fullHeight gap="0.5rem">
          <RoomCard hash="office" image={office} title="Office" icon="mdi:office-chair">
            <div>Office</div>
          </RoomCard>
          <RoomCard hash="living-room" image={livingRoom} title="Living Room" icon="mdi:sofa">
            <div>LivingRoom</div>
          </RoomCard>
        </Row>
      </Row>
    </HassConnect>
  );
}
export default {
  title: "COMPONENTS/Cards/SidebarCard",
  component: SidebarCard,
  tags: ["autodocs"],
  parameters: {
    width: "100%",
    height: "100%",
    padding: 0,
  },
  argTypes: {},
} satisfies Meta<typeof SidebarCard>;
export type SidebarStory = StoryObj<typeof SidebarCard>;
export const SidebarExample: SidebarStory = {
  render: Template,
  args: {
    weatherCardProps: {
      entity: "weather.entity",
      includeForecast: true,
    }
  },
};
