import { Client } from 'node-scp';
import * as dotenv from 'dotenv';
dotenv.config();

const USERNAME = process.env.VITE_SSH_USERNAME;
const PASSWORD = process.env.VITE_SSH_PASSWORD;
const HOST_OR_IP_ADDRESS = process.env;
const PORT = 22;
const REMOTE_FOLDER_NAME = process.env.VITE_FOLDER_NAME;
const LOCAL_DIRECTORY = './dist';

const REMOTE_PATH = `/config/www/${REMOTE_FOLDER_NAME}`;

console.log(`Deploying to ${USERNAME}:${PASSWORD}@${HOST_OR_IP_ADDRESS}:${PORT}:${REMOTE_PATH}`)


async function deploy() {
  try {
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
    console.log('Successfully deployed!')
  } catch (e: unknown) {
    console.log('Error:', e)
  }
}

deploy()