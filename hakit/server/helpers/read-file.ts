import { access, readFile } from 'fs/promises';
import { extname } from 'path';
import { pathToFileURL } from 'url';

export async function loadFile<T>(path: string): Promise<T | null> {
  try {
    await access(path);

    const ext = extname(path);

    if (ext === '.json') {
      const fileContent = await readFile(path, 'utf-8');
      const config = JSON.parse(fileContent);
      return config;
    } else if (ext === '.js' || ext === '.cjs' || ext === '.mjs') {
      const module = await import(pathToFileURL(path).href);
      return module.default || module;
    } else {
      throw new Error(`Unsupported file extension: ${ext}`);
    }
  } catch (error) {
    console.error(`Error loading file "${path}":`, error);
    return null;
  }
}