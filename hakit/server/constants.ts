import path from 'path';
import { fileURLToPath } from 'url';

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const APP_DIRECTORY = path.join(__dirname, 'hakit-designer');

export const DEFAULT_HTML_FILE = path.join(__dirname, 'default.html'); // Path to your default HTML file