import { Story, Source, Title, Description, ArgTypes } from "@storybook/blocks";
import type { Meta, StoryObj } from "@storybook/react";
import { useLowDevices } from "@hakit/core";
import type { EntityName } from "@hakit/core";
import { EntitiesCard, EntitiesCardRow, ThemeProvider, Row, Column } from "@components";
import { HassConnect } from "@hass-connect-fake";

function RenderDevices() {
  const devices = useLowDevices();
  return (
    <EntitiesCard includeLastUpdated>
      {devices.map((device) => (
        <EntitiesCardRow
          key={device.entity_id}
          entity={device.entity_id as EntityName}
          renderState={(entity) => {
            return (
              <div>
                {entity.state}
                {entity.attributes.unit_of_measurement}
              </div>
            );
          }}
        />
      ))}
    </EntitiesCard>
  );
}

function Template() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <ThemeProvider includeThemeControls />
      <Column fullWidth gap="1rem">
        <p>The following renders the low battery devices in an EntitiesCard component</p>
        <Row gap="1rem" fullWidth>
          <RenderDevices />
        </Row>
      </Column>
    </HassConnect>
  );
}

export default {
  title: "HOOKS/useLowDevices",
  component: Template,
  tags: ["autodocs"],
  parameters: {
    centered: true,
    height: "auto",
    docs: {
      page: () => (
        <>
          <Title />
          <h5>
            <mark>{`useLowDevices({ min = 0, max = 20, blacklist = [], whitelist = [] })`}</mark>
          </h5>
          <Description />
          <p>The following is the use of the hook in it's default form:</p>
          <Source dark code={`const lowDevices = useLowDevices();`} />
          <ArgTypes />
          <Template />
          <p>Here's the source code for the above EntitiesCard:</p>
          <Source
            dark
            code={`
function RenderDevices() {
  const devices = useLowDevices();
  return (
    <EntitiesCard
      includeLastUpdated
    >
      {devices.map(device => <EntitiesCardRow key={device.entity_id} entity={device.entity_id as EntityName} renderState={(entity) => {
        return (
          <div>
            {entity.state}
            {entity.attributes.unit_of_measurement}
          </div>
        );
      }} />)}
    </EntitiesCard>
  );
}
          `}
          />
        </>
      ),
      description: {
        component: `A hook that will generate a list of devices that are below a certain battery percentage. This is useful for generating a list of devices that need to be charged.`,
      },
    },
  },
  argTypes: {
    min: {
      control: "number",
      description: "The minimum battery percentage to retrieve",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "0" },
      },
    },
    max: {
      control: "number",
      description: "The maximum battery percentage to retrieve",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "20" },
      },
    },
    blacklist: {
      table: {
        type: { summary: "array" },
        defaultValue: { summary: "[]" },
      },
      control: "array",
      description: `If there's entities returning in the results, that you want to exclude, you can provide a partial entity_id match to exclude it`,
    },
    whitelist: {
      table: {
        type: { summary: "array" },
        defaultValue: { summary: "[]" },
      },
      control: "array",
      description: `If there's entities returning in the results, but you only want certain entities, provide a partial entity_id match to include them`,
    },
  },
} satisfies Meta;

export type Story = StoryObj;
export const Docs: Story = {
  args: {},
};
