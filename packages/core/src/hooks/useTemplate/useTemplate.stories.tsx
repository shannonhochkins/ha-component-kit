import { Story, Source, Title, Description, ArgTypes } from "@storybook/blocks";
import type { Meta, StoryObj } from "@storybook/react";
import { useTemplate, useEntity } from "@hakit/core";
import { ThemeProvider, Column, Alert, Row, FabCard } from "@components";
import { HassConnect } from "@hass-connect-fake";

const templateCodeToProcess = `
{% if is_state(entity_id, "on") %}
  The entity is on!!
{% else %}
  The entity is not on!!
{% endif %}
`;

const exampleUsage = `
import { useTemplate } from "@hakit/core";
function RenderCustomTemplate() {
  const template = useTemplate({
    template: templateCodeToProcess,
    variables: { entity_id: 'light.fake_light_1' }
  });
  return <>
    Template result: {template ?? 'loading'}
  </>
}
`;

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
      <Source dark code={exampleUsage} />
    </Column>
  );
}

function Template() {
  return (
    <HassConnect hassUrl="http://homeassistant.local:8123">
      <ThemeProvider includeThemeControls />
      <Column fullWidth gap="1rem" alignItems="flex-start" justifyContent="flex-start">
        <SubscribeTemplateExample />
      </Column>
    </HassConnect>
  );
}

export default {
  title: "HOOKS/useTemplate",
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
          <ArgTypes />
          <p>The following is the use of the hook in it's default form:</p>
          <Source
            dark
            code={`const template = useTemplate({
  template: '{{ is_state_attr("climate.air_conditioner", "state", "heat") }}',
});`}
          />
          <p>Here's a working example of how this hook functions when connected to entities:</p>
          <Template />
        </>
      ),
      description: {
        component: `A hook to render templates the same way home assistant allows you to through yaml files. This hook will automatically update whenever something changes that should indicate the template should be updated, This hook will follow all available features with template (https://www.home-assistant.io/docs/configuration/templating) specified and handled from Home Assistant.`,
      },
    },
  },
  argTypes: {
    template: {
      control: "text",
      description: "The template expression to process",
      table: {
        type: { summary: "string" },
      },
    },
    entity_ids: {
      control: "object",
      description: "The entity ids or id to watch for changes, this has been marked as @deprecated and may not be needed to use this",
      table: {
        type: { summary: "EntityName | EntityName[]" },
      },
    },
    variables: {
      control: "object",
      description:
        "Variables to define to use within the template\n@example\nvariables: { entity_id: 'climate.air_conditioner' }\nYou can now use entity_id in your template expression",
      table: {
        type: { summary: "Record<string, unknown>" },
      },
    },
    timeout: {
      control: "number",
      description: "Amount of time that should pass before aborting the template request",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "undefined" },
      },
    },
    strict: {
      control: "boolean",
      description: "Should the template renderer be strict, raise on undefined variables etc",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    report_errors: {
      control: "boolean",
      description: "Should the template renderer report any errors",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
  },
} satisfies Meta;

export type Story = StoryObj;
export const Docs: Story = {
  args: {},
};
