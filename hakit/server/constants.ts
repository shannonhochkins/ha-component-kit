import path from 'path';
import { fileURLToPath } from 'url';

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const DEFAULT_HTML_FILE = path.join(__dirname, 'default.html'); // Path to your default HTML file

export const PORT = process.env.PORT || 2022;
export const OPTIONS = process.env.OPTIONS || "./server/options.json";

export const OUTPUT_DIR = process.env.NODE_ENV === 'production' ? '/config' : `${process.cwd()}/config`

export const APP_DIRECTORY = path.join(OUTPUT_DIR, 'hakit-designer');
