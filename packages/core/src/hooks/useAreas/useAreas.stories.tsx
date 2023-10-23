import { Story, Source, Title, Description } from "@storybook/blocks";
import type { Meta, StoryObj } from "@storybook/react";

export default {
  title: "HOOKS/useAreas",
  tags: ["autodocs"],
  parameters: {
    centered: true,
    height: "auto",
    docs: {
      page: () => (
        <>
          <Title />
          <h5>
            <mark>{`useAreas()`}</mark>
          </h5>
          <Description />
          <p>The following is the use of the hook:</p>
          <Source dark code={`const areas = useAreas();`} />
          <p>Here's how you could use the hook to render multiple AreaCards</p>
          <Source
            dark
            code={`
import { useAreas } from '@hakit/core';
import { AreaCard, EntitiesCard } from '@hakit/components';
function RenderAreas() {
  const areas = useAreas();
  return areas.map(area => <AreaCard key={area.area_id} title={area.name} image={area.picture} hash={area.area_id}>
    <EntitiesCard entities={area.entities.map(entity => entity.entity_id as EntityName)} />
  </AreaCard>)
}
          `}
          />
        </>
      ),
      description: {
        component: `A hook that will retrieve all the areas configured in home assistant and the related entities, services and devices, this will return all information about the area like the name, picture and the area id.`,
      },
    },
  },
} satisfies Meta;

export type Story = StoryObj;
export const Docs: Story = {
  args: {},
};
