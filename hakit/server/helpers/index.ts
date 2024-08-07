import fs from 'fs';
import { rm } from 'fs/promises';
import path from 'path';

export * from './get-addon-info.js';

export async function ensureDirectoryExists(filePath: string, empty: boolean = false) {
  const dirPath = path.dirname(filePath);

  // if empty is true, empty the contents of the directory
  if (empty && fs.existsSync(dirPath)) {
    await rm(dirPath, { recursive: true });
  }

  // Create output directory if it doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}


export function translateError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An error occurred';
}