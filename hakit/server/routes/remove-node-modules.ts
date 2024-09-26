import { Request, Response } from 'express';
import { join } from 'path';
import { rm } from 'fs/promises'
import { APP_DIRECTORY } from '../constants.js';
import { translateError } from '../helpers/index.js';


export async function removeNodeModules(_req: Request, res: Response) {
  try {
    const buildDir = join(APP_DIRECTORY, 'app', 'node_modules');
    await rm(buildDir, { recursive: true, force: true });
    console.log('node_modules directory removed successfully');
    return res.status(200).send('Directory removed successfully');
  } catch (error) {
    console.error('Error removing build directory:', translateError(error));
    return res.status(500).send('Error removing build directory');
  }
};