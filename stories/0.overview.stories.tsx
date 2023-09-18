import { useState } from "react";
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
  GarbageCollectionCard
} from '@components';
// @ts-expect-error - don't need to type this
import office from './office.jpg';
// @ts-expect-error - don't need to type this
import livingRoom from './living-room.jpg';
// @ts-expect-error - don't need to type this
import diningRoom from './dining-room.jpg';

function Template() {
  return <HassConnect hassUrl="https://homeassistant.local:8123">
    <ThemeProvider includeThemeControls darkMode={true} />
    <Global
      styles={css`
        :root {
          --ha-hide-body-overflow-y: hidden;
        }
      `}
    />
    <Row fullWidth wrap="nowrap" fullHeight alignItems="stretch">
      <SidebarCard startOpen={false} />
      <Column fullWidth gap="1rem" wrap="nowrap" justifyContent="flex-start" style={{
        padding: '2rem',
        overflow: 'auto'
      }}>
        <Group title="Time & Date">
        <TimeCard />
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
          <Row gap="1rem" alignItems="stretch">
            <EntitiesCard includeLastUpdated entities={['sensor.date', 'sensor.time', 'automation.dim_lights']} />
            <MediaPlayerCard entity="media_player.fake_speaker" layout="slim" />
            <TriggerCard entity="scene.good_morning" />
          </Row>
          <Row gap="1rem" alignItems="stretch">
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
          </Row>
          <Row gap="1rem">
            <RoomCard icon="mdi:office-chair" title="Office" hash="office" image={office}>
              <Group title="Lights & Switches">
                <ButtonCard entity="light.fake_light_1" service="toggle" />
                <ButtonCard entity="light.fake_light_2" service="toggle" />
                <ButtonCard entity="light.fake_light_3" service="toggle" />
                <ButtonCard entity="switch.fake_switch" service="toggle" />
                <ButtonCard entity="vacuum.robot_vacuum" service="toggle" />
              </Group>
            </RoomCard>
            <RoomCard icon="mdi:sofa" title="Living Room" hash="living-room" image={livingRoom}>
              <Group title="Living Entities">
                <ButtonCard entity="light.fake_light_2" service="toggle" />
                <ButtonCard entity="light.fake_light_3" service="toggle" />
                <ButtonCard entity="vacuum.robot_vacuum" service="toggle" />
              </Group>
            </RoomCard>
            <RoomCard icon="mdi:dining" title="Dining Room" hash="dining-room" image={diningRoom}>
              <Group title="Dining Entities">
                <ButtonCard entity="light.fake_light_1" service="toggle" />
                <ButtonCard entity="light.fake_light_2" service="toggle" />
                <ButtonCard entity="light.fake_light_3" service="toggle" />
              </Group>
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
    padding: 0,
    fillHeight: true,
    height: "100%",
    width: "100%",
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