import { Story, Source, Title, Description, ArgTypes } from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DummyComponent, DummyComponent2 } from "./examples/DummyComponent";
import useAreasCode from "./examples/useAreas.code?raw";

export default {
  title: "core/hooks/useAreas",
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
          <p>Here&apos;s how you could use the hook to render multiple AreaCards</p>
          <Source dark code={useAreasCode} />
          <h4>Returned Value</h4>
          <p>The hook will return a list of areas:</p>
          <ArgTypes of={DummyComponent} />
          <p>An area has the following properties</p>
          <ArgTypes of={DummyComponent2} />
        </>
      ),
      description: {
        component: `A hook that will retrieve all the areas configured in home assistant and the related entities, services, floors and devices, this will return all information about the area like the name, picture and the area id.`,
      },
    },
  },
} satisfies Meta;

export type Story = StoryObj;
export const Docs: Story = {
  args: {},
};
