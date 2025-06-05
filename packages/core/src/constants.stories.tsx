import { Story, Source } from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Column, Row } from "@components";
import { ReactNode } from "react";
import { Divider } from "@mui/material";

const constants: {
  name: string;
  description: ReactNode;
  exampleUsage: string;
  comment?: string;
  autoImport?: boolean;
}[] = [
  {
    name: "UNAVAILABLE",
    description: 'A constant for the string "unavailable"',
    exampleUsage: `const isUnavailable = entity.state === UNAVAILABLE; // or to use the helper isUnavailableState(entity.state)`,
  },
  {
    name: "UNKNOWN",
    description: 'A constant for the string "unknown"',
    exampleUsage: `const isUnknown = entity.state === UNKNOWN; // or to use the helper isUnavailableState(entity.state)`,
  },
  {
    name: "ON",
    description: 'A constant for the string "on"',
    exampleUsage: `const isOn = entity.state === ON; // or to use the helper stateActive(entity.state)`,
  },
  {
    name: "OFF",
    description: 'A constant for the string "off"',
    exampleUsage: `const isOff = entity.state === OFF; // or to use the helper isOffState(entity.state)`,
  },
  {
    name: "UNIT_C",
    description: 'A constant for the string "°C"',
    exampleUsage: `const isCelsius = entity.attributes.unit_of_measurement === UNIT_C;`,
  },
  {
    name: "UNIT_F",
    description: 'A constant for the string "°F"',
    exampleUsage: `const isFahrenheit = entity.attributes.unit_of_measurement === UNIT_F;`,
  },
  {
    name: "DOMAINS_WITH_DYNAMIC_PICTURE",
    description: "A constant for the list of domains that support dynamic picture properties",
    exampleUsage: `const hasDynamicPicture = DOMAINS_WITH_DYNAMIC_PICTURE.includes('camera');`,
  },
  {
    name: "DEFAULT_STATES",
    description: 'A constant for the list of default states for entities, "on", "off, "unknown" and "unavailable"',
    exampleUsage: `const isDefaultState = DEFAULT_STATES.includes(entity.state);`,
  },
  {
    name: "UNAVAILABLE_STATES",
    description: "A constant for the list of states that are considered unavailable",
    exampleUsage: `const isUnavailable = UNAVAILABLE_STATES.includes(entity.state); // or to use the helper isUnavailableState(entity.state)`,
  },
  {
    name: "OFF_STATES",
    description: "A constant for the list of states that are considered off",
    exampleUsage: `const isOff = OFF_STATES.includes(entity.state); // or to use the helper isOffState(entity.state)`,
  },
  {
    name: "COLORS",
    description: "A constant for a list of colors to use if you wish, useful for using dynamic colors based on an entity list of sorts",
    exampleUsage: `const firstColor = COLORS[0]`,
  },
];

export default {
  title: "core/Constants",
  tags: ["autodocs"],
  parameters: {
    hideImportExample: true,
    hidePrimary: true,
    hideComponentProps: true,
    centered: true,
    height: "auto",
    afterDescription: (
      <>
        <p>There&apos;s a series of available constants for you to use from @hakit/core</p>
        <Row fullWidth alignItems="flex-start" justifyContent="flex-start">
          {constants.map(({ name, autoImport = true, comment = "", description, exampleUsage }) => (
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
