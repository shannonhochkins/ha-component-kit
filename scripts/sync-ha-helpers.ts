import https from 'https';
import fs from 'fs';
import path from 'path';

const githubOptions: https.RequestOptions = {
  hostname: 'api.github.com',
  path: '/repos/home-assistant/frontend/contents/src/common/color?ref=dev',
  headers: { 'User-Agent': 'Node.js' }
};

const localFolderPath = './src/utils/colors';

function downloadFiles() {
  const request = https.get(githubOptions, response => {
    let data = '';

    response.on('data', chunk => {
      data += chunk;
    });

    response.on('end', () => {
      const fileList = JSON.parse(data);

      if (Array.isArray(fileList)) {
        for (const item of fileList) {
          const { name, download_url } = item;
          const filePath = path.join(localFolderPath, name);

          const fileRequest = https.get(download_url, fileResponse => {
            let fileData = '';

            fileResponse.on('data', chunk => {
              fileData += chunk;
            });

            fileResponse.on('end', () => {
              const modifiedFileData = fileData.replace(
                /import\s*{\s*clamp\s*}\s*from\s*"..\/number\/clamp";/g,
                `import { clamp } from 'lodash';`
              );

              fs.writeFileSync(filePath, modifiedFileData);

              console.log(`Downloaded and modified file: ${name}`);
            });
          });

          fileRequest.on('error', error => {
            console.error(`Error downloading file ${name}:`, error);
          });
        }

        console.log('All files downloaded successfully!');
      } else {
        console.log('No files found in the GitHub folder.');
      }
    });
  });

  request.on('error', error => {
    console.error('An error occurred while downloading files:', error);
  });
}

downloadFiles();