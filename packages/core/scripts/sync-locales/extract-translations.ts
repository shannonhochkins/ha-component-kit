import fs from 'fs';
import path from 'path';
import { type Connection, createLongLivedTokenAuth, createConnection } from "home-assistant-js-websocket";
import { createSocket } from '../sync-user-types/connection';
const OUTPUT_PATH = path.resolve(__dirname, '../../src/hooks/useLocale/locales');
const TYPES_FILE_PATH = path.join(OUTPUT_PATH, 'types.ts');

const longValueMapping: Record<string, boolean> = {};
const keyMapping: Record<string, string> = {};

function generateShortKey(longKey: string, value: string, isBaseGeneration?: boolean): string | null {
  if (longValueMapping[longKey]) {
    return null;
  }
  if (keyMapping[longKey]) {
    return keyMapping[longKey];
  }

  const words = (isBaseGeneration ? value : longKey).split(' ');

  if (words.length > 7) {
    longValueMapping[longKey] = true;
    return null;
  }

  let shortKey;
  if (words.length === 1) {
    shortKey = words[0].toLowerCase();
  } else if (words.length <= 4) {
    shortKey = words.map(word => word.toLowerCase()).join('_');
  } else {
    shortKey = longKey; // For long keys, use the original for now
    const suffix = longKey.split('.').pop();
    if (suffix && !(suffix in keyMapping)) {
      shortKey = suffix;
    }
    // try the last two properties of the key
    const parts = longKey.split('.');
    if (parts.length > 1) {
      const lastTwo = parts.slice(-2).join('.');
      if (!(lastTwo in keyMapping)) {
        shortKey = lastTwo;
      }
    }
  }
  // Replace all non-alphabetic characters with spaces, trim, and replace spaces with single underscores
  shortKey = shortKey
    .replace(/[^a-zA-Z]/g, ' ')  // Replace all non-alphabetic characters with spaces
    .trim()                      // Trim leading and trailing spaces
    .replace(/\s+/g, '_')        // Replace spaces with underscores
    .replace(/_+/g, '_');        // Replace multiple underscores with a single underscore
  keyMapping[longKey] = shortKey || longKey;
  return shortKey;
}

type Translation = {
  hash: string;
  nativeName: string;
};

type Locale = {
  code: string;
  hash: string;
  name: string;
}
export async function extractTranslations(filePath: string): Promise<Record<string, Translation>> {
  // Read the contents of the JavaScript file
  const fileContents = fs.readFileSync(filePath, 'utf-8');

  // Regular expression to match the `translations` JSON string
  const translationsRegex = /"translations":(\{(?:[^{}]|\{[^{}]*\})*\})/s;

  // Find the match for the `translations` JSON string
  const match = translationsRegex.exec(fileContents);

  if (!match || match.length < 2) {
    throw new Error('Translations JSON object not found');
  }
  // Extract and parse the JSON string
  const translationsJson = match[1];
  let translations;

  try {
    translations = JSON.parse(translationsJson);
  } catch (error) {
    throw new Error('Error parsing translations JSON: ' + error.message);
  }
  return translations as Record<string, Translation>;
}
const categories = [
  'title',
  'entity',
  'state',
  'entity_component',
  // 'exceptions',
  'config', // 500 odd entries
  'config_panel', // nothing really
  'options',
  'device_automation', // 500 odd entries
  // 'mfa_setup',
  // 'system_health',
  'application_credentials',  // nothing really
  // 'issues',
  'selector',
  'services',
  'conversation',
];

export async function getConnection(url: string, token: string): Promise<{
  connection: Connection
}> {
  try {
    const auth = createLongLivedTokenAuth(url, token);
    const connection = await createConnection({
      auth,
      // @ts-expect-error - no way to fix this without providing an override for the types
      // as the websocket definition is different
      createSocket: () => createSocket(auth),
    });
    return {
      connection
    }
  } catch (err) {
    console.error('err', err);
    throw new Error('Failed to connect to Home Assistant');
  }
}

export const fetchTranslations =  async (langs: string[], combinedTranslations: Record<string, Record<string, string>>): Promise<void> => {
  const { connection } = await getConnection(process.env.VITE_HA_URL!, process.env.VITE_HA_TOKEN!);
  await Promise.all(
    categories.map(async (category) => {
      await Promise.all(langs.map(async (lang) => {
        try {
          const response = await connection.sendMessagePromise<{ resources: Record<string, string> }>({
            type: "frontend/get_translations",
            category,
            language: lang,
          });
          // if (lang === 'en') {
          //   fs.writeFileSync(path.join(OUTPUT_PATH, 'en', `${category}-debug.json`), JSON.stringify(response.resources, null, 2));
          // }
          combinedTranslations[lang] = {
            ...combinedTranslations[lang],
            ...response.resources,
          };
        } catch (e) {
          console.log('err', e);
        }
    }));
    
  }));
  connection.close();
}

function removeDuplicatesByValue(keyMap: Record<string, string>): Record<string, string> {
  // Create a new map to store the shortest key for each unique value
  const valueToKeyMap = new Map<string, string>();

  // Iterate over the entries of the keyMap
  for (const [key, value] of Object.entries(keyMap)) {
      // Check if the value already exists in the map
      if (valueToKeyMap.has(value)) {
          // Get the existing key for this value
          const existingKey = valueToKeyMap.get(value);
          // If the new key is shorter, update the map
          if (existingKey && key.length < existingKey.length) {
              valueToKeyMap.set(value, key);
          }
      } else {
          // If the value does not exist in the map, add it
          valueToKeyMap.set(value, key);
      }
  }

  // Create a new object to store the result
  const result: Record<string, string> = {};
  // Populate the result object with the shortest keys and their values
  for (const [value, key] of valueToKeyMap.entries()) {
    result[key] = value;
  }

  return result;
}

export async function downloadTranslations(translations: Record<string, Translation>): Promise<void> {
  const baseUrl = 'http://homeassistant.local:8123/static/translations';
  const locales: Array<Locale> = [];
  const combinedTranslations: Record<string, Record<string, string>> = {};

  if (fs.existsSync(OUTPUT_PATH)) {
    fs.rmSync(OUTPUT_PATH, { recursive: true });
  }

  for (const [lang, data] of Object.entries(translations)) {
    const hash = data.hash;
    const nativeName = data.nativeName;
    const urls = [
      `${baseUrl}/${lang}-${hash}.json`,
      `${baseUrl}/lovelace/${lang}-${hash}.json`,
    ];

    const langDir = path.join(OUTPUT_PATH, lang);
    if (!fs.existsSync(langDir)) {
      fs.mkdirSync(langDir, { recursive: true });
    }

    for (const url of urls) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const jsonData = await response.json();
          combinedTranslations[lang] = {
            ...combinedTranslations[lang],
            ...jsonData,
          };
        } else {
          console.error(`Failed to download ${url}: ${response.statusText}`);
        }
      } catch (error) {
        console.error(`Error downloading ${url}:`, error);
      }
    }
    // Add locale entry
    locales.push({ code: lang, hash, name: nativeName });
  }

  await fetchTranslations(locales.map(locale => locale.code), combinedTranslations);
  // generate keys from english originally
  for (const [longKey, value] of Object.entries(combinedTranslations['en'])) {
    // will create a cache
    generateShortKey(longKey, value, true);
    // console.log('converting', longKey, 'to', shortKey);
  }
  // console.log('writing english debug bug')
  // fs.writeFileSync(path.join(OUTPUT_PATH, 'en', 'en-debug.json'), JSON.stringify(combinedTranslations['en'], null, 2));
  const keys = new Set<string>();
  // here i want to create a singular json file with all translations merged
  // Write the combined translations for each language to their respective files
  for (const [lang, translations] of Object.entries(combinedTranslations)) {
    const filePath = path.join(OUTPUT_PATH, lang, `${lang}.json`);
    const keyMap: Record<string, string> = {};
    for (const [longKey, value] of Object.entries(translations)) {
      const shortKey = generateShortKey(longKey, value);
      if (shortKey) {
        // add the key if it doesn't exist
        keyMap[shortKey] = value;
      }
    }
    const newData = removeDuplicatesByValue(keyMap);
    // now, add all the keys to the set
    Object.keys(newData).forEach(key => keys.add(key));
    fs.writeFileSync(filePath, JSON.stringify(removeDuplicatesByValue(keyMap), null, 2), {
      encoding: 'utf-8'
    });
  }
  generateIndexFile(locales);
  generateTypeDefinitions(keys, locales);

}

const generateTypeDefinitions = (keys: Set<string>, locales: Locale[]) => {
  const typeDefinition = `// This file is dynamically generated
export type Locales = ${locales.map(locale => `'${locale.code}'`).join(' | ')};
export type LocaleKeys = ${Array.from(keys).map(key => `'${key}'`).join(' | ')};`;

  fs.writeFileSync(TYPES_FILE_PATH, typeDefinition,{
    encoding: 'utf-8'
  });
  console.log(`Generated: ${TYPES_FILE_PATH}`);
};


// Function to generate index.ts file
const generateIndexFile = (locales: { code: string, hash: string, name: string }[]) => {
  const indexPath = path.join(OUTPUT_PATH, 'index.ts');
  const content = `// This file is dynamically generated
type LocaleData = Record<LocaleKeys, string>;
import { type Locales, LocaleKeys } from './types';
const CACHE: Partial<Record<Locales, LocaleData>> = {};
const locales = ${JSON.stringify(locales, null, 2)} satisfies Array<{
  code: Locales;
  hash: string;
  name: string;
}>;

export default locales.map(locale => ({
  ...locale,
  async fetch(): Promise<LocaleData> {
    const cached = CACHE[locale.code];
    if (typeof cached !== 'undefined') return cached;
    const data : {
      default: LocaleData
    } = await import(\`./\${locale.code}/\${locale.code}.json\`);
    CACHE[locale.code] = data.default;
    return data.default;
  }
}));`;

  fs.writeFileSync(indexPath, content, {
    encoding: 'utf-8'
  });
  console.log(`Generated: ${indexPath}`);
};

