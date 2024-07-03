import { drive as GoogleDrive } from '@googleapis/drive';
import { createWriteStream } from 'fs';
const FOLDER_ID = '12Kv_b1woAY3aS0Herpj40Uj16CMFOPDD';

import { authorize } from '../auth/index.js';

export async function listFilesInFolder() {
  const auth = await authorize();
  const drive = GoogleDrive({ version: 'v3', auth });
  try {
    const res = await drive.files.list({
      q: `'${FOLDER_ID}' in parents and trashed = false`,
      supportsTeamDrives: true,
      includeTeamDriveItems: true,
      fields: 'files(id, name, mimeType, webViewLink)',
    });

    const files = res.data.files;
    if (files && files.length > 0) {
      return files;
    }
    return null;
  } catch (error) {
    console.error('Error listing files in folder:', error);
    return null;
  }
}

export async function downloadFile(fileId: string, outputFilePath: string): Promise<string | null> {
  const auth = await authorize();
  const drive = GoogleDrive({ version: 'v3', auth });
  const dest = createWriteStream(outputFilePath);

  try {
    const res = await drive.files.get(
      { fileId: fileId, alt: 'media' },
      { responseType: 'stream' }
    );

    return new Promise((resolve, reject) => {
      res.data
        .on('end', () => {
          console.log(`Downloaded file: ${outputFilePath}`);
          resolve(outputFilePath);
        })
        .on('error', (err: Error) => {
          console.error('Error downloading file:', err);
          reject(err);
        })
        .pipe(dest);
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    return null;
  }
}