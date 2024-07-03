import { Request, Response } from 'express';
import { Express } from 'express';
import axios from 'axios';
import next from 'next';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import { APP_DIRECTORY, DEFAULT_HTML_FILE } from '../constants.js';
import { execSync } from 'child_process';
import { translateError } from '../helpers/index.js';

let isAppRunning = false;

export async function runApplication(app: Express) {
  async function startApp() {
    // @ts-expect-error
    const nextApp = next({ dev: false, dir: join(APP_DIRECTORY, 'app') });
    const handle = nextApp.getRequestHandler();
  
    try {
      await nextApp.prepare();
      isAppRunning = true; // Set the flag to true when Next.js is ready

      // must be defined first
      app.get('/config', (_req, res) => {
        res.sendFile(DEFAULT_HTML_FILE);
      });

      app.get('*', (req, res) => {
        return handle(req, res);
      });
  
    } catch (error) {
      isAppRunning = false;
      console.error('Error starting Next.js server:', error);
      throw error;
    }
  }

  const nextJsBuilt = existsSync(join(APP_DIRECTORY, 'app', '.next'));

  if (nextJsBuilt) {
    // Start the Next.js server if the application is available
    try {
      await startApp();
  
    } catch (error) {
      console.error('Error starting Next.js server:', translateError(error));
      throw error;
    }
  } else {
    app.get('/', (_req, res) => {
      res.sendFile(DEFAULT_HTML_FILE);
    });
  }

  app.post('/status', async (_req: Request, res: Response) => {
    let version: string | null = null;
    try {
      const packageJsonPath = join(APP_DIRECTORY, 'app', 'package.json');
      // check if the above ppath exists
      const packageJSONExists = existsSync(packageJsonPath);
      if (!packageJSONExists) {
        version = null;
      } else {
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
        version = packageJson.version;
      }
    } catch (error) {
      console.error('Error reading package.json:', error);
    }

    const nextJsBuilt = existsSync(join(APP_DIRECTORY, 'app', '.next'));

    const status: {
      version: string | null;
      built: boolean;
      running: boolean;
      ingressUrl: string | null;
    } = {
      version,
      built: nextJsBuilt,
      running: isAppRunning,
      ingressUrl: null,
    };

    // Function to get the ingress URL from Home Assistant API
    const getIngressUrl = async (): Promise<string | null> => {
      try {
        const response = await axios.get('http://hassio/addons/self/info', {
          headers: {
            'Authorization': `Bearer ${process.env.SUPERVISOR_TOKEN}`
          }
        });
        console.log('response', JSON.stringify(response.data, null, 2));
        if (response.data && response.data.data && response.data.data.ingress_url) {
          return response.data.data.ingress_url;
        }
      } catch (error) {
        console.error('Error fetching ingress URL:', translateError(error));
      }
      return null;
    };
    const data = await getIngressUrl();
    status.ingressUrl = data;

    res.json(status);
  });

  return async (_req: Request, res: Response) => {
    const nextJsBuilt = existsSync(join(APP_DIRECTORY, 'app', '.next'));
    try {
      if (!nextJsBuilt) {
        const installDependencies = `cd ${join(APP_DIRECTORY, 'app')} && npm i`;
        const buildNextApp = `cd ${join(APP_DIRECTORY, 'app')} && npm run build`;

        try {
          console.log('Installing dependencies');
          execSync(installDependencies, { stdio: 'inherit' });
          console.log('Building Next.js application');
          execSync(buildNextApp, { stdio: 'inherit' });
          console.log('Next.js application built successfully');
        } catch (error) {
          console.error('Error building Next.js application:', translateError(error));
          return res.status(500).send('Error building Next.js application');
        }
      }
      await startApp();
      res.status(200).send('Application server started');
    } catch (error) {
      console.error('Error starting application server:', translateError(error));
      res.status(500).send('Error starting application server');
    }
  };
}