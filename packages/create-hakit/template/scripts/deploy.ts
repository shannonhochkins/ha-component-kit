import { Client } from 'node-scp';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { access, constants } from 'fs/promises';
dotenv.config();

const HA_URL = process.env.VITE_HA_URL;
const USERNAME = process.env.VITE_SSH_USERNAME;
const PASSWORD = process.env.VITE_SSH_PASSWORD;
const HOST_OR_IP_ADDRESS = process.env.VITE_SSH_HOSTNAME;
const PORT = 22;
const REMOTE_FOLDER_NAME = process.env.VITE_FOLDER_NAME;
const LOCAL_DIRECTORY = './dist';
const REMOTE_PATH = `/config/www/${REMOTE_FOLDER_NAME}`;

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
    console.log(`Deploying to ${USERNAME}:${PASSWORD}@${HOST_OR_IP_ADDRESS}:${PORT}:${REMOTE_PATH}`)
    const client = await Client({
      host: HOST_OR_IP_ADDRESS,
      port: PORT,
      username: USERNAME,
      password: PASSWORD,
    })
    // empty the directory initially so we remove anything that doesn't need to be there
    try {
      await client.rmdir(REMOTE_PATH);
    } catch (e) {
      // directory may not exist, ignore
    }
    // upload the folder to your home assistant server
    await client.uploadDir(LOCAL_DIRECTORY, REMOTE_PATH);
    client.close() // remember to close connection after you finish
    console.log('\nSuccessfully deployed!');
    const url = join(HA_URL, '/local', REMOTE_FOLDER_NAME, '/index.html');
    console.log(`\n\nVISIT the following URL to preview your dashboard:\n`);
    console.log(url);
    console.log('\n\n');
  } catch (e: unknown) {
    console.log('Error:', e)
  }
}

deploy();