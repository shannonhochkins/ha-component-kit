import { Express } from 'express';
import path from 'path';
import fs from 'fs';
import { __dirname, OUTPUT_DIR } from '../constants.js';
import { type ConfigOptions } from '../index.js';


// Function to check if the file is HTML by extension
const isHtmlFile = (filePath: string): boolean => {
  return path.extname(filePath).toLowerCase() === '.html';
};

// Recursive function to find HTML files
const findHtmlFiles = (dir: string, fileList: string[] = []): string[] => {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      fileList = findHtmlFiles(filePath, fileList); // Recurse into subdirectories
    } else {
      if (isHtmlFile(filePath)) {
        fileList.push(filePath); // Add HTML file to list
      }
    }
  });

  return fileList;
};

export function createCustomDashboard(app: Express, config: ConfigOptions | null) {
  const htmlFilePath = path.join(OUTPUT_DIR, config?.html_file_path || '');

  app.get('/', async (_req, res) => {
    try {
      // Check if the provided path is an HTML file
      if (fs.existsSync(htmlFilePath) && isHtmlFile(htmlFilePath)) {
        res.sendFile(htmlFilePath);
      } else {
        // If not, search for all HTML files in OUTPUT_DIR
        const htmlFiles = findHtmlFiles(OUTPUT_DIR);
        if (htmlFiles.length === 0) {
          res.status(404).send('No HTML files found, have you uploaded your custom dashboard to your config directory?');
        } else {
          // Format the valid paths as a bullet list, removing the OUTPUT_DIR from each path
          const validOptions = htmlFiles.filter(file => !file.includes('node_modules')).map(file =>
            `- "${file.replace(`${OUTPUT_DIR}/`, '')}"` // Replace OUTPUT_DIR with an empty string
          ).join('\n');

          // Send the response
          res.type('text/plain').send(`Invalid "html_file_path" option, valid file paths are:\n\n${validOptions}`);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Server error');
    }
  });
  if (config?.spa_mode) {
    app.get('*', (_req, res) => { // This wildcard route captures all GET requests
      if (fs.existsSync(htmlFilePath) && isHtmlFile(htmlFilePath)) {
        res.sendFile(htmlFilePath); // Serve index.html for all paths if spa_mode is true
      } else {
        res.status(404).send('Index HTML file not found.');
      }
    });
  }
}