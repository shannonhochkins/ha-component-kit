import { Request, Response } from 'express';
import { join } from 'path';
import { rm } from 'fs/promises'
import { APP_DIRECTORY } from '../constants.js';
import { translateError } from '../helpers/index.js';

export async function removeBuildDirectory() {
  // remove the directory .next
  const buildDir = join(APP_DIRECTORY, 'app', '.next');
  await rm(buildDir, { recursive: true, force: true });
  console.log('.next directory removed successfully');
}


export async function removeBuild(_req: Request, res: Response) {
  try {
    await removeBuildDirectory();
    console.log('.next directory removed successfully');
    return res.status(200).send('Directory removed successfully');
  } catch (error) {
    console.error('Error removing build directory:', translateError(error));
    return res.status(500).send('Error removing build directory');
  }
};