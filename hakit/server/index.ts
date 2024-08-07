import path from 'path';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import { readFile } from 'fs/promises';
// actions/routes
import { getAvailableVersions } from './routes/get-available-versions.js';
import { downloadVersion } from './routes/download-version.js';
import { runApplication } from './routes/run-application.js';
import { writeFile } from './routes/write-file.js';
import { __dirname, PORT, OPTIONS, OUTPUT_DIR } from './constants.js';
import { removeBuild } from './routes/remove-build.js';

/***************************************************************************************************************************
 * Load Environment Values
***************************************************************************************************************************/
;

// http server
const app = express();
const server = http.createServer(app);

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

// Function to load configuration with assertions
async function loadConfig() {
  try {
    const data = await readFile(OPTIONS, 'utf8');
    const config = JSON.parse(data);
    if (config && config.default) return config.default;
    return config;
  } catch (error) {
    console.error('Error loading config:', error);
    return null;
  }
}


(async () => {
  // can pass the context here so even backend can be restricted with auth
  const config = await loadConfig();
  const htmlFilePath = path.join(OUTPUT_DIR, config.html_file_path);

  // Additional Middleware for logging
  app.use((req, _res, next) => {
    console.info(`Incoming request: ${req.method} ${req.url} from ${req.hostname}`);
    next();
  });
  // listen for api endpoints with /api as base
  // enable cors
  app.use(cors());
  // Middleware to parse JSON request bodies
  app.use(bodyParser.json());
  if (!config.custom_dashboard) {

    app.post('/get-available-versions', getAvailableVersions);
    app.post('/download-version', downloadVersion);
    const runApplicationRequest = await runApplication(app);
    app.post('/run-application', runApplicationRequest);
    app.post('/write-file', writeFile);
    app.post('/remove-build', removeBuild);
    
  } else {
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
    if (config.spa_mode) {
      app.get('*', (_req, res) => { // This wildcard route captures all GET requests
        if (fs.existsSync(htmlFilePath) && isHtmlFile(htmlFilePath)) {
          res.sendFile(htmlFilePath); // Serve index.html for all paths if spa_mode is true
        } else {
          res.status(404).send('Index HTML file not found.');
        }
      });
    }
  }
  
  server.listen(PORT, () => {
    console.info(`Dashboard Ready! Port: ${PORT}, options: ${JSON.stringify(OPTIONS, null, 2)})}`);
  });
  process.on('SIGTERM', () => {
    server.close(() => {
      console.info('Server terminated');
    });
  });
})();
