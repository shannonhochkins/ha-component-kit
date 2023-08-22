import type { Meta, StoryObj } from "@storybook/react";
import {
  Title,
  Description,
  Primary,
  ArgTypes,
  Source,
} from "@storybook/blocks";
import { ThemeProvider, theme } from "@components";
import { HassConnect } from "@stories/HassConnectFake";
import { merge } from "lodash";
import { convertToCssVars } from "./helpers";
import type { ThemeProviderProps } from "@components";
// @ts-expect-error - Don't have types for jsx-to-string
import jsxToString from "jsx-to-string";

const customTheme: ThemeProviderProps<{
  anything: {
    button: {
      background: string;
    };
    cardWidth: string;
  };
}>["theme"] = {
  font: {
    family: '"Arial"',
  },
  anything: {
    button: {
      background: "red",
    },
    cardWidth: "100px",
  },
};
function CustomThemeProvider() {
  return <ThemeProvider theme={customTheme} />;
}

function Render(args: Story["args"]) {
  const theme = args?.theme || {};
  return (
    <HassConnect hassUrl="http://localhost:8123" {...args}>
      <h2>Theme Provider</h2>
      <p>
        A simple way of creating global styles and providing re-usable css
        variables to re-use across your application
      </p>
      <p>
        You do not need to provide the following theme object, this is the
        default, if you want to extend/change anything you can just pass in your
        overrides.
      </p>
      <p>
        <i>
          <b>Note: </b> You can pass anything to the theme object and the css
          variables will be created!
        </i>
      </p>
      <ThemeProvider theme={args?.theme} />
      <Source
        dark
        code={`<ThemeProvider theme={${JSON.stringify(theme, null, 2)}} />`}
        language="tsx"
      />
      <p>Available CSS Variables:</p>
      <Source
        dark
        code={`${convertToCssVars(theme).replace(/^\s+/gm, "")}`}
        language="tsx"
      />
      <p>
        The ThemeProvider can be used as is with no props and you'll have access
        to all available css variables defined under the importable type
        `ThemeParams` from `@hakit/components`;
      </p>
      <p>
        The css variables take the input theme object (which is of type
        `ThemeParams`) and converts the keys & nested keys to kebab case to
        access easily.
      </p>
      <h3>Custom Example:</h3>
      <Source dark code={jsxToString(CustomThemeProvider())} />

      <p>
        The above will not only apply the font family to pre-existing css
        variable, it will also create a css variable for all the defaults and
        your custom properties / overrides:
      </p>
      <p>
        <b>Note: </b>Strings are converted to raw values so if you're expecting
        a "string" as the css value make sure you wrap in double quotes
        `'"Arial"'`, additionally, any camelCase strings will be converted to
        kebab case for the css variables
      </p>

      <Source
        dark
        code={convertToCssVars(merge(theme, customTheme) as object).replace(
          /^\s+/gm,
          "",
        )}
      />
      <p>Which you can use simply in emotion/scss/less/css etc:</p>

      <Source
        dark
        code={`body {
    \tfont-family: var(--ha-font-family);
    }
    button {
    \tbackground-color: var(--ha-font-family);
    }`.replace(/^[ ]+/gm, "")}
      />
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/ThemeProvider",
  component: ThemeProvider,
  parameters: {
    padding: "2rem",
    docs: {
      page: () => (
        <>
          <Title />
          <Description />
          <Primary />
          <h2>Component Props</h2>
          <ArgTypes />
        </>
      ),
    },
  },
} satisfies Meta<typeof ThemeProvider>;
export type Story = StoryObj<typeof ThemeProvider>;
export const Example: Story = {
  render: Render,
  args: {
    theme,
  },
};

// import { Story, Source, Title, Description, ArgTypes } from "@storybook/blocks";
// import type { Meta, StoryObj, Args } from "@storybook/react";
// import { ThemeProvider } from "./";

// import { theme } from "./theme";

// function Template(args: Args) {
//   return (
//     <div>
//         <h2>Theme Provider</h2>
//         <p>Update the JSON data under "controls" to show the change that will be applied to global styles and the available css variables.</p>
//         <ThemeProvider theme={args.theme} />
//         <Source code={`<ThemeProvider theme={${JSON.stringify(args.theme, null, 2)}} />`} language="tsx" />
//         <p>Available CSS Variables:</p>
//         <Source code={`${convertToCssVars(args.theme).replace(/^\s+/gm, '')}`} language="tsx" />
//     </div>
//   );
// }

// const Page = () => (<>
//   <Title />
//   <Description />

//   <h2>Component Props</h2>
//   <ArgTypes of={ThemeProvider} />
// </>);

// export default {
//   title: "COMPONENTS/ThemeProvider",
//   component: Template,
//   parameters: {
//     layout: "centered",
//     width: "100%",
//     docs: {
//       description: {
//           component:
//               '`<ThemeProvider />` is a simple way of creating global styles and providing re-usable css variables to re-use across your application.'
//       },
//       page: Page
//   }
//   },
//   args: {
//     theme
//   },
//   argTypes: {
//     theme: {
//       control: {
//         type: 'object',
//       },
//     },
//   }
// } satisfies Meta<typeof Template>;

// export type Story = StoryObj<typeof ThemeProvider>;

// export const Playground = Template.bind({});
