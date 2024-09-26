import { Client } from "node-scp";
import * as dotenv from "dotenv";
import { join } from "path";
import chalk from "chalk";
import { access, constants, readdir, lstat, readFile, writeFile, unlink } from "fs/promises";
dotenv.config();

// This script will upload the contents of the addon to home assistant in the /addons/hakit directory
// so when we change something, we can just "reinstall" the addon and it will be updated

const USERNAME = process.env.VITE_SSH_USERNAME;
const PASSWORD = process.env.VITE_SSH_PASSWORD;
const HOST_OR_IP_ADDRESS = process.env.VITE_SSH_HOSTNAME;
const PORT = 22;
const REMOTE_FOLDER_NAME = "hakit";
const LOCAL_DIRECTORY = process.cwd(); // Parent directory
const REMOTE_PATH = `/addons/${REMOTE_FOLDER_NAME}`;
const EXCLUDE_FROM_COPY = [
  "node_modules",
  "config",
  "scripts",
  "dist",
  ".env",
  "options.json",
  // these files are technically excluded, but manually copied
  // to change the name of the addon as well as other properties within these files
  // so they're different from the production addon
  "config.json",
  "package.json",
  "package-lock.json"
]; // Add directories you want to exclude

async function checkDirectoryExists(directory) {
  try {
    await access(directory, constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

async function modifyAndUploadConfigJson(client, remotePath) {
  const localConfigPath = join(LOCAL_DIRECTORY, "config.json");
  const remoteConfigPath = join(remotePath, "config.json");
  const tempConfigPath = join(LOCAL_DIRECTORY, "temp_config.json");

  try {
    // Read and modify the local config.json
    const data = await readFile(localConfigPath, 'utf8');
    const json = JSON.parse(data);
    json.name = `${json.name}-dev`;
    json.slug = `${json.slug}-dev`;
    json.panel_title = `${json.panel_title}-dev`;
    json.panel_icon = 'mdi:dev-to';

    // Write the modified config.json to a temporary file
    await writeFile(tempConfigPath, JSON.stringify(json, null, 2), 'utf8');

    // Upload the modified config.json to the remote path
    await client.uploadFile(tempConfigPath, remoteConfigPath);

    // Remove the temporary config file
    await unlink(tempConfigPath);

    console.info(chalk.blue("Updated config.json with -dev suffix on Home Assistant"));
  } catch (err) {
    console.error(chalk.red("Error modifying config.json on Home Assistant:", err.message));
  }
}

async function modifyAndUploadPackageJson(client, remotePath) {
  const files = ['package', 'package-lock'];
  for (const file of files) {
    const localConfigPath = join(LOCAL_DIRECTORY, `${file}.json`);
    const remoteConfigPath = join(remotePath, `${file}.json`);
    const tempConfigPath = join(LOCAL_DIRECTORY, `temp_${file}.json`);

    try {
      // Read and modify the local package.json
      const data = await readFile(localConfigPath, 'utf8');
      const json = JSON.parse(data);
      json.name = `${json.name}-dev`;

      // Write the modified package.json to a temporary file
      await writeFile(tempConfigPath, JSON.stringify(json, null, 2), 'utf8');

      // Upload the modified package.json to the remote path
      await client.uploadFile(tempConfigPath, remoteConfigPath);

      // Remove the temporary package file
      await unlink(tempConfigPath);

      console.info(chalk.blue(`Updated ${file}.json with -dev suffix on Home Assistant`));
    } catch (err) {
      console.error(chalk.red("Error modifying config.json on Home Assistant:", err.message));
    }
  }
}

async function uploadDirectory(client, localPath, remotePath) {
  const files = await readdir(localPath);

  for (const file of files) {
    const localFilePath = join(localPath, file);
    const remoteFilePath = join(remotePath, file);
    const fileStat = await lstat(localFilePath);

    if (EXCLUDE_FROM_COPY.includes(file)) {
      console.info(chalk.yellow(`Skipping excluded directory/file: ${file}`));
      continue;
    }

    if (fileStat.isDirectory()) {
      await client.mkdir(remoteFilePath);
      await uploadDirectory(client, localFilePath, remoteFilePath);
    } else {
      await client.uploadFile(localFilePath, remoteFilePath);
    }
  }
}

async function deploy() {
  try {
    if (!USERNAME) {
      throw new Error("Missing VITE_SSH_USERNAME in .env file");
    }
    if (!PASSWORD) {
      throw new Error("Missing VITE_SSH_PASSWORD in .env file");
    }
    if (!HOST_OR_IP_ADDRESS) {
      throw new Error("Missing VITE_SSH_HOSTNAME in .env file");
    }
    const exists = await checkDirectoryExists(LOCAL_DIRECTORY);
    if (!exists) {
      throw new Error(
        "Missing parent directory, have you run `npm run build`?",
      );
    }
    const client = await Client({
      host: HOST_OR_IP_ADDRESS,
      port: PORT,
      username: USERNAME,
      password: PASSWORD,
    });

    const remote = `${REMOTE_PATH}`;
    const remoteExists = await client.exists(remote);
    if (!remoteExists) {
      await client.mkdir(remote); // Create the directory if it doesn't exist
    }
    // empty the directory initially so we remove anything that doesn't need to be there
    try {
      await client.rmdir(remote); // Remove the directory recursively
      await client.mkdir(remote); // Recreate the directory
    } catch (e) {
      // directory may not exist, ignore
    }

    console.info(
      chalk.blue("Uploading", `"${LOCAL_DIRECTORY}"`, "to", `"${remote}"`),
    );

    // upload the folder to your home assistant server
    await uploadDirectory(client, LOCAL_DIRECTORY, remote);
    // Modify the config.json file on the Home Assistant instance
    await modifyAndUploadConfigJson(client, remote);
    // Modify the package.json file on the Home Assistant instance
    await modifyAndUploadPackageJson(client, remote);
    client.close(); // remember to close connection after you finish
    console.info(chalk.green("\nSuccessfully deployed!"));
  } catch (e) {
    console.info(chalk.red("Error:", e.message || "unknown error"));
  }
}

deploy();
