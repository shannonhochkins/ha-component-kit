import { Request, Response } from 'express';
import { Express, static as staticAsset } from 'express';
import mime from 'mime-types';
import next, { NextServerOptions, NextServer } from 'next/dist/server/next.js';
import { join, extname, dirname } from 'path';
import { NextConfig } from 'next';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { APP_DIRECTORY, DEFAULT_HTML_FILE, getEndpoint, prefixUrl } from '../constants.js';
import { execSync } from 'child_process';
// helpers
import { loadFile } from '../helpers/read-file.js';
import { translateError, ensureDirectoryExists } from '../helpers/index.js';
import { getAddonInfo } from '../helpers/get-addon-info.js';
import { removeBuildDirectory } from './remove-build.js';

const buildNext = next as unknown as (options: NextServerOptions) => NextServer;

let isAppRunning = false;

// 1. Once versioning is in place, we'll need to re-install dependencies and build application if the version is different

// function getOrigin(req: Request): string {
//   const protocol = (req.headers['x-forwarded-proto'] || req.protocol);
//   const host = (req.headers['x-forwarded-host'] || req.headers.host);
  
//   // Ensure protocol and host are strings
//   const protocolStr = Array.isArray(protocol) ? protocol[0] : protocol;
//   const hostStr = Array.isArray(host) ? host[0] : host;

//   if (!hostStr) {
//     return '';
//   }

//   return `${protocolStr}://${hostStr}`;
// }

export async function runApplication(app: Express) {
  const data = await getAddonInfo();
  const htmlContent = readFileSync(DEFAULT_HTML_FILE, 'utf8');
  const basePath = data?.ingress_entry || '';
  // Define the path to the file
  const addonInfoPath = join(APP_DIRECTORY, 'addon-info.json');

  // Ensure the directory for the file exists
  const addonInfoDir = dirname(addonInfoPath);
  await ensureDirectoryExists(addonInfoDir, false);
  writeFileSync(addonInfoPath, JSON.stringify(data, null, 2), 'utf8');
  const pageContent = htmlContent.replace('{{baseUrl}}', data?.ingress_url || '/');
  async function startApp() {
    console.log('Loading configuration.');
    // import the next config from the app directory
    const conf = await loadFile<NextConfig>(join(APP_DIRECTORY, 'app', 'next.config.js'));
    if (conf) {
      conf.assetPrefix = basePath;
      conf.basePath = basePath;
    }
    console.log('Initializing Next.js server.')
    const nextApp = buildNext({
      dev: false,
      dir: join(APP_DIRECTORY, 'app'),
      conf: conf || undefined,
    });
    const handle = nextApp.getRequestHandler();
  
    try {
      console.log('Preparing Next.js server.');
      await nextApp.prepare();
      isAppRunning = true; // Set the flag to true when Next.js is ready

          // Middleware to serve static files correctly with dynamic content-type
      app.use('/_next/static', staticAsset(join(APP_DIRECTORY, 'app', '.next/static'), {
        setHeaders: (res, filePath) => {
          const contentType = mime.contentType(extname(filePath));
          console.log('setting headers for', filePath, contentType);
          if (contentType) {
            res.setHeader('Content-Type', contentType);
          }
        }
      }));

      // must be defined first
      app.get(getEndpoint('CONFIG'), (_req, res) => {        
        res.send(pageContent);
      });
      // Middleware to handle base path and root endpoint correctly
      app.use((req, _res, next) => {
        console.log('Original URL:', req.url);
        if (req.url === '/') {
          req.url = `${basePath}`;
        } else if (!req.url.startsWith(basePath) && !req.url.startsWith('/api/')) {
          req.url = prefixUrl(req.url, basePath);
        }
        next();
      });
      // all other get requests funnel through the handler
      app.get('*', (req, res, next) => {
        console.log('NEXT URL:', req.url);
        return handle(req, res).catch(next);
      });

      app.post('/api/data', (req, res, next) => {
        return handle(req, res).catch(next);
      });

    } catch (error) {
      isAppRunning = false;
      console.error('Error starting Next.js server:', error);
      await removeBuildDirectory();
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
    app.get(getEndpoint('CONFIG'), (_req, res) => {
      res.send(pageContent);
    });
    app.use((req, res, next) => {
      const nextJsBuilt = existsSync(join(APP_DIRECTORY, 'app', '.next'));
      console.log('Original request url', req.url);
      // first check if the current path is the root level
      if (!nextJsBuilt && (req.path === '/' || req.path === '')) {
        const redirectTo = `${basePath}${getEndpoint('CONFIG')}`;
        console.log('Redirecting to', redirectTo);
        res.redirect(redirectTo);
      } else {
        next();
      }
    });
  }

  app.post(getEndpoint('STATUS'), async (_req: Request, res: Response) => {
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
        const environmentPath = join(APP_DIRECTORY, 'app', '.env.local');
        writeFileSync(environmentPath, `NEXT_PUBLIC_BASE_PATH=${basePath}\nNEXT_PUBLIC_CONFIG_LOCATION=${join(APP_DIRECTORY, 'config.json')}`, 'utf8');
        try {
          if (!existsSync(join(APP_DIRECTORY, 'app', 'node_modules'))) {
            const installDependencies = `cd ${join(APP_DIRECTORY, 'app')} && npm ci`;
            console.log('Installing dependencies');
            execSync(installDependencies, { stdio: 'inherit' });
          } else {
            console.log('Dependencies already installed')
          }
          console.log('Building Next.js application');
          const buildNextApp = `cd ${join(APP_DIRECTORY, 'app')} && SKIP_LINTING=true SKIP_TYPE_CHECKING=true npm run build`;
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

