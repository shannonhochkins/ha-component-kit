
import { Request, Response } from 'express';
import { join } from 'path';
import unzipper from 'unzipper';
import { APP_DIRECTORY } from '../constants.js';
import { downloadFile, listFilesInFolder } from '../google/drive/index.js';
import { ensureDirectoryExists, translateError } from '../helpers/index.js';
import { loadFile } from '../helpers/read-file.js';
import addonPackage from '../../package.json' with { type: 'json' };

export async function downloadVersion(_req: Request, res: Response) {
  // TODO - change download version to download a specific version
  // from the query string
  const files = await listFilesInFolder();
  let outputFile: string | null = null;
  if (files) {
    const [ file ] = files;
    if (file.id && file.name) {
      // this will destroy any existing files
      await ensureDirectoryExists(join(APP_DIRECTORY, 'zip'), true);
      await ensureDirectoryExists(join(APP_DIRECTORY, 'app'), true);
      const outputFilePath = join(APP_DIRECTORY, 'zip', file.name);
      // now download it
      outputFile = await downloadFile(file.id, outputFilePath);
      if (!outputFile) {
        console.error('Error downloading version for application');
        return res.status(500).send('Error downloading version for application');
      }
      try {
        const directory = await unzipper.Open.file(outputFile);
        await directory.extract({ path: join(APP_DIRECTORY, 'app') });
        const designerPackage = await loadFile<typeof addonPackage>(join(APP_DIRECTORY, 'app/package.json'));
        // if the versions of next.js don't match, raise an error
        if (designerPackage?.dependencies?.['next'] !== addonPackage.dependencies['next']) {
          console.error(`Version mismatch between designer and addon: HAKIT Designer: "${designerPackage?.dependencies?.['next']}" AND HAKIT ADDON "${addonPackage.dependencies['next']}"`);
          return res.status(500).send('Version mismatch between designer and addon, please update the addon to the latest version before updating the designer application.');
        }
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