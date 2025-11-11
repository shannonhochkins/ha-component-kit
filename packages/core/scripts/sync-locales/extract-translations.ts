import fs from 'fs';
import path from 'path';
import { type Connection, createLongLivedTokenAuth, createConnection } from "home-assistant-js-websocket";
import { createSocket } from '../sync-user-types/connection';
const OUTPUT_PATH = path.resolve(__dirname, '../../src/hooks/useLocale/locales');
const TYPES_FILE_PATH = path.join(OUTPUT_PATH, 'types.ts');

// ========================= CONFIGURATION CONSTANTS =========================
// WORD_COUNT_HIERARCHICAL_THRESHOLD: If an English value has more words than this threshold,
// we keep the original longKey instead of generating a hierarchical compressed key.
// (Previously hardcoded as 7)
const WORD_COUNT_HIERARCHICAL_THRESHOLD = 7;

// WORD_COUNT_REMOVE_THRESHOLD: Any key in any language whose value word count is >= this threshold
// will be removed entirely from all languages (aggressive trimming of long descriptions).
// (Previously hardcoded as 10)
const WORD_COUNT_REMOVE_THRESHOLD = 10;

// COLLAPSE_DUPLICATE_VALUES: When true, if the exact same value appears under multiple keys
// within the same language, we keep only the shortest key name (tie-breaker: lexicographical)
// and drop the others. This reduces redundancy like cleared_device_classes.*.
const COLLAPSE_DUPLICATE_VALUES = true;
// Duplicate collapse is now dynamic: no hardcoded generic or weekday lists.
// We compute a score based on relationship between the key and its value.
// MIN_WORDS_INCLUDE_PARENT: If a value has more than this number of words, we prefer a more descriptive
// key by including the immediate parent segment (parent.child) instead of just the last segment.
// This helps retain context (e.g. device_picker.no_match instead of no_match alone).
const MIN_WORDS_INCLUDE_PARENT = 2;
// ==========================================================================

// Stable mapping: longKey -> generated hierarchical key.
const keyMapping: Record<string, string> = {};

// Normalize a single segment for safety (keep dots between joined segments per spec, but clean segment chars)
function normalizeSegment(seg: string): string {
  return seg.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').toLowerCase();
}

// Build hierarchical key: start with last segment; if exists with different value escalate by prefixing parent.
// If exists with same value, skip (return null). If exhausted segments and still conflict, throw.
function deriveHierarchicalKey(longKey: string, value: string, langMap: Record<string, string>): string | null {
  // Reuse previously established mapping if possible.
  const existingMapping = keyMapping[longKey];
  if (existingMapping) {
    if (!(existingMapping in langMap)) return existingMapping; // not used yet here
    if (langMap[existingMapping] === value) return null; // duplicate same value
    // need escalation starting from existingMapping base (treat as last segment compound)
  }
  let parts = longKey.split('.').filter(Boolean).map(normalizeSegment);
  // Remove placeholder '_' segments produced by normalization of original underscores
  if (parts.includes('_')) {
    parts = parts.filter(p => p !== '_');
  }
  // Decide initial candidate: if word count > MIN_WORDS_INCLUDE_PARENT and we have a parent, use parent.child
  const wordCount = value.split(/\s+/).filter(Boolean).length;
  let candidateKey: string;
  if (wordCount > MIN_WORDS_INCLUDE_PARENT && parts.length > 1) {
    candidateKey = parts.slice(parts.length - 2).join('.'); // parent.child
  } else {
    candidateKey = parts[parts.length - 1];
  }
  if (!(candidateKey in langMap)) {
    if (candidateKey === '_' && parts.length > 1) {
      const fallback = parts.slice(parts.length - 2).join('.');
      if (!(fallback in langMap) && fallback !== '_') {
        keyMapping[longKey] = fallback;
        return fallback;
      }
      const parent = parts[parts.length - 2];
      if (!(parent in langMap) && parent !== '_') {
        keyMapping[longKey] = parent;
        return parent;
      }
    }
    keyMapping[longKey] = candidateKey === '_' ? normalizeSegment(longKey.replace(/\./g,'_')) : candidateKey;
    return keyMapping[longKey];
  }
  if (langMap[candidateKey] === value) return null;
  // Try previous segment ALONE before combining (apparent_temperature instead of apparent_temperature.name)
  if (parts.length > 1) {
    const prevAlone = parts[parts.length - 2];
    if (!(prevAlone in langMap)) {
      keyMapping[longKey] = prevAlone;
      return prevAlone;
    }
    if (langMap[prevAlone] === value) return null; // same value already represented by previous segment
  }
  // Escalate by combining previous + current, then further parents
  for (let i = parts.length - 2; i >= 0; i--) {
    // Build combined candidate from slice i..end
    candidateKey = parts.slice(i).join('.');
    if (!(candidateKey in langMap)) {
      keyMapping[longKey] = candidateKey;
      return candidateKey;
    }
    if (langMap[candidateKey] === value) return null;
  }
  throw new Error(`Unable to derive unique hierarchical key for ${longKey}`);
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
  // generate keys from english originally, shortest value (word count) first
  const englishEntries = Object.entries(combinedTranslations['en']).sort((a, b) => {
    const aw = a[1].split(/\s+/).length; const bw = b[1].split(/\s+/).length;
    if (aw === bw) return a[0].localeCompare(b[0]);
    return aw - bw;
  });
  for (const [longKey, value] of englishEntries) {
    const words = value.split(/\s+/).length;
    if (value === 'Sun') {
      console.log('Sun found', longKey)
    }
    // Pattern rule: map component.<domain>.title -> <domain>.title (strip leading 'component.')
    if (/^component\.[^.]+\.title$/.test(longKey)) {
      keyMapping[longKey] = longKey.replace(/^component\./, '');
      continue;
    }
    if (words > WORD_COUNT_HIERARCHICAL_THRESHOLD) {
      // Keep original longKey as key
      keyMapping[longKey] = longKey;
      continue;
    }
    const k = deriveHierarchicalKey(longKey, value, {});
    if (k) keyMapping[longKey] = k;
  }
  // Build per-language shortKey maps using stable english mapping; do not disambiguate yet.
  const perLanguage: Record<string, Record<string, string>> = {};
  const orderedLangs = ['en', ...Object.keys(combinedTranslations).filter(l => l !== 'en')];
  for (const lang of orderedLangs) {
    const translations = combinedTranslations[lang];
    perLanguage[lang] = {};
    // shortest values first for each language as well
    const sortedEntries = Object.entries(translations).sort((a, b) => {
      const aw = a[1].split(/\s+/).length; const bw = b[1].split(/\s+/).length;
      if (aw === bw) return a[0].localeCompare(b[0]);
      return aw - bw;
    });
    for (const [longKey, value] of sortedEntries) {

      const words = value.split(/\s+/).length;
      // Apply title pattern consistently across languages
      if (/^component\.[^.]+\.title$/.test(longKey)) {
        const stripped = longKey.replace(/^component\./, '');
        perLanguage[lang][stripped] = value;
        keyMapping[longKey] = stripped;
        continue;
      }
      if (words > WORD_COUNT_HIERARCHICAL_THRESHOLD) {
        // Keep original longKey mapping; if already set we may skip duplicate same value
        const existingVal = perLanguage[lang][longKey];
        if (existingVal === value) continue;
        perLanguage[lang][longKey] = value;
        keyMapping[longKey] = longKey;
        continue;
      }

      const hierarchicalKey = deriveHierarchicalKey(longKey, value, perLanguage[lang]);
      if (hierarchicalKey) {
        // If we already mapped longKey to longKey (due to >7 rule earlier in English) keep that.
        const finalKey = keyMapping[longKey] && keyMapping[longKey] === longKey ? longKey : hierarchicalKey;
        perLanguage[lang][finalKey] = value;
        keyMapping[longKey] = finalKey;
      }
    }
  }
  // Prune phase: collapse duplicates (>7 words) to a single canonical key and remove very long identical values (>10 words)
  pruneLongValueDuplicates(perLanguage);
  // Enforce English as master key list (adds missing English keys to other languages, drops extras)
  enforceEnglishMaster(perLanguage);
  // Collect keys after pruning
  const finalKeys = new Set<string>(Object.keys(perLanguage['en'] ?? {}));
  for (const [lang, data] of Object.entries(perLanguage)) {
    const filePath = path.join(OUTPUT_PATH, lang, `${lang}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), { encoding: 'utf-8' });
  }
  generateIndexFile(locales);
  generateTypeDefinitions(finalKeys, locales);

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
function pruneLongValueDuplicates(perLanguage: Record<string, Record<string, string>>) {
  // Build value -> occurrences
  interface Occurrence { lang: string; key: string; }
  const valueMap = new Map<string, Occurrence[]>();
  for (const lang of Object.keys(perLanguage)) {
    for (const [key, value] of Object.entries(perLanguage[lang])) {
      if (!valueMap.has(value)) valueMap.set(value, []);
      valueMap.get(value)!.push({ lang, key });
    }
  }

  // Rule 1: collapse duplicates for >7 word values
  for (const [value, occurrences] of valueMap.entries()) {
    const wordCount = value.split(/\s+/).filter(Boolean).length;
    if (wordCount <= WORD_COUNT_HIERARCHICAL_THRESHOLD) continue;
    if (occurrences.length <= 1) continue; // only one usage
    // Determine canonical key
    let canonicalKey: string | undefined;
    const englishOcc = occurrences.find(o => o.lang === 'en');
    if (englishOcc) canonicalKey = englishOcc.key;
    else {
      canonicalKey = occurrences.map(o => o.key).sort((a, b) => a.localeCompare(b))[0];
    }
    // For each language ensure only canonicalKey remains for this value
    const langsTouched = new Set<string>();
    for (const occ of occurrences) {
      if (occ.key !== canonicalKey) {
        delete perLanguage[occ.lang][occ.key];
        langsTouched.add(occ.lang);
      } else {
        langsTouched.add(occ.lang);
      }
    }
    // Re-add canonical key for languages that had value but lost it under different key
    for (const lang of Array.from(langsTouched)) {
      perLanguage[lang][canonicalKey] = value; // ensure present
    }
  }

  // New rule 2: remove any key whose value in any language has >=10 words (aggressive trim of long descriptions).
  const keysToDelete: Set<string> = new Set();
  for (const lang of Object.keys(perLanguage)) {
    for (const [key, value] of Object.entries(perLanguage[lang])) {
      const wc = value.split(/\s+/).filter(Boolean).length;
      if (wc >= WORD_COUNT_REMOVE_THRESHOLD) keysToDelete.add(key);
    }
  }
  if (keysToDelete.size) {
    for (const lang of Object.keys(perLanguage)) {
      for (const key of keysToDelete) {
        delete perLanguage[lang][key];
      }
    }
    console.debug(`Pruned ${keysToDelete.size} key(s) with >=${WORD_COUNT_REMOVE_THRESHOLD} word values`);
  }

  // Collapse identical values within each language keeping shortest key name.
  if (COLLAPSE_DUPLICATE_VALUES) {
    for (const lang of Object.keys(perLanguage)) {
      const map = perLanguage[lang];
      const valueGroups: Record<string, string[]> = {};
      for (const [key, value] of Object.entries(map)) {
        (valueGroups[value] ||= []).push(key);
      }
      let removedCount = 0;
      for (const [val, keys] of Object.entries(valueGroups)) {
        if (keys.length <= 1) continue;
        // Only collapse duplicates for long values (> WORD_COUNT_HIERARCHICAL_THRESHOLD words)
        const wordCount = val.split(/\s+/).filter(Boolean).length;
        if (wordCount <= WORD_COUNT_HIERARCHICAL_THRESHOLD) continue; // keep all short duplicate keys
        // Pick shortest key then lexicographical as canonical
        const canonical = keys.sort((a, b) => a.length === b.length ? a.localeCompare(b) : a.length - b.length)[0];
        for (const k of keys) {
          if (k === canonical) continue;
          delete map[k];
          removedCount++;
        }
      }
      if (removedCount) {
        console.debug(`Collapsed ${removedCount} duplicate value key(s) in ${lang}`);
      }
    }
  }
}

// Ensure English is the source-of-truth for key set: remove any keys not present
// in English from other languages, and add missing English keys to them (fallback to English value).
function enforceEnglishMaster(perLanguage: Record<string, Record<string, string>>) {
  const english = perLanguage['en'];
  if (!english) return; // safety
  const englishKeys = new Set(Object.keys(english));
  for (const lang of Object.keys(perLanguage)) {
    if (lang === 'en') continue;
    const map = perLanguage[lang];
    // Drop keys not in English
    for (const key of Object.keys(map)) {
      if (!englishKeys.has(key)) delete map[key];
    }
    // Do NOT inject missing English values; leave gaps so runtime can fallback.
  }
}

