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
  useBreakpoint,
  SensorCard,
  CameraCard,
  ButtonBar,
  ButtonBarButton,
  EntitiesCardRow,
  ButtonGroup,
  ButtonGroupButton,
} from '@components';
import office from './office.jpg';
import livingRoom from './living-room.jpg';
import diningRoom from './dining-room.jpg';


function Template() {
  const device = useBreakpoint();
  return <Row fullWidth wrap="nowrap" fullHeight alignItems="stretch">
    <SidebarCard startOpen={false} />
    <Column fullWidth gap="1rem" wrap="nowrap" justifyContent="flex-start" style={{
      padding: device.xxs || device.xs ? '1rem' : '2rem',
      overflowY: 'auto',
    }}>
      <Group title="Time & Date" layout="row" justifyContent="flex-start" alignItems="stretch" description="Displays some variations for the TimeCard">
        <TimeCard />
        <TimeCard hideDate center />
        <TimeCard hideTime hideIcon center />
      </Group>
      <Row fullWidth  justifyContent="flex-start" alignItems="stretch" gap="1rem">
        <Group
          md={6}
          lg={6}
          xlg={6}
          title="Button Card"
          description="This is how the ButtonCards appear in the default layout"
          justifyContent="flex-start"
          alignItems="stretch">
          <ButtonCard id="default" entity="light.fake_light_1" service="toggle" md={6} lg={4} xlg={3} />
          <ButtonCard id="default" entity="cover.cover_with_tilt" service="toggle" md={6} lg={4} xlg={3} />
          <ButtonCard id="default" entity="light.fake_light_3" service="toggle"  md={6} lg={4} xlg={3}/>
          <ButtonCard id="default" entity="switch.fake_switch" service="toggle"  md={6} lg={4} xlg={3}/>
          <ButtonCard id="default" entity="vacuum.robot_vacuum" service="toggle"  md={6} lg={4} xlg={3} />
        </Group>
        <Group
          md={6}
          lg={6}
          xlg={6}
          title="ButtonCard"
          description={<span>With defaultLayout="slim" we can change the layout of the ButtonCard</span>}
          justifyContent="flex-start"
          alignItems="stretch">
          <ButtonCard id="slim" defaultLayout="slim" entity="light.fake_light_1" service="toggle" md={6} lg={4} xlg={4} />
          <ButtonCard id="slim" defaultLayout="slim" entity="weather.entity" md={6} lg={4} xlg={4} />
          <ButtonCard id="slim" defaultLayout="slim" entity="climate.air_conditioner" md={6} lg={4} xlg={4} />
          <ButtonCard id="slim" defaultLayout="slim" entity="switch.fake_switch" service="toggle" md={6} lg={4} xlg={4} />
          <ButtonCard id="slim" defaultLayout="slim" entity="cover.cover_with_tilt" service="toggle" md={6} lg={4} xlg={4} />
        </Group>
      </Row>
      <Group title="ButtonCard"  description={<span>With defaultLayout="slim-vertical" we can change the layout of the ButtonCard</span>} justifyContent="flex-start" alignItems="stretch">
        <ButtonCard id="slim-vertical" defaultLayout="slim-vertical" entity="light.fake_light_1" service="toggle" />
        <ButtonCard id="slim-vertical" defaultLayout="slim-vertical" entity="light.fake_light_2" service="toggle" icon="mdi:power" />
        <ButtonCard id="slim-vertical" defaultLayout="slim-vertical" entity="light.fake_light_3" service="toggle" />
        <ButtonCard id="slim-vertical" defaultLayout="slim-vertical" entity="switch.fake_switch" service="toggle" />
        <ButtonCard id="slim-vertical" defaultLayout="slim-vertical" entity="vacuum.robot_vacuum" service="toggle" />
      </Group>
      <Group title="FabCard & ButtonBar & ButtonGroup" justifyContent="flex-start" alignItems="stretch" description="FabCard is a great way to show simple entities you just want to perform a simple action and don't care about the name / data, there's a bunch of different ways to render and control entities" gap="1rem">
        <FabCard entity="light.fake_light_1" service="toggle" />
        <FabCard entity="light.fake_light_2" service="toggle" icon="mdi:power" />
        <FabCard entity="light.fake_light_3" service="toggle" />
        <FabCard entity="switch.fake_switch" service="toggle" />
        <FabCard entity="vacuum.robot_vacuum" service="toggle" />
        <FabCard entity="vacuum.robot_vacuum" service="toggle">
          <span>Custom Content</span>
        </FabCard>
        <ButtonBar>
          <ButtonBarButton entity="switch.record" />
          <ButtonBarButton entity="binary_sensor.vehicle" />
          <ButtonBarButton entity="sensor.air_conditioner_inside_temperature" />
        </ButtonBar>
        <ButtonGroup orientation="horizontal" thickness={60}>
          <ButtonGroupButton
            entity="light.fake_light_1"
            service="toggle"
            serviceData={{
              brightness_pct: 50
            }}
          />
          <ButtonGroupButton entity="binary_sensor.vehicle" />
          <ButtonGroupButton
            entity="switch.record"
            service="toggle"
          />
        </ButtonGroup>
      </Group>
      <Group title="Miscellaneous" description="items will stretch to fit the same height per row" layout="column" gap="1rem">
        <Row gap="1rem" justifyContent="flex-start" alignItems="stretch" fullWidth>
          <EntitiesCard includeLastUpdated>
            <EntitiesCardRow entity="sensor.time" />
            <EntitiesCardRow entity="sensor.date" />
            <EntitiesCardRow entity="switch.fake_switch" icon="mdi:gamepad-classic" name="Gaming Computer" onClick={ (entity) => {
              alert(`You clicked on ${entity.attributes.friendly_name}!`);
            }} renderState={(entity) => {
              return entity.state === "on" ? <span>On!</span> : <span>Off!</span>;
            }} />
          </EntitiesCard>
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
          <CameraCard
            entity="camera.demo_camera"
            name="Only poster available in demo"
            headerSensors={[
            <ButtonBarButton entity="binary_sensor.vehicle" />,
            <ButtonBarButton entity="switch.record" />
          ]}
          />
          <SensorCard entity="sensor.air_conditioner_inside_temperature" />     
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
                <EntitiesCard includeLastUpdated>
                  <EntitiesCardRow entity="sensor.time" />
                  <EntitiesCardRow entity="sensor.date" />
                  <EntitiesCardRow entity="switch.fake_switch" icon="mdi:gamepad-classic" name="Gaming Computer" onClick={ (entity) => {
                    alert(`You clicked on ${entity.attributes.friendly_name}!`);
                  }} renderState={(entity) => {
                    return entity.state === "on" ? <span>On!</span> : <span>Off!</span>;
                  }} />
                </EntitiesCard>
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
}

function Connector() {
  return <HassConnect hassUrl="https://homeassistant.local:8123">
    <ThemeProvider includeThemeControls darkMode={true} />
    <Template />
  </HassConnect>
}

export default {
  title: "INTRODUCTION/Demo",
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

export type Story = StoryObj<typeof Connector>;

export const Default = Connector.bind({});