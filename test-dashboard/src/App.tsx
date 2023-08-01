import { useState } from 'react'
import { HassConnect } from '@hakit/core';
import { ThemeProvider, Row, Column, RoomCard, SidebarCard, ButtonCard, Group, SceneCard} from '@hakit/components';
import office from './assets/office.jpg';
import livingRoom from './assets/living-room.jpg';
import './App.css'

function App() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <ThemeProvider />
      <Row
        alignItems="stretch"
        justifyContent="flex-start"
        fullWidth
        fullHeight
        wrap="nowrap"
      >
        <SidebarCard menuItems={[
          {
            name: "Air Conditioner",
            description: "On - currently 23°",
            icon: "mdi:fan",
            active: false,
            onClick() {
              console.log("do something on click!");
            },
          },
        ]}
        weatherCardProps={{
          entity: "weather.freesia",
          includeForecast: true,
        }}>
          <p>You can insert any children in the sidebar here</p>
        </SidebarCard>
        <Row fullWidth fullHeight gap="0.5rem">
          <RoomCard
            hash="office"
            image={office}
            title="Office"
            icon="mdi:office-chair"
          >
            <Column gap="1rem">
              <Group title="Striplights">
                <ButtonCard entity="light.light_office_downlight_1" service="toggle" />
                <ButtonCard entity="light.light_office_downlight_2" service="toggle" />
                <ButtonCard entity="light.light_office_downlight_3" service="toggle" />
                <ButtonCard entity="light.light_office_downlight_1" service="toggle" />
              </Group>
              <SceneCard entity="scene.goodmorning" data-testid="scene-card" />
              <Group title="Downlights">
                <ButtonCard entity="light.light_office_downlight_1" service="toggle" />
                <ButtonCard entity="light.light_office_downlight_1" service="toggle" />
              </Group>
            </Column>
          </RoomCard>
          <RoomCard
            hash="living-room"
            image={livingRoom}
            title="Living Room"
            icon="mdi:sofa"
          >
            <div>LivingRoom</div>
          </RoomCard>
        </Row>
      </Row>
    </HassConnect>
  )
}

export default App
