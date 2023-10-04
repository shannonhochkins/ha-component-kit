#!/usr/bin/env node
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { typeSync } from './index.js';
import { DEFAULT_FILENAME } from './constants.js';

const argv = yargs(hideBin(process.argv))
  .option('url', {
    alias: 'u',
    type: 'string',
    requiresArg: true,
    description: 'Homeassistant url',
  })
  .option('token', {
    alias: 't',
    requiresArg: true,
    type: 'string',
    description: 'Long lived access token from the bottom of your home assistant profile page',
  })
  .option('outDir', {
    alias: 'o',
    requiresArg: false,
    type: 'string',
    description: 'Where the files should be written to, defaults to current working directory',
  })
  .option('filename', {
    alias: 'n',
    requiresArg: false,
    type: 'string',
    default: DEFAULT_FILENAME,
    description: 'The filename for the generated file',
  })
  .option('serviceWhitelist', {
    alias: 'sw',
    requiresArg: false,
    type: 'array',
    description: 'A whitelist of services to generate types for',
  })
  .option('serviceBlacklist', {
    alias: 'sb',
    requiresArg: false,
    type: 'array',
    description: 'A blacklist of services to generate types for',
  })
  .option('domainWhitelist', {
    alias: 'dw',
    requiresArg: false,
    type: 'array',
    description: 'A whitelist of domain to generate types for',
  })
  .option('domainBlacklist', {
    alias: 'db',
    requiresArg: false,
    type: 'array',
    description: 'A blacklist of domain to generate types for',
  })
  .help()
  .parseSync();

const { url, token, domainBlacklist = [], domainWhitelist = [], serviceBlacklist = [], serviceWhitelist = [], outDir, filename } = argv;


async function main() {
  try {
    await typeSync({
      url: url as string,
      token: token as string,
      serviceWhitelist: serviceWhitelist as string[],
      serviceBlacklist: serviceBlacklist as string[],
      domainWhitelist: domainWhitelist as string[],
      domainBlacklist: domainBlacklist as string[],
      outDir,
      filename,
    });
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
    } else {
      console.log('Error: ', e);
    }
    process.exit(1);
  }
  process.exit(0);
}

main();