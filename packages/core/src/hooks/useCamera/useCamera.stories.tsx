import { Story, Source, Title, Description, ArgTypes } from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DummyComponentReturn, DummyComponentOptions } from "./examples/DummyComponent";
import basicExample from "./examples/basic.code?raw";
import yamlConfiguration from "./examples/yaml.code.yaml?raw";


export default {
  title: "core/hooks/useCamera",
  tags: ["autodocs"],
  parameters: {
    centered: true,
    height: "auto",
    docs: {
      page: () => (
        <>
          <Title />
          <h5>
            <mark>{`useCamera(entity: FilterByDomain<EntityName, "camera">, options: UseCameraOptions)`}</mark>
          </h5>
          <Description />
          <p>The following is the use of the hook:</p>
          <Source dark code={`const camera = useCamera('camera.some_camera');`} />
          <p>Here&apos;s how you could use the hook to render the poster in an image:</p>
          <Source dark code={basicExample} />
          <h3>Motion JPEG</h3>
          <p>
            If supported, the motion jpeg by default is the same size that the camera is setup to record with, if you wish to change this so
            it&apos;s a smaller image, you can do this through yaml in your configuration.yaml
          </p>
          <Source
            dark
            language="yml"
            code={yamlConfiguration}
          />
          <h3>Options</h3>
          <p>Here&apos;s the available options</p>
          <ArgTypes of={DummyComponentOptions} />
          <h3>Returned value</h3>
          <p>The hook will return a camera entity with the following properties:</p>
          <ArgTypes of={DummyComponentReturn} />
        </>
      ),
      description: {
        component: `The useCamera hook is designed to return all the custom complex logic in an easy to retrieve structure, it supports streams, motion jpeg, posters and the camera entity, it returns the standard camera entity, with the additional properties of stream, mjpeg & poster.`,
      },
    },
  },
} satisfies Meta;

export type Story = StoryObj;
export const Docs: Story = {
  args: {},
};
