import { Story, Source, Title, Description } from "@storybook/blocks";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Tabs, Tab, Divider, Box} from '@mui/material';
import { DEFAULT_FILENAME } from '../packages/core/scripts/sync-user-types/constants';
import { TypeSyncOptions } from '@hakit/core/sync';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function TypeSync(props: TypeSyncOptions) {
  return <div {...props}>IGNORE</div>
}

function Template() {
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return <>
    
    <h2>Prerequisites</h2>
    <ol>
      <li>Install the latest version of @hakit/core:<br /><br />
      <Source dark code="npm i @hakit/core@latest" />
      </li>
      <li style={{
        marginTop: 24
      }}>Create a <a href="https://developers.home-assistant.io/docs/auth_api/#long-lived-access-token" target="_blank">Long Lived Access Token</a> for your home assistant instance. You can create one in your home assistant instance at the bottom of your profile page.</li>
    </ol>
    <Divider />

    <h2>Execution Method</h2>

    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Typescript" />
          <Tab label="Javascript" />
          <Tab label="CLI" />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
      <p>Install ts-node as a dev dependency, <mark>npm i ts-node -D</mark>, create a sync-types.ts file in the root directory and add this filename to the includes array of your tsconfig.json.</p>

      <Source dark code={`
// sync-types.ts
import { typeSync } from '@hakit/core/sync';

async function runner() {
  await typeSync({
    url: 'YOUR_HOME_ASSISTANT_URL',
    token: 'YOUR_LONG_LIVED_TOKEN'
  });
}
runner();
      `} />

      <p>This is the recommended package.json setup for your project so your types sync every time you build the project:</p>
      <Source dark code={`
"scripts": {
  "build": "your build script",
  "prebuild": "npm run sync-types",
  "sync-types": "ts-node --esm sync-types.ts"
}
      `} />

      <p>Then just simply run `npm run sync-types` or `npm run build` and you should see your types generated in the current working directory.</p>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>

      <p>Create a sync-types.js file in the root directory:</p>

      <Source dark code={`
// sync-types.js
const { typeSync } = require('@hakit/core/sync');

async function runner() {
  await typeSync({
    url: 'https://rwdwrtzkr59smlxgb934b72q647a3zr1.ui.nabu.casa',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJmN2M1YzkwYmYxMGM0ZjI2YjdkYjI4NDI1MDI3YWViZSIsImlhdCI6MTY5MjU5NDQ1MCwiZXhwIjoyMDA3OTU0NDUwfQ.QbdMf_A0nVovZNyV5ZPpeRaqWfz4NwWnXuhV5pQ0WCw'
  })
}

runner();
      `} />

<p>This is the recommended package.json setup for your project so your types sync every time you build the project:</p>
      <Source dark code={`
"scripts": {
  "build": "your build script",
  "prebuild": "npm run sync-types",
  "sync-types": "node sync-types.js"
}`}/>

      <p>Then just simply run `npm run sync-types` or `npm run build` and you should see your types generated in the current working directory.</p>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <p>Once you have the latest, you should be able to run the following in a terminal:</p>
        <Source dark code="hakit-sync-types --token YOUR_LONG_LIVED_TOKEN -url YOUR_HOME_ASSISTANT_URL" />
        <p>To find see other properties that are available:</p>
        <Source dark code="hakit-sync-types --help" />
      </CustomTabPanel>
    </Box>
    <Divider />

    

    <h2>Output</h2>

    <p>All of the above will generate a <mark>{DEFAULT_FILENAME}</mark> file (by default) in the current working directory unless the <mark>outDir</mark> or <mark>filename</mark> flag was provided to either the cli script or the node script.
    You will then have to link this to your tsconfig file in the <mark>include</mark> section before you import your src files.</p>

    <Source dark code={`
// tsconfig.json
{
  "include": [
    "sync-types.ts",
    "${DEFAULT_FILENAME}", // Note: if you provided a custom filename flag or outDir this will need to change to reflect your name/path
    "src",
  ]
}
    `} />

    <h2>Result</h2>
    <p>If successful, when you import a hook of say "useEntity" you should get complete intellisense for services and entities!</p>

    <h1>Extending Entities</h1>
    <p>By default, @hakit/core will support all defined entities that the home assistant repository also supports, there may be cases for you to extend or add your own types for domains that aren't pre-processed.</p>
    <p>For example, if the base types for the calendar domain aren't up to scratch, you can create your own extension of the types.</p>
    <p>First, create a file called <mark>custom-entities.d.ts</mark> in the root of your project.</p>
    <p>Then, add the following code:</p>
    <Source dark code={`
import '@hakit/core';
declare module "@hakit/core" {
  interface CalendarEntity {
    attributes: {
      start_time: string;
    }
  }
  export interface DefinedPropertiesByDomain {
    ['calendar']: CalendarEntity;
  }
}
    `} />
    <p>Then link this to the includes array of your tsconfig.json</p>
    <Source dark code={`
// tsconfig.json
{
  "include": [
    "sync-types.ts",
    "custom-entities.d.ts",
    "${DEFAULT_FILENAME}",
    "src",
  ]
}
    `} />
    <p>By default, the start_time property may not be a string, however this will allow you to extend the base entity to include start_time as the expected value.</p>
  </>
}

export default {
  title: "INTRODUCTION/TypescriptSync",
  component: TypeSync,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    width: "100%",
    docs: {
      page: () => (
        <>
          <Title />
          <Description />
          <Template />
        </>
      ),
      description: {
        component: `Extends the typescript types for @hakit/core & @hakit/components on the consumer side so that you have full intellisense of your entities/services available on your home assistant instance. There's a cli script and a node script available to generate/sync the types.\n If your home assistant instance adds new entities or new services, simply re-run the script!`
      }
    }
  },
} satisfies Meta<typeof TypeSync>;

export type Story = StoryObj<typeof Template>;
export const Docs = Template.bind({});






