import path from 'path';
import { fileURLToPath } from 'url';

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const DEFAULT_HTML_FILE = path.join(__dirname, 'default.html'); // Path to your default HTML file

export const PORT = process.env.PORT || 2022;
export const OPTIONS = process.env.OPTIONS || `${process.cwd()}/server/options.json`;

export const OUTPUT_DIR = process.env.NODE_ENV === 'production' ? '/config' : `${process.cwd()}/config`

export const APP_DIRECTORY = path.join(OUTPUT_DIR, 'hakit-designer');

const API_BASE = '/api/v1';

export const ENDPOINTS = {
  STATUS: '/status',
  CONFIG: '/config',
  LIST_VERSIONS: '/list-versions',
  DOWNLOAD_VERSION: '/download-version',
  RUN_APPLICATION: '/run-application',
  WRITE_FILE: '/write-file',
  REMOVE_BUILD: '/remove-build',
  REMOVE_NODE_MODULES: '/remove-node-modules',
};

export const getEndpoint = (endpoint: keyof typeof ENDPOINTS) => `${API_BASE}${ENDPOINTS[endpoint]}`;


export function prefixUrl(path: string, basePath: string) {
  // join the defaultBasePath with the endpoint name, ensure there's no
  // duplicate slashes etc
  
  // Remove trailing slash from baseUrl if it exists
  if (basePath.endsWith('/')) {
    basePath = basePath.slice(0, -1);
  }
  
  // Ensure the path starts with a single slash
  if (!path.startsWith('/')) {
    path = '/' + path;
  }

  return basePath + path;

}