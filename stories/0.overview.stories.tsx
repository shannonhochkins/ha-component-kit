import { Story } from "@storybook/blocks";
import type { Meta, StoryObj } from "@storybook/react";
import { HassConnect } from '@hass-connect-fake';
import {
  ThemeProvider,
  SidebarCard,
  FabCard,
  Row,
  Column,
  AreaCard,
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
  SensorCard,
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
        <Group title="Button Card - Default Layout" alignItems="stretch">
          <ButtonCard id="default" entity="light.fake_light_1" service="toggle" />
          <ButtonCard id="default" entity="light.fake_light_2" service="toggle" icon="mdi:power" />
          <ButtonCard id="default" entity="light.fake_light_3" service="toggle" />
          <ButtonCard id="default" entity="switch.fake_switch" service="toggle" />
          <ButtonCard id="default" entity="vacuum.robot_vacuum" service="toggle" />
        </Group>
        <Group title="ButtonCard - Slim Layout" alignItems="stretch">
          <ButtonCard id="slim" defaultLayout="slim" entity="light.fake_light_1" service="toggle" />
          <ButtonCard id="slim" defaultLayout="slim" entity="light.fake_light_2" service="toggle" icon="mdi:power" />
          <ButtonCard id="slim" defaultLayout="slim" entity="light.fake_light_3" service="toggle" />
          <ButtonCard id="slim" defaultLayout="slim" entity="switch.fake_switch" service="toggle" />
          <ButtonCard id="slim" defaultLayout="slim" entity="vacuum.robot_vacuum" service="toggle" />
        </Group>
        <Group title="ButtonCard - Slim Vertical Layout" alignItems="stretch">
          <ButtonCard id="slim-vertical" defaultLayout="slim-vertical" entity="light.fake_light_1" service="toggle" />
          <ButtonCard id="slim-vertical" defaultLayout="slim-vertical" entity="light.fake_light_2" service="toggle" icon="mdi:power" />
          <ButtonCard id="slim-vertical" defaultLayout="slim-vertical" entity="light.fake_light_3" service="toggle" />
          <ButtonCard id="slim-vertical" defaultLayout="slim-vertical" entity="switch.fake_switch" service="toggle" />
          <ButtonCard id="slim-vertical" defaultLayout="slim-vertical" entity="vacuum.robot_vacuum" service="toggle" />
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
            <AreaCard icon="mdi:office-chair" title="Office" hash="office" image={office}>
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
            </AreaCard>
            <AreaCard icon="mdi:sofa" title="Living Room" hash="living-room" image={livingRoom}>
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
            </AreaCard>
            <AreaCard icon="mdi:dining" title="Dining Room" hash="dining-room" image={diningRoom}>
              <Column fullWidth gap="1rem" style={{
                padding: '1rem',
              }}>
                <Group title="Dining Entities">
                  <ButtonCard entity="light.fake_light_1" service="toggle" />
                  <ButtonCard entity="light.fake_light_2" service="toggle" />
                  <ButtonCard entity="light.fake_light_3" service="toggle" />
                </Group>
              </Column>
            </AreaCard>
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