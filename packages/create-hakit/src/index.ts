import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import spawn from 'cross-spawn';
import prompts from 'prompts';
import minimist from 'minimist';
import { execSync } from 'child_process';
import {
  red,
  blue,
  yellow,
  green,
  cyan,
  reset,
} from 'kolorist';

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

// Avoids autoconversion to number of the project name by defining that the args
// non associated with an option ( _ ) needs to be parsed as a string. See #4606
const argv = minimist<{
  t?: string
  template?: string
}>(process.argv.slice(2), { string: ['_'] });
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


// A functional approach to creating the project
const createProject = async () => {
  try {
    const argTargetDir = formatTargetDir(argv._[0]);
    // const argTemplate = argv.template || argv.t
    let targetDir = argTargetDir || defaultTargetDir;
    let result: prompts.Answers<
      'projectName' | 'haUrl'
    >;
    let abort = false;
    try {
      result = await prompts(
        [
          {
            type: argTargetDir ? null : 'text',
            name: 'projectName',
            message: reset('Project name:'),
            initial: defaultTargetDir,
            onState: (state) => {
              targetDir = formatTargetDir(state.value) || defaultTargetDir
            },
          },
          {
            type: argTargetDir ? null : 'text',
            name: 'haUrl',
            initial: 'http://homeassistant.local:8123',
            message: reset('HA Url:'),
          },
        ],
        {
          onCancel: () => {
            abort = true;
            throw new Error(red('✖') + ' Operation cancelled')
          },
        },
      )
    } catch (cancelled: any) {
      abort = true;
      console.info(cancelled.message);
      return;
    }

    if (abort) {
      process.exit(0);
    }

    // user choice associated with prompts
    const { projectName, haUrl } = result;

    const viteCommand = `npm create vite@latest ${projectName} -- --template react-ts`;

    const [command, ...args] = viteCommand.split(' ')
    const { status } = spawn.sync(command, args, {
      stdio: 'inherit',
    });

    FILES_TO_REMOVE.forEach((file) => removeFileOrDirectory(path.resolve(targetDir, file)));
    const root = path.join(cwd, targetDir)
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

    updateTsconfig(targetDir, root, templateDir);
    updatePackageJson({
      targetDir,
      root,
      templateDir,
    });
    updateViteFile({
      targetDir,
      root,
      templateDir,
    })
    updateReadme(targetDir, root, templateDir);

    write('src/index.css', root, templateDir, `#root { width: 100%; height: 100%; }`);

    const envFile = path.resolve(targetDir, '.env');
    let envFileContent = fs.readFileSync(envFile, 'utf-8');
    write('.env', root, templateDir, envFileContent
      .replace('{FOLDER_NAME}', cdProjectName)
      .replace('VITE_HA_URL=', `VITE_HA_URL=${(haUrl ?? '').replace(/\/$/, '')}`));

    if (haUrl.startsWith('https')) {
      console.info(blue(`\nNEXT STEPS: SYNC: Ensure you update ${cdProjectName}/.env with your VITE_HA_TOKEN`));
      console.info(green(`\nNEXT STEPS: SYNC: Once you've updated the .env file, run "npm run sync" to generate your types!`));
    } else {
      console.info(yellow(`\nWARN: You're using an insecure connection and the \`npm run sync\` functionality will not work unless used with https protocol. Update the ./sync-types "url" value to use a secure connection to use the typescript sync feature.`));
    }
    console.info(cyan(`\nNEXT STEPS: DEPLOY: Add in the optional SSH values to ensure that "npm run deploy" will work correctly.`));
    console.info(cyan(`\nNEXT STEPS: DEPLOY: To retrieve the SSH information, follow the instructions here: https://shannonhochkins.github.io/ha-component-kit/?path=/docs/introduction-deploying--docs`));
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
  const coreVersion = getLatestNpmVersion('@hakit/core');
  const componentsVersion = getLatestNpmVersion('@hakit/components');
  const prettierVersion = getLatestNpmVersion('prettier');
  const dotenvVersion = getLatestNpmVersion('dotenv');
  const nodeScpVersion = getLatestNpmVersion('node-scp');
  const chalk = getLatestNpmVersion('chalk');
  const nodeTypesVersion = getLatestNpmVersion('@types/node');
  const packageFile = path.resolve(targetDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(packageFile, 'utf-8'));
  pkg.dependencies = {
    ...pkg.dependencies,
    '@hakit/core': `^${coreVersion}`,
    '@hakit/components': `^${componentsVersion}`,
  };
  pkg.devDependencies = {
    ...pkg.devDependencies,
    "prettier": `^${prettierVersion}`,
    "dotenv": `^${dotenvVersion}`,
    "@types/node": `^${nodeTypesVersion}`,
    "node-scp": `^${nodeScpVersion}`,
    "chalk": `^${chalk}`,
  };
  pkg.scripts = {
    ...pkg.scripts,
    "prettier": "prettier --write .",
    "sync": "npx tsx ./sync-types.ts",
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

createProject().catch((e) => {
  console.error(e);
});