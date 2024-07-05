import { Request, Response } from 'express';
import { Express } from 'express';
import next from 'next';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import { APP_DIRECTORY, DEFAULT_HTML_FILE } from '../constants.js';
import { execSync } from 'child_process';
import { translateError } from '../helpers/index.js';
import { getAddonInfo } from '../helpers/get-addon-info.js';

let isAppRunning = false;

export async function runApplication(app: Express) {
  const data = await getAddonInfo();
  const htmlContent = readFileSync(DEFAULT_HTML_FILE, 'utf8');
  const basePath = data?.ingress_url || '/';
  const pageContent = htmlContent.replace('{{baseUrl}}', data?.ingress_url || '/');
  async function startApp() {
    // @ts-expect-error
    const nextApp = next({ dev: false, dir: join(APP_DIRECTORY, 'app') });
    const handle = nextApp.getRequestHandler();
  
    try {
      await nextApp.prepare();
      isAppRunning = true; // Set the flag to true when Next.js is ready

      // must be defined first
      app.get('/config', (_req, res) => {
        res.send(pageContent);
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
    app.get('/config', (_req, res) => {
      res.send(pageContent);
    });
    app.use((_req, res, next) => {
      const nextJsBuilt = existsSync(join(APP_DIRECTORY, 'app', '.next'));
      console.log('_req.path', _req.path);
      // first check if the current path is the root level
      if (!nextJsBuilt && (_req.path === '/' || _req.path === '')) {
        res.redirect(basePath + 'config');
      } else {
        next();
      }

    });
  }

  app.post('/status', async (_req: Request, res: Response) => {
    let version: string | null = null;
    try {
      const packageJsonPath = join(APP_DIRECTORY, 'app', 'package.json');
      // check if the above path exists
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
    } = {
      version,
      built: nextJsBuilt,
      running: isAppRunning,
    };

    res.json(status);
  });

  return async (_req: Request, res: Response) => {
    const nextJsBuilt = existsSync(join(APP_DIRECTORY, 'app', '.next'));
    try {
      if (!nextJsBuilt) {
        const installDependencies = `cd ${join(APP_DIRECTORY, 'app')} && npm ci`;
        const buildNextApp = `cd ${join(APP_DIRECTORY, 'app')} && SKIP_LINTING=true SKIP_TYPE_CHECKING=true npm run build`;

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