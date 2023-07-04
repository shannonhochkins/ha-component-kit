import { Source } from "@storybook/blocks";
import type { Meta, StoryObj } from "@storybook/react";
import {
  ThemeProvider,
  Group,
  SceneCard,
  SceneCardProps,
} from "ha-component-kit";
import { HassConnect } from "@stories/HassConnectFake";
// @ts-expect-error - Don't have types for jsx-to-string
import jsxToString from "jsx-to-string";

function Template() {
  return (
    <HassConnect hassUrl="fake">
      <ThemeProvider />
      <Group title="Examples">
        <SceneCard entity="scene.good_morning" title="xx" />
      </Group>
    </HassConnect>
  );
}

function ExampleDocs() {
  return (
    <div>
      <h2>ButtonCard</h2>
      <p>
        This component is designed to make it very easy to use and control a
        device, the code below is all you need to control your device.
      </p>
      <p>
        This will automatically extract the friendly name, icon, state and group
        of the entity to render the ButtonCard below
      </p>
      <Template />
      <h3>Source Code</h3>
      <p>
        This example shows how you can use the Group component to create a group
        of cards.
      </p>
      <Source code={jsxToString(Template())} />
    </div>
  );
}

function Render(args: SceneCardProps) {
  return (
    <HassConnect hassUrl="fake">
      <ThemeProvider />
      <SceneCard {...args} />
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/Cards/SceneCard",
  component: SceneCard,
  tags: ["autodocs"],
  parameters: {
    width: "100%",
  },
  argTypes: {
    title: { control: "text" },
  },
} satisfies Meta<typeof SceneCard>;
export type Story = StoryObj<typeof SceneCard>;
export const Example: Story = {
  render: Render,
  args: {
    entity: "scene.good_morning",
  },
};
