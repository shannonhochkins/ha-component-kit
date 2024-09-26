import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
// actions/routes
import { getAvailableVersions } from './routes/get-available-versions.js';
import { downloadVersion } from './routes/download-version.js';
import { runApplication } from './routes/run-application.js';
import { createCustomDashboard } from './routes/custom-dashboard.js';
import { writeFile } from './routes/write-file.js';
import { __dirname, PORT, OPTIONS, getEndpoint } from './constants.js';
import { removeBuild } from './routes/remove-build.js';
import { removeNodeModules } from './routes/remove-node-modules.js';
// helpers
import { loadFile } from './helpers/read-file.js';

// http server
const app = express();
const server = http.createServer(app);

export interface ConfigOptions {
  html_file_path: string;
  custom_dashboard: boolean;
  spa_mode: boolean;
}


(async () => {
  console.log('OPTIONS', OPTIONS);
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
  if (config && !config.custom_dashboard) {

    app.post(getEndpoint('LIST_VERSIONS'), getAvailableVersions);
    app.post(getEndpoint('DOWNLOAD_VERSION'), downloadVersion);
    const runApplicationRequest = await runApplication(app);
    app.post(getEndpoint('RUN_APPLICATION'), runApplicationRequest);
    app.post(getEndpoint('WRITE_FILE'), writeFile);
    app.post(getEndpoint('REMOVE_BUILD'), removeBuild);
    app.post(getEndpoint('REMOVE_NODE_MODULES'), removeNodeModules);
    
  } else {
    createCustomDashboard(app, config);
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
