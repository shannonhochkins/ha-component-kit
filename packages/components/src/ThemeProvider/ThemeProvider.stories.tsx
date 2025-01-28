import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Source } from "@storybook/blocks";
import { ThemeProvider, theme, Alert } from "@components";
import { HassConnect } from "@hass-connect-fake";
import { merge } from "lodash";
import { convertToCssVars } from "./helpers";
import type { ThemeProviderProps } from "@components";
import jsxToString from "react-element-to-jsx-string";
import { ThemeControlsProps } from "./ThemeControls";
import { DEFAULT_THEME_OPTIONS } from "./constants";
import { redirectToStory } from '../../../../.storybook/redirect';

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
  const [customTheme] = useState<Omit<ThemeControlsProps, "onChange">>({
    darkMode: DEFAULT_THEME_OPTIONS.darkMode,
    tint: DEFAULT_THEME_OPTIONS.tint,
    hue: DEFAULT_THEME_OPTIONS.hue,
    saturation: DEFAULT_THEME_OPTIONS.saturation,
    lightness: DEFAULT_THEME_OPTIONS.lightness,
    contrastThreshold: DEFAULT_THEME_OPTIONS.contrastThreshold,
  });
  return (
    <HassConnect hassUrl="http://localhost:8123" {...args}>
      <h2>Theme Provider</h2>
      <p>
        A simple way of creating global styles and providing re-usable css variables to re-use across your custom home assistant dashboard.
      </p>
      <Source
        dark
        code={`
<ThemeProvider
  hue={${customTheme.hue}}
  lightness={${customTheme.lightness}}
  saturation={${customTheme.saturation}}
  darkMode={${customTheme.darkMode}}
  contrastThreshold={${customTheme.contrastThreshold}}
  tint={${customTheme.tint}}
/>
        `}
        language="tsx"
      />
      <ThemeProvider {...customTheme} theme={args?.theme} includeThemeControls />
      <h2>Global styles</h2>
      <p>
        We can also update styles globally for most components, meaning theming becomes quite easy to manage, a simple way of defining
        global styles and have them apply to your whole application is by utilizing the globalStyles prop
      </p>
      <Source
        dark
        code={`<ThemeProvider globalStyles={\`
  body {
    background: red !important;
  }
\`} />`}
        language="tsx"
      />
      <h2>Global Component styles</h2>
      <p>A simple way of updating styles for all modals for example, globally</p>
      <Source
        dark
        code={`<ThemeProvider globalComponentStyles={{
  modal: \`
    background: red !important;
  \`
}} />`}
        language="tsx"
      />
      <h2>Other Properties</h2>
      <p>
        You do not need to provide the following theme object, this is the default, if you want to extend/change anything you can just pass
        in your overrides.
      </p>
      <Alert
        type="info"
        title="NOTE"
        style={{
          marginTop: "1rem",
        }}
      >
        You can pass anything to the theme object and the css variables will be created!
      </Alert>
      <Source dark code={`<ThemeProvider theme={${JSON.stringify(theme, null, 2)}} />`} language="tsx" />
      <p>Available CSS Variables:</p>
      <Source dark code={`${convertToCssVars(theme).replace(/^\s+/gm, "")}`} language="tsx" />
      <p>
        The ThemeProvider can be used as is with no props and you&apos;ll have access to all available css variables defined under the
        importable type `ThemeParams` from `@hakit/components`;
      </p>
      <p>
        The css variables take the input theme object (which is of type `ThemeParams`) and converts the keys & nested keys to kebab case to
        access easily.
      </p>
      <h3>Custom Example:</h3>
      <Source dark code={jsxToString(CustomThemeProvider())} />

      <p>
        The above will not only apply the font family to pre-existing css variable, it will also create a css variable for all the defaults
        and your custom properties / overrides:
      </p>
      <p>
        <b>Note: </b>Strings are converted to raw values so if you&apos;re expecting a &quot;string&quot; as the css value make sure you
        wrap in double quotes `&apos;&quot;Arial&quot;`, additionally, any camelCase strings will be converted to kebab case for the css
        variables
      </p>

      <Source dark code={convertToCssVars(merge(theme, customTheme) as object).replace(/^\s+/gm, "")} />
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
      <h3>Breakpoints</h3>
      <p>
        You can also customize the breakpoints used for your dashboard if you wish and the defaults aren&quot;t working for you, see more{" "}
        <a href="#" onClick={(e) => {
          e.preventDefault();
          redirectToStory('/docs/introduction-responsive-layouts-breakpoints--docs');
        }}>here</a>.
      </p>
    </HassConnect>
  );
}

export default {
  title: "COMPONENTS/ThemeProvider",
  component: ThemeProvider,
  tags: ["autodocs"],
  parameters: {
    padding: "2rem",
    docs: {
      canvas: {
        sourceState: "none",
      },
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
