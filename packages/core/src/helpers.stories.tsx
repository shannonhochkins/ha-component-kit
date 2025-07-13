import { Story, Source } from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Column, Row } from "@components";
import { ReactNode } from "react";
import { Divider } from "@mui/material";

const helpers: {
  name: string;
  description: ReactNode;
  exampleUsage: string;
  comment?: string;
  autoImport?: boolean;
}[] = [
  {
    name: "isUnavailableState",
    description: 'Returns true if the state of the entity is unavailable is "unavailable" or "unknown"',
    exampleUsage: `const isUnavailable = isUnavailableState(entity.state);`,
    comment: "// use within component context and with available entity",
  },
  {
    name: "isOffState",
    description: 'Returns true if the state of the entity is "off", "unknown" or "unavailable"',
    exampleUsage: `const isOff = isOffState(entity.state);`,
    comment: "// use within component context and with available entity",
  },
  {
    name: "supportsFeatureFromAttributes",
    description: "Returns true if the entity supports the feature provided",
    comment: "// use within component context and with available entity, the feature number is the bitwise value of the feature",
    exampleUsage: `const supportsTurnOff = supportsFeatureFromAttributes(entity.attributes, 256);`,
  },
  {
    name: "stateActive",
    comment: "// use within component context and with available entity",
    description:
      'Returns true if the state of the entity is determined active, this works for all supported entity types, for example a alarm_control_panel will return true if the state is not "disarmed", or a light is "on"',
    exampleUsage: `const isActive = stateActive(entity.state);`,
  },
  {
    name: "computeStateDisplay",
    comment: "// use within component context and with available entity",
    description: "Returns the state of the entity in a human readable format",
    autoImport: false,
    exampleUsage: `
import { computeStateDisplay, useStore } from '@hakit/core';
import { HassEntity } from 'home-assistant-js-websocket';
export default function EntityState({ entity }: {
  entity: HassEntity;
}) {
  const config = useStore((state) => state.config);
  const entities = useStore((store) => store.entities);
  const connection = useStore((store) => store.connection);
  const computeState = useCallback(
    () => computeStateDisplay(entity, connection as Connection, config as HassConfig, entities, entity.state),
    [config, connection, entities, entity],
  );
  return (
    {computeState()}
  );
}    
    `,
  },
  {
    name: "computeAttributeValueDisplay",
    description:
      "Returns the value of the attribute in a human readable format, automatically adding suffix like °C for temperature or kWh for energy",
    comment: "// use within component context and with available entity",
    autoImport: false,
    exampleUsage: `
import { computeAttributeValueDisplay, useStore } from '@hakit/core';
export default function EntityAttribute({ entity, attribute }: {
  entity: HassEntity;
  attribute: string;
}) {
  const config = useStore((state) => state.config);
  const entities = useStore((store) => store.entities);
  const connection = useStore((store) => store.connection);
  const isUnavailable = isUnavailableState(entity.state);
  const computeAttribute = useCallback(
    (attribute: string) => computeAttributeValueDisplay(entity, config as HassConfig, entities, attribute),
    [entity, config, entities],
  );
  return (
    {computeAttribute(attribute)}
  );
}

    `,
  },
  {
    name: "computeDomainTitle",
    description: "Returns a readable title for the domain of the entity in a localized language",
    comment: "// use within component context and with available entity",
    exampleUsage: `const title = computeDomainTitle('light.some_entity'); // Light`,
  },
  {
    name: "computeDomain",
    description: "Returns the domain of the entity",
    comment: "// use within component context and with available entity",
    exampleUsage: `const domain = computeDomain('light.some_entity'); // light`,
  },
  {
    name: "getCssColorValue",
    description: "Returns the color value of the entity in various formats",
    comment: "// use within component context and with available entity",
    exampleUsage: `const color = getCssColorValue(entity); // color.hexColor, color.rgbaColor etc`,
  },
  {
    name: "timeAgo",
    description: "Returns a human readable time ago string from a date",
    exampleUsage: `const timeAgoString = timeAgo(new Date());`,
  },
  {
    name: "lightSupportsColorMode",
    description: "Returns true if the light supports the expected color mode",
    comment: "// use within component context and with available entity",
    exampleUsage: `const supportsRgb = lightSupportsColorMode(entity, 'hs');`,
  },
  {
    name: "lightIsInColorMode",
    description: 'Returns true if the light is in the "color_mode" type.',
    comment: "// use within component context and with available entity",
    exampleUsage: `const isInRgb = lightIsInColorMode(entity);`,
  },
  {
    name: "lightSupportsColor",
    description: "Returns true if the light supports color",
    comment: "// use within component context and with available entity",
    exampleUsage: `const supportsColor = lightSupportsColor(entity);`,
  },
  {
    name: "lightSupportsBrightness",
    description: "Returns true if the light supports brightness",
    comment: "// use within component context and with available entity",
    exampleUsage: `const supportsBrightness = lightSupportsBrightness(entity);`,
  },
  {
    name: "getLightCurrentModeRgbColor",
    description: 'Returns the current color of the light in either "rgbww_color", "rgbw_color" or "rgb_color"',
    comment: "// use within component context and with available entity",
    exampleUsage: `const color = getLightCurrentModeRgbColor(entity);`,
  },
  {
    name: "getColorByIndex",
    description: <>Returns the color of the index in the color list, 50+ colors are supported, you can also COLORS from @hakit/core.</>,
    autoImport: false,
    exampleUsage: `
import { getColorByIndex, COLORS } from '@hakit/core';
const color = getColorByIndex(0); // this equals COLORS[0]
`,
  },
  {
    name: "stateColorBrightness",
    description: "Returns the brightness of the color of the entity as a css value `brightness(43%)` for example",
    comment: "// use within component context and with available entity",
    autoImport: false,
    exampleUsage: `
import { stateColorBrightness, useEntity } from '@hakit/core';
function Component() {
  const entity = useEntity('light.fake_light_1');
  const brightness = stateColorBrightness(entity);  
  return (
    <div style={{ filter: brightness.css }}>
      {entity.state}
    </div>
  );
}
    `,
  },
  {
    name: "Color Conversion",
    autoImport: false,
    description:
      "There are a series of color conversion functions available for you to use, for example converting RGB to HEX or HEX to RGB, blending colors, darken colors",
    exampleUsage: `
import {
  hex2rgb, // convert hex to rgb
  rgb2hex, // convert rgb to hex
  rgb2lab, // convert rgb to lab
  lab2rgb, // convert lab to rgb
  lab2hex, // convert lab to hex
  rgb2hsv, // convert rgb to hsv
  hsv2rgb, // convert hsv to rgb
  rgb2hs, // convert rgb to hs
  hs2rgb, // convert hs to rgb
  hexBlend, // Blend 2 hex colors: c1 is placed over c2, blend is c1's opacity.
  labDarken, // Darken a lab color
  labBrighten, // Brighten a lab color
  luminosity, // Get the luminosity of an rgb color
  rgbContrast, // Get the contrast of 2 rgb colors
  getRGBContrastRatio, // Get the contrast ratio of 2 rgb colors
} from '@hakit/core';`,
  },
  {
    name: "temperature2rgb",
    description: "Converts a temperature in Kelvin to an RGB color",
    comment: "",
    exampleUsage: `
const rgb = temperature2rgb(3000);
const div = document.createElement('div');
div.style.background = \`rgb(\${rgb.join(',')})\`;    
`,
  },
];

export default {
  title: "core/Helpers",
  tags: ["autodocs"],
  parameters: {
    hideImportExample: true,
    hidePrimary: true,
    hideComponentProps: true,
    centered: true,
    height: "auto",
    afterDescription: (
      <>
        <p>There&apos;s a series of available helpers for you to use from @hakit/core</p>
        <Row fullWidth alignItems="flex-start" justifyContent="flex-start">
          {helpers.map(({ name, autoImport = true, comment = "", description, exampleUsage }) => (
            <Row key={name} fullWidth alignItems="flex-start" justifyContent="flex-start">
              <Column fullWidth alignItems="flex-start" justifyContent="flex-start">
                <h3
                  style={{
                    marginTop: 24,
                  }}
                >
                  {name}
                </h3>
                <p
                  style={{
                    margin: 0,
                    padding: 0,
                  }}
                >
                  {description}.
                </p>
                <Source dark code={`${autoImport ? `import { ${name} } from '@hakit/core';\n` : ""}${comment ?? ""}\n${exampleUsage}`} />
                <Divider
                  style={{
                    width: "100%",
                  }}
                />
              </Column>
            </Row>
          ))}
        </Row>
      </>
    ),
  },
} satisfies Meta;

export type Story = StoryObj;
export const Docs: Story = {
  args: {},
};
