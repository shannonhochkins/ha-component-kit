import { rm, mkdir, unlink, lstat, readdir, access } from 'fs/promises';
import { join } from 'path';

export * from './get-addon-info.js';

export async function ensureDirectoryExists(directoryPath: string, empty: boolean = false) {

  // If empty is true, empty the contents of the directory without removing the directory itself
  if (empty && await access(directoryPath).then(() => true).catch(() => false)) {
    const files = await readdir(directoryPath);
    for (const file of files) {
      const filePath = join(directoryPath, file);
      const stat = await lstat(filePath);
      if (stat.isDirectory()) {
        await rm(filePath, { recursive: true });
      } else {
        await unlink(filePath);
      }
    }
  }

  // Create the directory if it doesn't exist
  await mkdir(directoryPath, { recursive: true });
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