import { Story } from "@storybook/blocks";
import type { Meta, StoryObj } from "@storybook/react";
import { css, Global } from "@emotion/react";
import { HassConnect } from '@hass-connect-fake';
import {
  ThemeProvider,
  SidebarCard,
  FabCard,
  Row,
  Column,
  RoomCard,
  ButtonCard,
  WeatherCard,
  TimeCard,
  Group,
  ClimateCard,
  MediaPlayerCard,
  EntitiesCard,
  TriggerCard,
  GarbageCollectionCard,
  useDevice,
  SensorCard
} from '@components';
// @ts-expect-error - don't need to type this
import office from './office.jpg';
// @ts-expect-error - don't need to type this
import livingRoom from './living-room.jpg';
// @ts-expect-error - don't need to type this
import diningRoom from './dining-room.jpg';

function Template() {
  const device = useDevice();
  return <HassConnect hassUrl="https://homeassistant.local:8123">
    <ThemeProvider includeThemeControls darkMode={true} />
    <Row fullWidth wrap="nowrap" fullHeight alignItems="stretch">
      <SidebarCard startOpen={false} />
      <Column fullWidth gap="1rem" wrap="nowrap" justifyContent="flex-start" style={{
        padding: device.mobile || device.tablet ? '1rem' : '2rem',
        overflowY: 'auto',
      }}>
        <Group title="Time & Date" layout="column">
          <TimeCard />
          <SensorCard entity="sensor.air_conditioner_inside_temperature" />
        </Group>
        <Group title="Lights & Switches">
          <ButtonCard entity="light.fake_light_1" service="toggle" />
          <ButtonCard entity="light.fake_light_2" service="toggle" icon="mdi:power" />
          <ButtonCard entity="light.fake_light_3" service="toggle" />
          <ButtonCard entity="switch.fake_switch" service="toggle" />
          <ButtonCard entity="vacuum.robot_vacuum" service="toggle" />
        </Group>
        <Group title="Lights & Switches Fabs">
          <FabCard entity="light.fake_light_1" service="toggle" />
          <FabCard entity="light.fake_light_2" service="toggle" icon="mdi:power" />
          <FabCard entity="light.fake_light_3" service="toggle" />
          <FabCard entity="switch.fake_switch" service="toggle" />
          <FabCard entity="vacuum.robot_vacuum" service="toggle" />
        </Group>
        <Group title="Miscellaneous" layout="column" gap="1rem">
          <Row gap="1rem" alignItems="stretch" fullWidth>
            <EntitiesCard includeLastUpdated entities={['sensor.date', 'sensor.time', 'automation.dim_lights']} />
            <MediaPlayerCard entity="media_player.fake_speaker_2" layout="slim" />
            <TriggerCard entity="scene.good_morning" />
            <ClimateCard entity="climate.air_conditioner" />
            <WeatherCard entity="weather.entity" />
            <GarbageCollectionCard description="Here's the upcoming garbage collection schedule." schedules={[
              {
                day: "Thursday",
                frequency: "weekly",
                weeks: [
                  [
                    {
                      color: "#b62525",
                      name: "General Waste",
                    },
                    {
                      color: "#009b00",
                      name: "Garden Waste",
                    },
                  ],
                  [
                    {
                      color: "#b62525",
                      textColor: "white",
                      name: "Waste",
                    },
                    {
                      color: "#c8c804",
                      name: "Recycling",
                    },
                  ],
                  [
                    {
                      color: "#b62525",
                      icon: "game-icons:nuclear-waste",
                    },
                    {
                      color: "#009b00",
                      name: "Garden",
                    },
                  ],
                  ["#b62525", "#c8c804"],
                ],
              },
            ]} />
            <RoomCard icon="mdi:office-chair" title="Office" hash="office" image={office}>
              <Column fullWidth gap="1rem" style={{
                padding: '1rem',
              }}>
                <Group title="Lights & Switches">
                  <ButtonCard entity="light.fake_light_1" service="toggle" />
                  <ButtonCard entity="light.fake_light_2" service="toggle" />
                  <ButtonCard entity="light.fake_light_3" service="toggle" />
                  <ButtonCard entity="switch.fake_switch" service="toggle" />
                  <ButtonCard entity="vacuum.robot_vacuum" service="toggle" />
                </Group>
                <Group title="Random Stuff">
                  <EntitiesCard includeLastUpdated entities={['sensor.date', 'sensor.time', 'automation.dim_lights']} />
                  <MediaPlayerCard entity="media_player.fake_speaker" />
                  <TriggerCard entity="scene.good_morning" />
                </Group>
                <Group title="Lights & Switches Fabs">
                  <FabCard entity="light.fake_light_1" service="toggle" />
                  <FabCard entity="light.fake_light_2" service="toggle" icon="mdi:power" />
                  <FabCard entity="light.fake_light_3" service="toggle" />
                  <FabCard entity="switch.fake_switch" service="toggle" />
                  <FabCard entity="vacuum.robot_vacuum" service="toggle" />
                </Group>
              </Column>
            </RoomCard>
            <RoomCard icon="mdi:sofa" title="Living Room" hash="living-room" image={livingRoom}>
              <Column fullWidth gap="1rem" style={{
                padding: '1rem',
              }}>
                <Row gap="1rem" fullWidth>
                  <ButtonCard entity="light.fake_light_1" service="toggle" />
                  <ButtonCard entity="switch.fake_switch" service="toggle" />
                  <ButtonCard entity="media_player.fake_speaker" service="toggle" />
                </Row>
                <Row gap="1rem" fullWidth>
                  <FabCard entity="switch.fake_switch" service="toggle" />
                  <FabCard entity="vacuum.robot_vacuum" service="toggle" />
                </Row>
                <Group title="Living Entities">
                  <ButtonCard entity="light.fake_light_2" service="toggle" />
                  <ButtonCard entity="light.fake_light_3" service="toggle" />
                  <ButtonCard entity="vacuum.robot_vacuum" service="toggle" />
                </Group>
              </Column>
            </RoomCard>
            <RoomCard icon="mdi:dining" title="Dining Room" hash="dining-room" image={diningRoom}>
              <Column fullWidth gap="1rem" style={{
                padding: '1rem',
              }}>
                <Group title="Dining Entities">
                  <ButtonCard entity="light.fake_light_1" service="toggle" />
                  <ButtonCard entity="light.fake_light_2" service="toggle" />
                  <ButtonCard entity="light.fake_light_3" service="toggle" />
                </Group>
              </Column>
            </RoomCard>
          </Row>
        </Group>
      </Column>

    </Row>
  </HassConnect>
}

export default {
  title: "INTRODUCTION/Overview",
  parameters: {
    standalone: true,
    addons: {
      showPanel: false,
    },
    docs: {
      description: {
        component: `@hakit provides a series of tools to easily authenticate and communicate with your home assistant instance from React!`
      }
    }
  },
} satisfies Meta;

export type Story = StoryObj<typeof Template>;

export const Default = Template.bind({});