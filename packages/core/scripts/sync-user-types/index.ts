// purposely adding js extensions here so the extensions stay in the output.
import { connect } from './connection.js';
import { generateActionTypes } from './action-generator.js';
import { generateEntityType } from './entity-generator.js';
import { writeFileSync } from 'fs';
import { DEFAULT_FILENAME } from './constants.js';
import { format, Options } from "prettier";

export interface TypeSyncOptions {
  url: string;
  token: string;
  outDir?: string;
  filename?: string;
  /** this is used internally to generate the default supported actions, you will most definitely need to leave this as true */
  custom?: boolean;
  domainWhitelist?: string[];
  domainBlacklist?: string[];
  /**
   * @deprecated use actionWhitelist instead
   */
  serviceWhitelist?: string[];
  /**
   * @deprecated use actionBlacklist instead
   */
  serviceBlacklist?: string[];
  actionWhitelist?: string[];
  actionBlacklist?: string[];
  prettier?: {
    options: Options;
    disable: boolean;
  }
}

export async function typeSync({
  url,
  token,
  outDir: _outDir,
  filename = DEFAULT_FILENAME,
  domainWhitelist = [],
  domainBlacklist = [],
  serviceWhitelist = [],
  serviceBlacklist = [],
  actionBlacklist = [],
  actionWhitelist = [],
  custom = true,
  prettier,
}: TypeSyncOptions) {
  if (!url || !token) {
    throw new Error('Missing url or token arguments');
  }
  const warning = `
  // this is an auto generated file, do not change this manually
  `;
  
  const { actions, states } = await connect(url, token);
  
  const actionInterfaces = await generateActionTypes(actions, {
    domainWhitelist,
    domainBlacklist,
    actionWhitelist: [...serviceWhitelist, ...actionWhitelist],
    actionBlacklist: [...serviceBlacklist, ...actionBlacklist],
  });
  const output = custom ? `
    ${warning}
    import { ActionFunction, ActionFunctionTypes, VacuumEntityState } from "@hakit/core";
    declare module '@hakit/core' {
      export interface CustomSupportedActions<T extends ActionFunctionTypes = "target"> {
        ${actionInterfaces}
      }
      /**
       * @deprecated use the CustomSupportedActions interface instead
       * */
      export type CustomSupportedServices<T extends ActionFunctionTypes = "target"> = CustomSupportedActions<T>;
      export interface CustomEntityNameContainer {
        names: ${generateEntityType(states)};
      }
    }
  ` : `
    ${warning}
    import type { ActionFunctionTypes, ActionFunction } from "./";
    export interface DefaultActions<T extends ActionFunctionTypes = "target"> {
      ${actionInterfaces}
    }
    /**
     * @deprecated use the DefaultActions interface instead
     * */
    export type DefaultServices<T extends ActionFunctionTypes = "target"> = DefaultActions<T>;
  `;
  const outDir = _outDir || process.cwd();

  const formatted = prettier?.disable ? output: await format(output, {
    parser: 'typescript',
    ...prettier?.options
  });
  // now write the file
  writeFileSync(`${outDir}/${filename}`, formatted);
  console.info(`Succesfully generated types: ${outDir}/${filename}\n\n`);
  // reminder to add the generated file to the tsconfig.app.json include array
  console.info(`IMPORTANT: Don't forget to add the "${filename}" file to your tsconfig.app.json include array\n\n`);
}