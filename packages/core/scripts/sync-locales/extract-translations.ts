import fs from 'fs';
import path from 'path';
import { type Connection, createLongLivedTokenAuth, createConnection } from "home-assistant-js-websocket";
import { createSocket } from '../sync-user-types/connection';
// Simple debug facility (stderr) - toggle to silence or enable diagnostics
const DEBUG = false;
function debug(msg: string) {
  if (DEBUG) console.error(`[locale-sync] ${msg}`);
}
const OUTPUT_PATH = path.resolve(__dirname, '../../src/hooks/useLocale/locales');
const TYPES_FILE_PATH = path.join(OUTPUT_PATH, 'types.ts');

// ========================= CONFIGURATION CONSTANTS =========================
// WORD_COUNT_REMOVE_THRESHOLD: Any key in any language whose value word count is >= this threshold
// will be removed entirely from all languages (aggressive trimming of long descriptions).
const WORD_COUNT_REMOVE_THRESHOLD = 10;

// Values with >=4 words previously retained full original key.
// We now attempt short tail compression for ALL non-slugged values to reduce verbosity.
const LONG_VALUE_WORD_COUNT = 6;

// picking a slice of the long key to use as default, when shortening
const LONG_KEY_SLICE_SIZE = 3;

// Prefix applied when slugging values that start with a digit (numeric-leading values).
// Allows us to still shorten verbose original dotted keys while making the semantic explicit.
const LEADING_DIGIT_VALUE_PREFIX = 'value.';

// ==========================================================================

// Ephemeral mapping used during generation: original English key -> final key (possibly slug)
const keyMapping: Record<string, string> = {};

// Slugify English value (<4 words rule) -> key candidate
function createSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // drop punctuation/specials
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
}

// Attempt to derive a shorter fallback key from the tail segments of the original dotted key.
// Algorithm:
//   Start with last LONG_KEY_SLICE_SIZE segments (or all if < LONG_KEY_SLICE_SIZE). If that candidate is unused, accept.
//   Otherwise prepend one more segment (i.e. increase slice size by 1) and retry until unique or full key length reached.
//   If no unique shorter candidate found, return originalKey.
function createShortFallbackKey(originalKey: string, used: Record<string, string>): string {
  const parts = originalKey.split('.').filter(Boolean);
  if (!parts.length) return originalKey;
  const startLen = Math.min(LONG_KEY_SLICE_SIZE, parts.length); // initial slice size
  for (let len = startLen; len <= parts.length; len++) {
    const candidate = parts.slice(parts.length - len).join('.');
    if (!used[candidate]) return candidate;
  }
  return originalKey; // all candidates taken; fall back to original
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

function asyncReadFile(filePath: string): Promise<string> {
  return new Promise((resolve, reject) =>
    fs.readFile(filePath, 'utf-8', (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    })
  );
}
export async function extractTranslations(filePath: string): Promise<Record<string, Translation>> {
  // Read the contents of the JavaScript file
  const fileContents = await asyncReadFile(filePath);

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
    throw new Error('Error parsing translations JSON: ' + error);
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

export const fetchTranslations = async (langs: string[], combinedTranslations: Record<string, Record<string, string>>): Promise<void> => {
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
          combinedTranslations[lang] = {
            ...combinedTranslations[lang],
            ...response.resources,
          };
        } catch (e) {
          console.error('err', e);
        }
      }));

    }));
  connection.close();
}

// Previous aggressive duplicate removal caused semantic collisions (e.g. English "Light" mapping
// both device class and theme mode, which translate differently in other languages).
// We now only collapse exact duplicates introduced within the same language AFTER conflict resolution.

// Removed global cross-language dedupe to preserve distinct longKey variants (e.g. partlycloudy vs partly_cloudy)

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
      const response = await fetch(url);
      if (response.ok) {
        const jsonData = await response.json();
        combinedTranslations[lang] = {
          ...combinedTranslations[lang],
          ...jsonData,
        };
      } else {
        throw new Error(`Failed to download ${url}: ${response.statusText}, delete the sync-locales/.cache folder`);
      }
    }
    // Add locale entry
    locales.push({ code: lang, hash, name: nativeName });
  }

  await fetchTranslations(locales.map(locale => locale.code), combinedTranslations);

  // ================= English key processing =================
  const english = combinedTranslations['en'];
  if (!english) throw new Error('English translations (en) not found');
  const englishEntries = Object.entries(english);
  // Sort for stable deterministic output (shorter word count first, then key)
  englishEntries.sort((a, b) => {
    const aw = a[1].split(/\s+/).filter(Boolean).length; const bw = b[1].split(/\s+/).filter(Boolean).length;
    if (aw === bw) return a[0].localeCompare(b[0]);
    return aw - bw;
  });

  interface MappingInfo { original: string; final: string; value: string; }
  const mappings: MappingInfo[] = [];
  const usedFinalKeys: Record<string, string> = {}; // finalKey -> englishValue
  const usedEnglishValuesLower: Set<string> = new Set(); // track dedup of identical values case-insensitive

  for (const [originalKey, valueRaw] of englishEntries) {
    const value = valueRaw.trim();
    const words = value.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    const lowerVal = value.toLowerCase();
    if (usedEnglishValuesLower.has(lowerVal)) {
      debug(`Duplicate English value skipped: '${value}' (key '${originalKey}') already represented.`);
      continue; // do not map this duplicate key
    }

    // Leading digit rule: previously retained original key; now we slug and prefix with 'value.'
    // Example: "12 ticks (Every hour)" -> value.12_ticks_every_hour
    if (/^\d/.test(value)) {
      const baseSlug = createSlug(value); // will preserve leading digits
      let finalKey = `${LEADING_DIGIT_VALUE_PREFIX}${baseSlug}`;
      // Collision handling (unlikely but safeguard): if already used with different value, fall back to short tail
      if (usedFinalKeys[finalKey]) {
        if (usedFinalKeys[finalKey].toLowerCase() === value.toLowerCase()) {
          debug(`Leading digit slug collision identical value: '${finalKey}' already maps to '${value}', skipping new mapping for '${originalKey}'.`);
          // Map originalKey to existing finalKey for consistency
          keyMapping[originalKey] = finalKey;
          mappings.push({ original: originalKey, final: finalKey, value });
        } else {
          debug(`Leading digit slug collision DIFFERENT value for '${finalKey}', attempting short tail fallback for '${originalKey}'.`);
          const shortKey = createShortFallbackKey(originalKey, usedFinalKeys);
          finalKey = shortKey;
          if (shortKey !== originalKey) {
            debug(`Leading digit fallback adopted: '${originalKey}' -> '${shortKey}'`);
          }
          keyMapping[originalKey] = finalKey;
          mappings.push({ original: originalKey, final: finalKey, value });
          usedFinalKeys[finalKey] = value;
        }
      } else {
        debug(`Leading digit value slugged: '${originalKey}' -> '${finalKey}'`);
        keyMapping[originalKey] = finalKey;
        mappings.push({ original: originalKey, final: finalKey, value });
        usedFinalKeys[finalKey] = value;
      }
      usedEnglishValuesLower.add(lowerVal);
      continue;
    }
    // Pattern rule for component.<domain>.title
    if (/^component\.[^.]+\.title$/.test(originalKey)) {
      const stripped = originalKey.replace(/^component\./, '');
      keyMapping[originalKey] = stripped;
      mappings.push({ original: originalKey, final: stripped, value });
      usedFinalKeys[stripped] = value;
      usedEnglishValuesLower.add(lowerVal);
      continue;
    }
    // Values with >=X words previously retained full original key.
    // We now attempt short tail compression for ALL non-slugged values to reduce verbosity.
    if (wordCount >= LONG_VALUE_WORD_COUNT) {
      const shortKey = createShortFallbackKey(originalKey, usedFinalKeys);
      if (shortKey !== originalKey) {
        debug(`Short fallback key adopted for long value: '${originalKey}' -> '${shortKey}'`);
      }
      keyMapping[originalKey] = shortKey;
      mappings.push({ original: originalKey, final: shortKey, value });
      usedFinalKeys[shortKey] = value;
      usedEnglishValuesLower.add(lowerVal);
      continue;
    }
    // Generate slug for < LONG_VALUE_WORD_COUNT words
    const slug = createSlug(value);
    if (!slug) {
      debug(`Invalid slug (empty) for key '${originalKey}' value '${value}', retaining original key.`);
      const shortKey = createShortFallbackKey(originalKey, usedFinalKeys);
      if (shortKey !== originalKey) {
        debug(`Short fallback key adopted: '${originalKey}' -> '${shortKey}'`);
      }
      keyMapping[originalKey] = shortKey;
      mappings.push({ original: originalKey, final: shortKey, value });
      usedFinalKeys[shortKey] = value;
      usedEnglishValuesLower.add(lowerVal);
      continue;
    }
    // Collision handling
    const existing = usedFinalKeys[slug];
    if (existing) {
      if (existing.toLowerCase() === value.toLowerCase()) {
        // Same semantic value - keep original key, don't overwrite existing slug
        debug(`Slug collision with identical value: '${slug}' already maps to '${existing}', skipping rename for '${originalKey}'.`);
        const shortKey = createShortFallbackKey(originalKey, usedFinalKeys);
        if (shortKey !== originalKey) {
          debug(`Short fallback key adopted after identical collision: '${originalKey}' -> '${shortKey}'`);
        }
        keyMapping[originalKey] = shortKey;
        mappings.push({ original: originalKey, final: shortKey, value });
        usedFinalKeys[shortKey] = value;
        usedEnglishValuesLower.add(lowerVal);
      } else {
        debug(`Slug collision DIFFERENT value: '${slug}' existing='${existing}' new='${value}' for original key '${originalKey}'. Retaining original key.`);
        const shortKey = createShortFallbackKey(originalKey, usedFinalKeys);
        if (shortKey !== originalKey) {
          debug(`Short fallback key adopted after different collision: '${originalKey}' -> '${shortKey}'`);
        }
        keyMapping[originalKey] = shortKey;
        mappings.push({ original: originalKey, final: shortKey, value });
        usedFinalKeys[shortKey] = value;
        usedEnglishValuesLower.add(lowerVal);
      }
      continue;
    }
    // Accept slug
    keyMapping[originalKey] = slug;
    usedFinalKeys[slug] = value;
    usedEnglishValuesLower.add(lowerVal);
    mappings.push({ original: originalKey, final: slug, value });
  }

  // ================= Per-language reconstruction =================
  const perLanguage: Record<string, Record<string, string>> = {};
  for (const locale of locales) {
    const lang = locale.code;
    const source = combinedTranslations[lang] || {};
    const out: Record<string, string> = {};
    for (const map of mappings) {
      const { original, final } = map;
      const val = source[original];
      if (typeof val === 'undefined') {
        // fallback to English value (intentional) and debug
        debug(`Missing translation for '${original}' in '${lang}', falling back to English.`);
        out[final] = map.value;
      } else {
        out[final] = val;
      }
    }
    perLanguage[lang] = out;
  }

  // ================= Removal of long value entries (>= WORD_COUNT_REMOVE_THRESHOLD words) =================
  const removedLong: Record<string, number> = {};
  for (const [lang, data] of Object.entries(perLanguage)) {
    let removed = 0;
    for (const [k, v] of Object.entries(data)) {
      const wc = v.split(/\s+/).filter(Boolean).length;
      if (wc >= WORD_COUNT_REMOVE_THRESHOLD) {
        delete data[k];
        removed++;
      }
    }
    if (removed) removedLong[lang] = removed;
  }
  Object.entries(removedLong).forEach(([lang, count]) => debug(`Removed ${count} long value key(s) (>=${WORD_COUNT_REMOVE_THRESHOLD} words) from '${lang}'.`));

  // ================= Output generation =================
  const finalEnglish = perLanguage['en'];
  const finalKeys = new Set<string>(Object.keys(finalEnglish));
  for (const [lang, data] of Object.entries(perLanguage)) {
    const filePath = path.join(OUTPUT_PATH, lang, `${lang}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), { encoding: 'utf-8' });
  }
  generateIndexFile(locales);
  generateTypeDefinitions(finalKeys, locales);
  debug(`Generation complete. Keys: ${finalKeys.size}. Renamed: ${mappings.filter(m => m.original !== m.final).length}. Unchanged: ${mappings.filter(m => m.original === m.final).length}.`);

}

const generateTypeDefinitions = (keys: Set<string>, locales: Locale[]) => {
  const typeDefinition = `// This file is dynamically generated
export type Locales = ${locales.map(locale => `'${locale.code}'`).join(' | ')};
export type LocaleKeys = ${Array.from(keys).map(key => `'${key}'`).join(' | ')};`;

  fs.writeFileSync(TYPES_FILE_PATH, typeDefinition, {
    encoding: 'utf-8'
  });
  console.debug(`Generated: ${TYPES_FILE_PATH}`);
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

export const localeTranslations = locales;

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
  console.debug(`Generated: ${indexPath}`);
};

// Prune logic implementing two rules:
// 1. For values with >7 words appearing under multiple keys across any languages, keep a single canonical key.
//    Preference order: key used in English (if present), otherwise lexicographically shortest key.
//    All languages that had the value will use (or gain) the canonical key; other duplicate keys are removed.
// 2. After normalization, remove any key whose value has >10 words AND is identical across all languages that contain that key
//    (assumption: "matches across languages" means not localized; we require the value string to be exactly the same for >=2 languages).
// Assumptions noted: rule 2 requires identical value present in at least 2 languages; if every language shares identical long value it's removed entirely.
// Legacy pruning & hierarchical functions removed per refactor requirements.

