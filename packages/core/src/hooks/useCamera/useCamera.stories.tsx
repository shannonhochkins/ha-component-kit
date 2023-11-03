import { Story, Source, Title, Description, ArgTypes } from "@storybook/blocks";
import type { Meta, StoryObj } from "@storybook/react";

export default {
  title: "HOOKS/useCamera",
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
          <p>Here's how you could use the hook to render the poster in an image:</p>
          <Source
            dark
            code={`
import { useCamera } from '@hakit/core';
import { PreloadImage } from '@hakit/components';
function RenderCamera() {
  const camera = useCamera();
  return {camera.poster.url && !camera.poster.loading && <PreloadImage lazy src={camera.poster.url} style={{
    width: '100%',
    aspectRatio: 16 / 9,
  }} />})
}
          `}
          />
          <h3>Motion JPEG</h3>
          <p>
            If supported, the motion jpeg by default is the same size that the camera is setup to record with, if you wish to change this so
            it's a smaller image, you can do this through yaml in your configuration.yaml
          </p>
          <Source
            dark
            language="yaml"
            code={`
camera:
  - platform: proxy
    entity_id: camera.<existingcamera>
    max_stream_width: <desired_width>
    max_stream_height: <desired_height>  # Optional          
            `}
          />
          <h3>Options</h3>
          <ArgTypes />
        </>
      ),
      description: {
        component: `The useCamera hook is designed to return all the custom complex logic in an easy to retrieve structure, it supports streams, motion jpeg, posters and the camera entity, it returns the standard camera entity, with the additional properties of stream, mjpeg & poster.`,
      },
    },
  },
  argTypes: {
    entity: {
      control: "string",
      description: "The name of your camera entity",
    },
    ["options.imageWidth"]: {
      control: "number",
      description: "The requested width of the poster image",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "640" },
      },
    },
    ["options.aspectRatio"]: {
      control: "number",
      description: "The requested aspect ratio of the image",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "9/16" },
      },
    },
    ["options.poster"]: {
      control: "boolean",
      description: "Enable/disable the request for the poster",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    ["options.stream"]: {
      control: "boolean",
      description: "Enable/disable the request for the stream",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
  },
} satisfies Meta;

export type Story = StoryObj;
export const Docs: Story = {
  args: {},
};
