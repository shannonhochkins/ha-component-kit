
import { Request, Response } from 'express';
import { join } from 'path';
import unzipper from 'unzipper';
import { APP_DIRECTORY } from 'server/constants.js';
import { downloadFile, listFilesInFolder } from 'server/google/drive/index.js';
import { ensureDirectoryExists, translateError } from 'server/helpers/index.js';

export async function downloadVersion(_req: Request, res: Response) {
  // TODO - change download version to download a specific version
  // from the query string
  const files = await listFilesInFolder();
  let outputFile: string | null = null;
  if (files) {
    const [ file ] = files;
    if (file.id && file.name) {
      const outputFilePath = join(APP_DIRECTORY, 'zip', file.name);
      // this will destroy any existing files
      ensureDirectoryExists(outputFilePath, true);
      // now download it
      outputFile = await downloadFile(file.id, outputFilePath);
      if (!outputFile) {
        console.error('Error downloading version for application');
        return res.status(500).send('Error downloading version for application');
      }
      try {
        const directory = await unzipper.Open.file(outputFile);
        await directory.extract({ path: join(APP_DIRECTORY, 'app') });
        console.log('Application downloaded and extracted successfully');
        return res.status(200).send({
          status: 'success',
          message: 'Application downloaded and extracted successfully'
        });
      } catch (error) {
        console.error('Error unzipping file:', translateError(error));
        return res.status(500).send('Error unzipping file');
      }
    }
  }
  return res.status(500).send('FIX THIS TO LOAD INDIVIDUAL FILE');
}