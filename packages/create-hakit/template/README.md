## Prerequisites
Node version manager - [NVM](https://github.com/nvm-sh/nvm) to easily install and manage node versions

## Local Development
Simply, run `nvm use && npm i && npm run dev` and it will start a local server for you to develop on, it will also watch for changes and reload the page for you. 

## Dependencies

```json
Node.js >=18.0.0
npm >=7.0.0
```

## Building
Run `npm run build` and it will build the files for you, you can then upload them to your home assistant instance using the deploy script mentioned below.

## Deploy to Home Assistant via SSH
1. Replace the values in the .env file provided with your `VITE_SSH_USERNAME`, `VITE_SSH_HOSTNAME` and `VITE_SSH_PASSWORD`.
2. To automatically deploy to your home assistant instance, you can run `npm run deploy` after you've retrieved the SSH information specified [here](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/introduction-deploying--docs), NOTE! The script has already been created for you, you just need to run it after you've updated the .env values.
3. The `VITE_FOLDER_NAME` is the folder that will be created on your home assistant instance, this is where the files will be uploaded to.

## Folder name & Vite
The `VITE_FOLDER_NAME` is the folder that will be created on your home assistant instance, this is where the files will be uploaded to. If you change the `VITE_FOLDER_NAME` variable, it will also update the `vite.config.ts` value named `base` to the same value so that when deployed using the deployment script the pathname's are correct.

## Typescript Sync

1. Replace the values in the `.env` file provided with your own if the script hasn't handled this for you already
2. The `VITE_HA_URL` should be a https url if you want to sync your types successfully.
3. The `VITE_HA_TOKEN` instructions can be found [here](https://shannonhochkins.github.io/ha-component-kit/?path=/docs/introduction-typescriptsync--docs) under the pre-requisites section.

Once you have both the above environment variables set, you can run `npm run sync` and it will create a file for you, you then just have to add it to the tsconfig.json.

### HA TOKEN
The token by default will only be used by local development and the sync-script, if you wish to have your token bundled with your project you can move the declaration in the `.env.development` file to the `.env` file, then remove the `.env.development` file as well as update the `scripts/sync-types.ts` file to remove the `.env.development` loader.

## Further documentation
For further documentation, please visit the [documentation website](https://shannonhochkins.github.io/ha-component-kit/) for more information.



