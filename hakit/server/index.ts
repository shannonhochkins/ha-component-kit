import path from 'path';
import express from 'express';
import http from 'http';
import cors from 'cors';
import fs from 'fs';
import { readFile } from 'fs/promises';
import next from 'next';
import axios from 'axios';
import unzipper from 'unzipper';
import { execSync } from 'child_process';

/***************************************************************************************************************************
 * Load Environment Values
***************************************************************************************************************************/
const PORT = process.env.PORT || 2022;
const OPTIONS = process.env.OPTIONS || "./server/options.json";

const OUTPUT_DIR = process.env.NODE_ENV === 'production' ? '/config' : `${process.cwd()}/config`;
const NEXTJS_DIR = path.join(__dirname, 'hakit-designer'); // Directory where Next.js app will be extracted
const DEFAULT_HTML_FILE = path.join(__dirname, 'default.html'); // Path to your default HTML file


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
  if (!config.custom_dashboard) {
    
    app.post('/download-nextjs', async (_req, res) => {
      try {
        // Replace with your Google Drive file URL
        const fileUrl = 'https://drive.google.com/file/d/1rKgvUfhObBNdH-_7BgZN62nFE5LqiA01/view?usp=drive_link';
    
        // Create output directory if it doesn't exist
        if (!fs.existsSync(NEXTJS_DIR)) {
          fs.mkdirSync(NEXTJS_DIR);
        }
      
        // Fetch the zip file
        const response = await axios({
          url: fileUrl,
          method: 'GET',
          responseType: 'stream'
        });
    
        // Pipe the zip file to unzipper
        response.data.pipe(unzipper.Extract({ path: NEXTJS_DIR }))
          .on('close', () => {
            console.log('Next.js application extracted successfully');
            res.status(200).send('Next.js application downloaded and extracted successfully');
          })
          .on('error', (err: string) => {
            console.error('Error extracting Next.js application:', err);
            res.status(500).send('Error extracting Next.js application');
          });
    
      } catch (error) {
        console.error('Error downloading Next.js application:', error);
        res.status(500).send('Error downloading Next.js application');
      }
    });

    app.post('/build-nextjs', (_req, res) => {
      const installDependencies = `cd ${NEXTJS_DIR} && npm ci`;
      const buildNextApp = `cd ${NEXTJS_DIR} && npm run build`;
  
      try {
        execSync(installDependencies, { stdio: 'inherit' });
        execSync(buildNextApp, { stdio: 'inherit' });
  
        res.status(200).send('Next.js application built successfully');
      } catch (error) {
        console.error('Error building Next.js application:', error);
        res.status(500).send('Error building Next.js application');
      }
    });

    async function startApp() {
      const outputPath = path.join(__dirname, 'hakit-designer');
      const nextApp = next.default({ dev: false, dir: outputPath });
      const handle = nextApp.getRequestHandler();
    
      try {
        await nextApp.prepare();
    
        app.get('*', (req, res) => {
          return handle(req, res);
        });
    
      } catch (error) {
        console.error('Error starting Next.js server:', error);
        throw error;
      }
    }

    app.post('/start-nextjs', async (_req, res) => {
    
      try {
        await startApp();
        res.status(200).send('Next.js server started');
      } catch (error) {
        console.error('Error starting Next.js server:', error);
        res.status(500).send('Error starting Next.js server');
      }
    });
    // Check if the Next.js application has been downloaded and built
    const nextJsBuilt = fs.existsSync(path.join(NEXTJS_DIR, '.next'));

    if (nextJsBuilt) {
      // Start the Next.js server if the application is available
      try {
        await startApp();
    
      } catch (error) {
        console.error('Error starting Next.js server:', error);
        throw error;
      }
    } else {
      app.get('*', (_req, res) => {
        res.sendFile(DEFAULT_HTML_FILE);
      });
    }
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
