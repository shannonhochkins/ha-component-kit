import { Story, Source, Title, Description, ArgTypes } from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useTemplate, useEntity } from "@hakit/core";
import { ThemeProvider, Column, Alert, Row, FabCard, ThemeControlsModal } from "@components";
import { HassConnect } from "@hass-connect-fake";
import { templateCodeToProcess } from "./examples/constants";
import basicExample from "./examples/basic.code?raw";
import simpleExample from "./examples/simple.code?raw";
import { DummyComponentOptions } from './examples/DummyComponent';

function SubscribeTemplateExample() {
  const entity = useEntity("light.fake_light_1");
  const template = useTemplate({
    template: templateCodeToProcess,
    variables: { entity_id: "light.fake_light_1" },
  });
  return (
    <Column
      alignItems="flex-start"
      justifyContent="flex-start"
      fullWidth
      style={{
        backgroundColor: "var(--ha-S100)",
        borderRadius: "0.25rem",
        padding: "1rem",
      }}
    >
      <Row gap="1rem">
        <Alert type="warning" title={`Current entity state: "${entity.state}", toggle the button to trigger the change`} />
        <FabCard entity={"light.fake_light_1"} service="toggle" />
      </Row>
      <Source dark code={`// templateCodeToProcess\r${templateCodeToProcess}`} />
      <Alert type="info" title={`Template result: ${template ?? "loading"}`} />
      <Alert type="warning" title="Here's the source code for the above template example:" cssStyles={`margin-top: 2rem;`} />
      <Source dark code={basicExample} />
    </Column>
  );
}

function Template() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <ThemeProvider />
      <ThemeControlsModal />
      <Column fullWidth gap="1rem" alignItems="flex-start" justifyContent="flex-start">
        <SubscribeTemplateExample />
      </Column>
    </HassConnect>
  );
}

export default {
  title: "core/hooks/useTemplate",
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
            <mark>{`useTemplate(params: TemplateParams)`}</mark>
          </h5>
          <Description />
          <h4>Params definition</h4>
          <ArgTypes of={DummyComponentOptions} />
          <p>The following is the use of the hook in it&apos;s default form:</p>
          <Source dark code={simpleExample} />
          <p>Here&apos;s a working example of how this hook functions when connected to entities:</p>
          <Template />
        </>
      ),
      description: {
        component: `A hook to render templates the same way home assistant allows you to through yaml files. This hook will automatically update whenever something changes that should indicate the template should be updated, This hook will follow all available features with template (https://www.home-assistant.io/docs/configuration/templating) specified and handled from Home Assistant.`,
      },
    },
  },
} satisfies Meta;

export type Story = StoryObj;
export const Docs: Story = {
  args: {},
};
