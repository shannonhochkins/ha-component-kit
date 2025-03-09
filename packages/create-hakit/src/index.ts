import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import spawn from 'cross-spawn';
import prompts from 'prompts';
import { execSync } from 'child_process';
import axios from 'axios';
import { createLongLivedTokenAuth } from 'home-assistant-js-websocket';
import {
  red,
  yellow,
  green,
  cyan,
  reset,
  white,
  gray,
} from 'kolorist';
import { validateConnection } from './socket';
// methods

const FILES_TO_REMOVE = [
  'public',
  'src/assets',
  'src/App.tsx',
  'src/App.css',
];
const renameFiles: Record<string, string | undefined> = {
  _gitignore: '.gitignore',
}

const mergeFiles: Record<string, string> = {
  'tsconfig.json': '.tsconfig.json',
  "README.md": "README.md",
}

const cwd = process.cwd();

const defaultTargetDir = 'ha-dashboard';

const getLatestNpmVersion = (packageName: string): string => {
  try {
    const stdout = execSync(`npm show ${packageName} version`, { encoding: 'utf8' });
    return stdout.trim();
  } catch (error) {
    console.error(`Error fetching latest version of ${packageName}: ${error}`);
    return '';
  }
};

async function validateHaUrl(haUrl: string): Promise<void> {
  try {
    const response = await axios.get(haUrl);
    if (response.status === 200) {
      console.log(green(`\n✔ Validated that HA URL "${haUrl}" is reachable.`));
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : JSON.stringify(e);
    throw new Error(`Failed to reach HA URL "${haUrl}": ${message}`);
  }
}


// A functional approach to creating the project
const createProject = async () => {  
  try {
    let result: prompts.Answers<
      'projectName' | 'haUrl' | 'haToken'
    >;
    let abort = false;
    try {
      result = await prompts(
        [
          {
            type: 'text',
            name: 'projectName',
            message: reset('Project name:'),
            initial: defaultTargetDir,
            format: value => formatTargetDir(value)
          },
          {
            type: 'text',
            name: 'haUrl',
            message: reset('HA Url (Recommended to use a public https url):'),
            validate: value => {
              try {
                const url = new URL(value);
                if (!['http:', 'https:'].includes(url.protocol)) {
                  return 'The URL must start with http:// or https://';
                }
                return true;
              } catch {
                return 'The URL is not valid';
              }
            },
            format: value => {
              try {
                const url = new URL(value);
                return `${url.protocol}//${url.host}`;
              } catch {
                return value; // Shouldn't hit this because of validation
              }
            }
          },
          {
            type: 'password',
            name: 'haToken',
            message: reset('(optional) HA Token:'),
            initial: '',
          }
        ],
        {
          onCancel: () => {
            abort = true;
            throw new Error(red('✖') + ' Operation cancelled')
          }
        },
      )
    } catch (cancelled) {
      abort = true;
      console.info(cancelled);
      return;
    }

    if (abort) {
      process.exit(0);
    }

    // user choice associated with prompts
    const { projectName, haUrl, haToken } = result;

    if (haUrl && haToken) {
      try {
        const auth = await createLongLivedTokenAuth(haUrl, haToken);
        const response = await validateConnection(auth.wsUrl, auth.accessToken);
        console.log(green(`\n✔ ${response}`));
      } catch (e) {
        console.error(red(`✖ Failed to connect to Home Assistant: ${e}`));
        process.exit(1);
      }
    } else if (haUrl) {
      try {
        await validateHaUrl(haUrl);
      } catch (e) {
        console.error(red(`✖ ${e}`));
        process.exit(1);
      }
    }
    console.log(cyan(`Scaffolding Hakit in ${cyan(projectName)}...`));
    const viteCommand = `npm create vite@latest ${projectName} -- --template react-ts`;

    const [command, ...args] = viteCommand.split(' ')
    const { status } = spawn.sync(command, args, {
      stdio: 'inherit',
    });
    // now clear the terminal and print out the next steps
    process.stdout.write('\x1Bc');

    console.log(cyan('Post creation tasks...'));

    FILES_TO_REMOVE.forEach((file) => removeFileOrDirectory(path.resolve(projectName, file)));
    const root = path.join(cwd, projectName)
    const cdProjectName = path.relative(cwd, root);
    const templateDir = path.resolve(
      fileURLToPath(import.meta.url),
      '../..',
      `template`,
    )
    const files = fs.readdirSync(templateDir);

    for (const file of files) {
      if (mergeFiles[file]) continue;
      write(file, root, templateDir);
    }

    updateTsconfig(projectName, root, templateDir);
    updatePackageJson({
      targetDir: projectName,
      root,
      templateDir,
    });
    updateViteFile({
      targetDir: projectName,
      root,
      templateDir,
    })
    updateReadme(projectName, root, templateDir);
    updateNvmRC(root, templateDir);

    write('src/index.css', root, templateDir, `#root { width: 100%; height: 100%; }`);

    const envFile = path.resolve(projectName, '.env');
    const envFileContent = fs.readFileSync(envFile, 'utf-8');
    write('.env', root, templateDir, envFileContent
      .replace('{FOLDER_NAME}', cdProjectName)
      .replace('VITE_HA_URL=', `VITE_HA_URL=${(haUrl ?? '').replace(/\/$/, '')}`));
    // now update the .env.development file
    const envDevFile = path.resolve(projectName, '.env.development');
    const envDevFileContent = fs.readFileSync(envDevFile, 'utf-8');
    write('.env.development', root, templateDir, envDevFileContent
      .replace('VITE_HA_TOKEN=', `VITE_HA_TOKEN=${haToken}`));

    console.info(green(`\n✔ Success! Next steps:`));
    // now let's print out the steps in one log
    const steps = [
      `cd ${projectName}`,
      `npm install`,
      `## Optional: Will generate typescript types for your Home Assistant instance`,
      haToken ? `npm run sync` : '',
      `npm run dev`,
    ].filter(x => !!x);

    // now, print out the steps, if there's a step with ## in the name, do not prefix with  a number
    let stepTracker = 0;
    const generatedSteps = steps.map((step) => {
      if (step.startsWith('##')) {
        return gray(`  ${step}`);
      }
      stepTracker++;
      return white(`  ${stepTracker}. ${step}`);
    });

    console.info(`\n${generatedSteps.join('\n')}`);

    if (!haToken) {
      console.info(yellow(`\nWARN: You didn't provide a token and the \`npm run sync\` functionality will not work without one. Update the VITE_HA_TOKEN value in the .env file.`));
    }
    console.info(cyan(`\nDEPLOYING`));

    console.info(white(`\nAdd in the optional SSH values to your .env file to ensure that "npm run deploy" will work correctly.`));
    console.info(white(`\nTo retrieve the SSH information, follow the instructions here: https://shannonhochkins.github.io/ha-component-kit/?path=/docs/introduction-deploying--docs`));
    console.info();
    process.exit(status ?? 0)

  } catch (error) {
    console.error(`Failed to create project: ${error}`);
  }
};

function formatTargetDir(targetDir: string | undefined) {
  return targetDir?.trim().replace(/\/+$/g, '')
}



function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true })
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    const destFile = path.resolve(destDir, file)
    copy(srcFile, destFile)
  }
}
function copy(src: string, dest: string) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    copyDir(src, dest)
  } else {
    fs.copyFileSync(src, dest)
  }
}
function removeFileOrDirectory(targetPath: string) {
  try {
    const stats = fs.statSync(targetPath);

    if (stats.isDirectory()) {
      // To delete a directory recursively, set the `recursive` option to `true`
      fs.rmdirSync(targetPath, { recursive: true });
    } else if (stats.isFile()) {
      fs.unlinkSync(targetPath);
    } else {
      console.error(`Unsupported file type at ${targetPath}`);
    }
  } catch (error) {
    console.error(`Failed to remove ${targetPath}: ${error}`);
  }
};

function write(file: string, root: string, templateDir: string, content?: string) {
  const targetPath = path.join(root, renameFiles[file] ?? file)
  if (content) {
    fs.writeFileSync(targetPath, content)
  } else {
    copy(path.join(templateDir, file), targetPath)
  }
}

function updateTsconfig(targetDir: string, root: string, templateDir: string) {
  const tsconfigFile = path.resolve(targetDir, 'tsconfig.json');
  let tsconfigContent = fs.readFileSync(tsconfigFile, 'utf-8');
  // Find the include array and inject new items
  tsconfigContent = tsconfigContent.replace(
    /("include"\s*:\s*\[)([^\]]*)(\])/,
    (_, start, middle, end) => {
      const newItems = `"sync-types.ts", ".d.ts", `;
      return `${start}${newItems}${middle}${end}`;
    }
  );
  write('tsconfig.json', root, templateDir, tsconfigContent);
}

function updatePackageJson({
  targetDir,
  root,
  templateDir,
}: {
  targetDir: string;
  root: string;
  templateDir: string;
}) {
  const reactVersion = getLatestNpmVersion('react');
  const reactDomVersion = getLatestNpmVersion('react-dom');
  // now the types
  const typesReactVersion = getLatestNpmVersion('@types/react');
  const typesReactDomVersion = getLatestNpmVersion('@types/react-dom');
  const coreVersion = getLatestNpmVersion('@hakit/core');
  const componentsVersion = getLatestNpmVersion('@hakit/components');
  const prettierVersion = getLatestNpmVersion('prettier');
  const dotenvVersion = getLatestNpmVersion('dotenv');
  const nodeScpVersion = getLatestNpmVersion('node-scp');
  const chalk = getLatestNpmVersion('chalk');
  const prompts = getLatestNpmVersion('prompts');
  const nodeTypesVersion = getLatestNpmVersion('@types/node');
  const packageFile = path.resolve(targetDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(packageFile, 'utf-8'));
  pkg.dependencies = {
    ...pkg.dependencies,
    react: `^${reactVersion}`,
    'react-dom': `^${reactDomVersion}`,
    '@hakit/core': `^${coreVersion}`,
    '@hakit/components': `^${componentsVersion}`,
  };
  pkg.devDependencies = {
    ...pkg.devDependencies,
    "prettier": `^${prettierVersion}`,
    "dotenv": `^${dotenvVersion}`,
    "@types/node": `^${nodeTypesVersion}`,
    "node-scp": `^${nodeScpVersion}`,
    "prompts": `^${prompts}`,
    "chalk": `^${chalk}`,
    "@types/react": `^${typesReactVersion}`,
    "@types/react-dom": `^${typesReactDomVersion}`,
  };
  pkg.scripts = {
    ...pkg.scripts,
    "prettier": "prettier --write .",
    "sync": "npx tsx scripts/sync-types.ts",
    "prebuild": "npm run prettier",
    "deploy": "npx tsx scripts/deploy.ts"
  }
  write('package.json', root, templateDir, JSON.stringify(pkg, null, 2));
}

function injectEnvironmentVariableToViteFile(content: string) {
  const insertion = `
import dotenv from 'dotenv';
dotenv.config();

const VITE_FOLDER_NAME = process.env.VITE_FOLDER_NAME;

// Check if the environment variable is set
if (typeof VITE_FOLDER_NAME === 'undefined' || VITE_FOLDER_NAME === '') {
  console.error('VITE_FOLDER_NAME environment variable is not set, update your .env file with a value naming your dashboard, eg "VITE_FOLDER_NAME=ha-dashboard"');
  process.exit(1);
}
`;
  const targetWithSemicolon = "import react from '@vitejs/plugin-react';";
  const targetWithoutSemicolon = "import react from '@vitejs/plugin-react'";

  let position = content.indexOf(targetWithSemicolon);
  if (position === -1) {
      position = content.indexOf(targetWithoutSemicolon);
      if (position === -1) {
          throw new Error('Target import not found in the file content.');
      }
  }

  // Determine the actual end of the found line (consider if semicolon was found or not)
  const endOfLine = content.indexOf('\n', position) + 1;

  // If the line doesn't end with a semicolon, adjust accordingly
  if (position === content.indexOf(targetWithoutSemicolon)) {
      position += targetWithoutSemicolon.length;
  } else {
      position += targetWithSemicolon.length;
  }
  return content.substring(0, endOfLine) + insertion + content.substring(endOfLine);;
}

function updateViteFile({
  targetDir,
  root,
  templateDir,
}: {
  targetDir: string;
  root: string;
  templateDir: string;
}) {
  const viteFile = path.resolve(targetDir, 'vite.config.ts');
  const fileContent = injectEnvironmentVariableToViteFile(fs.readFileSync(viteFile, 'utf-8'));
  const updatedContent = fileContent
  .replace(
    /(defineConfig\(\{)/,
    `$1\n  base: \`/local/\${VITE_FOLDER_NAME}/\`,`
  );
  write('vite.config.ts', root, templateDir, updatedContent);
}

function updateReadme(targetDir: string, root: string, templateDir: string) {
  const readmeFile = path.resolve(targetDir, 'README.md');
  const readmeFileTemplate = path.resolve(templateDir, 'README.md');
  const readmeFileContents = fs.readFileSync(readmeFile, 'utf-8');
  const readmeFileTemplateContents = fs.readFileSync(readmeFileTemplate, 'utf-8');

  write('README.md', root, templateDir, `${readmeFileTemplateContents}${readmeFileContents}`);
}

function updateNvmRC(root: string, templateDir: string) {
  // get the current node version from the user
  const nodeVersion = process.version;
  write('.nvmrc', root, templateDir, nodeVersion);
}

createProject().catch((e) => {
  console.error(e);
});