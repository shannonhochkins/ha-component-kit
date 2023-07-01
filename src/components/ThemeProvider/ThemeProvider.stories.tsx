import { Story, Source, Title, Description } from "@storybook/blocks";
import { ArgsTable } from '@storybook/addon-docs';
import type { Meta, StoryObj, Args } from "@storybook/react";
import { ThemeProvider } from "./";
import { convertToCssVars } from "./helpers";
import { theme } from "./theme";

function Template(args: Args) {
  return (
    <div>
        <h2>Theme Provider</h2>
        <p>Update the JSON data under "controls" to show the change that will be applied to global styles and the available css variables.</p>
        <ThemeProvider theme={args.theme} />
        <Source code={`<ThemeProvider theme={${JSON.stringify(args.theme, null, 2)}} />`} language="tsx" />
        <p>Available CSS Variables:</p>
        <Source code={`${convertToCssVars(args.theme).replace(/^\s+/gm, '')}`} language="tsx" />
    </div>
  );
}

const Page = () => (<>
  <Title />
  <Description />
  <p>The ThemeProvider can be used as is with no props and you'll have access to all available css variables defined under the importable type `ThemeParams` from `ha-component-kit`;</p>
  <p>The css variables take the input theme object (which is of type `ThemeParams`) and converts the keys & nested keys to kebab case to access easily.</p>
  <h3>Example:</h3>
  <Source code={`
  <ThemeProvider
    theme={{
      font: {
        family: '"Arial"'
      },
      anything: {
        button: {
          background: 'red';
        },
        cardWidth: '100px'
      }
    }}
  />
  `} />

  <p>Will not only apply the font family to variable already, it will also create a css variable for all the defaults and your custom property / overrides:</p>
  <p><b>Note: </b>Strings are converted to raw values so if you're expecting a "string" as the css value make sure you wrap in double quotes `'"Arial"'`, additionally, any camelCase strings will be converted to kebab case for the css variables</p>

  <Source code={`
--ha-background: #232323;
--ha-color: #ddd;
--ha-font-family: "Arial";
--ha-font-size: 16px;
--ha-anything-button-background: red;
--ha-anything-card-width: 100px;
  `} />
  <p>Which you can use simply in native css:</p>

  <Source code={`
body {
  font-family: var(--ha-font-family);
}
button {
  background-color: var(--ha-font-family);
}
  `} />
  <h2>Component Props</h2>
  <ArgsTable of={ThemeProvider} />
</>);

export default {
  title: "COMPONENTS/ThemeProvider",
  component: Template,
  parameters: {
    layout: "centered",
    width: "100%",
    docs: {
      description: {
          component:
              '`<ThemeProvider />` is a simple way of creating global styles and providing re-usable css variables to re-use across your application.'
      },
      page: Page
  }
  },
  args: {
    theme
  },
  argTypes: {
    theme: {
      control: {
        type: 'object',
      },
    },
  }
} satisfies Meta<typeof Template>;

export type Story = StoryObj<typeof ThemeProvider>;

export const Playground = Template.bind({});
