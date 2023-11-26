import { Client } from 'node-scp';
import * as dotenv from 'dotenv';
import { join } from 'path';
import chalk from 'chalk';
import { access, constants } from 'fs/promises';
dotenv.config();

const HA_URL = process.env.VITE_HA_URL;
const USERNAME = process.env.VITE_SSH_USERNAME;
const PASSWORD = process.env.VITE_SSH_PASSWORD;
const HOST_OR_IP_ADDRESS = process.env.VITE_SSH_HOSTNAME;
const PORT = 22;
const REMOTE_FOLDER_NAME = process.env.VITE_FOLDER_NAME;
const LOCAL_DIRECTORY = './dist';
const REMOTE_PATH = `/www/${REMOTE_FOLDER_NAME}`;

async function checkDirectoryExists() {
  try {
    await access(LOCAL_DIRECTORY, constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

async function deploy() {
  try {
    if (!HA_URL) {
      throw new Error('Missing VITE_HA_URL in .env file');
    }
    if (!REMOTE_FOLDER_NAME) {
      throw new Error('Missing VITE_FOLDER_NAME in .env file');
    }
    if (!USERNAME) {
      throw new Error('Missing VITE_SSH_USERNAME in .env file');
    }
    if (!PASSWORD) {
      throw new Error('Missing VITE_SSH_PASSWORD in .env file');
    }
    if (!HOST_OR_IP_ADDRESS) {
      throw new Error('Missing VITE_SSH_HOSTNAME in .env file');
    }
    const exists = await checkDirectoryExists();
    if (!exists) {
      throw new Error('Missing ./dist directory, have you run `npm run build`?');
    }
    const client = await Client({
      host: HOST_OR_IP_ADDRESS,
      port: PORT,
      username: USERNAME,
      password: PASSWORD,
    });
    // seems somewhere along the lines, home assistant decided to rename the config directory to homeassistant...
    const directories = ['config', 'homeassistant'];
    let matched = false;
    for (const dir of directories) {
      const remote = `/${dir}${REMOTE_PATH}`;
      const exists = await client.exists(`/${dir}`);
      if (exists) {
        matched = true;
        // empty the directory initially so we remove anything that doesn't need to be there
        try {
          await client.rmdir(remote);
        } catch (e) {
          // directory may not exist, ignore
        }
        console.info(chalk.blue('Uploading', `"${LOCAL_DIRECTORY}"`, 'to', `"${remote}"`))
        // upload the folder to your home assistant server
        await client.uploadDir(LOCAL_DIRECTORY, remote);
        client.close(); // remember to close connection after you finish
        console.info(chalk.green('\nSuccessfully deployed!'));
        const url = join(HA_URL, '/local', REMOTE_FOLDER_NAME, '/index.html');
        console.info(chalk.blue(`\n\nVISIT the following URL to preview your dashboard:\n`));
        console.info(chalk.bgCyan(chalk.underline(url)));
        console.info(
          chalk.yellow(
            '\n\nAlternatively, follow the steps in the ha-component-kit repository to install the addon for Home Assistant so you can load your dashboard from the sidebar!\n\n'
          )
        );
        console.info('\n\n');
        break;
      }
    }
    if (!matched) {
      throw new Error(
        'Could not find a config/homeassistant directory in the root of your home assistant installation.'
      );
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(chalk.red('Error:', e.message ?? 'unknown error'));
    }
  }
}

deploy();
