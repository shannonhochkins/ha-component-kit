# How to use
This simply loads up the current home assistant instance, downloads the application javascript file and extracts the hash variables so we can download all the files locally from the local instance.

NOTE: This script should be run on the latest version of home assistant so that the latest translations are downloaded.

## Usage
You can run this directly here in this directory by running the following command:
```bash
npm i && npm run sync
```

Or, you can run at the top level of the repository by running the following command:
```bash
npm run sync-locales
```

NOTE: You will need to add VITE_HA_URL and VITE_HA_TOKEN to a .env file locally in this folder to run this script.

The above will replace all the locales in the `packages/core/src/hooks/useLocale/locales` directory with the latest translations from the local instance.

Types are auto generated and exported in the package so you can import them in your project like so:
```js
import { locales, useLocale, useLocales, localize, type Locales, type LocaleKeys } from '@hakit/core';
```

## Locales variable
This is a list of all the available locales, including their hash names, but also including a fetch method which will download the assets and cache locally

```
const locale = locales.find(({ code }) => code === 'en');
const data = await locale.fetch();
console.log(data)
```

