import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { PORT, OPTIONS, OUTPUT_DIR } from './constants.js';
// helpers
import { loadFile } from './helpers/read-file.js';

// http server
const app = express();
const server = http.createServer(app);

export interface ConfigOptions {
  html_file_path: string;
  spa_mode: boolean;
}

const isHtmlFile = (filePath: string): boolean => path.extname(filePath).toLowerCase() === '.html';

const findHtmlFiles = (dir: string, fileList: string[] = []): string[] => {
  try {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        fileList = findHtmlFiles(filePath, fileList);
      } else if (isHtmlFile(filePath)) {
        fileList.push(filePath);
      }
    });
  } catch (e) {
    console.error('Error reading directory for HTML files:', e);
  }
  return fileList;
};

function createCustomDashboard(app: ReturnType<typeof express>, config: ConfigOptions | null) {
  const htmlFilePath = path.join(OUTPUT_DIR, config?.html_file_path || '');

  app.get('/', async (_req, res) => {
    try {
      if (fs.existsSync(htmlFilePath) && isHtmlFile(htmlFilePath)) {
        res.sendFile(htmlFilePath);
      } else {
        const htmlFiles = findHtmlFiles(OUTPUT_DIR);
        if (htmlFiles.length === 0) {
          res.status(404).send('No HTML files found, have you uploaded your custom dashboard to your config directory?');
        } else {
          const validOptions = htmlFiles
            .filter(file => !file.includes('node_modules'))
            .map(file => file.replace(`${OUTPUT_DIR}/`, ''))
            .sort((a, b) => a.localeCompare(b));

          const listItems = validOptions
            .map(file => `<li><code>${file}</code></li>`)
            .join('');

          res
            .type('text/html')
            .send(`
              <!doctype html>
              <html>
                <head>
                  <meta charset="utf-8" />
                  <title>HAKIT Dashboard</title>
                  <style>
                    :root {
                      color-scheme: dark;
                      --bg: #0b1220;
                      --panel: #111a2e;
                      --text: #e2e8f0;
                      --muted: #94a3b8;
                      --accent: #7dd3fc;
                      --border: #1e293b;
                    }
                    * { box-sizing: border-box; }
                    body { margin: 0; padding: 24px; font-family: "Inter", "SF Pro Text", system-ui, -apple-system, sans-serif; background: radial-gradient(circle at 10% 20%, rgba(125,211,252,0.06), transparent 30%), radial-gradient(circle at 90% 10%, rgba(52,211,153,0.06), transparent 25%), var(--bg); color: var(--text); line-height: 1.6; }
                    .card { max-width: 720px; margin: 0 auto; background: linear-gradient(145deg, rgba(17,26,46,0.9), rgba(17,26,46,0.72)); border: 1px solid var(--border); border-radius: 14px; padding: 22px 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.4); backdrop-filter: blur(4px); }
                    h1 { margin: 0 0 10px; font-size: 20px; letter-spacing: 0.2px; }
                    .hint { margin: 0 0 16px; color: var(--muted); }
                    code { background: rgba(255,255,255,0.06); padding: 3px 7px; border-radius: 6px; border: 1px solid var(--border); font-size: 13px; color: #c7d2fe; }
                    ul { list-style: none; padding: 0; margin: 0; }
                    li { padding: 8px 10px; margin: 0 0 6px; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 10px; }
                    .empty { color: var(--muted); font-style: italic; }
                  </style>
                </head>
                <body>
                  <div class="card">
                    <h1>Invalid "html_file_path"</h1>
                    <div class="hint">Set the add-on option to one of the discovered HTML files under <code>/config</code>:</div>
                    <ul>${listItems || '<li class="empty">No HTML files found under /config</li>'}</ul>
                  </div>
                </body>
              </html>
            `);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Server error');
    }
  });

  if (config?.spa_mode) {
    // Catch-all for SPA routing using a regex to avoid path-to-regexp wildcard parsing issues
    app.use(/.*/, (_req, res) => {
      if (fs.existsSync(htmlFilePath) && isHtmlFile(htmlFilePath)) {
        res.sendFile(htmlFilePath);
      } else {
        res.status(404).send('Index HTML file not found.');
      }
    });
  }

  
}


(async () => {
  // can pass the context here so even backend can be restricted with auth
  const config = await loadFile<ConfigOptions>(OPTIONS);

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
  createCustomDashboard(app, config);
  
  server.listen(PORT, () => {
    console.info(`Dashboard Ready! Port: ${PORT}, options: ${JSON.stringify(OPTIONS, null, 2)})}`);
  });
  process.on('SIGTERM', () => {
    server.close(() => {
      console.info('Server terminated');
    });
  });
})();
