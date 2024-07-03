
import { Request, Response } from 'express';
import { listFilesInFolder } from 'server/google/drive/index.js';
import { translateError } from 'server/helpers/index.js';

export async function getAvailableVersions(_req: Request, res: Response) {
  try {
    const files = await listFilesInFolder();
    return res.send({
      status: files === null ? 'error' : 'success',
      files
    });
  } catch (error) {
    console.error('Error getting available versions:', translateError(error));
    return res.status(500).send('Error getting available versions');
  }
}