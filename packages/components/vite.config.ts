import { UserConfig, PluginOption, defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { EsLinter, linterPlugin } from 'vite-plugin-linter';
import tsconfigPaths from 'vite-tsconfig-paths';
import packageJson from './package.json';
import dts from 'vite-plugin-dts';
import svgr from "vite-plugin-svgr";
import { fileURLToPath } from 'node:url';
import { extname, relative, resolve } from 'path'
import { glob } from 'glob'

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'react/jsx-runtime': 'react/jsx-runtime',
  '@hakit/core': '@hakit/core',
  'lodash': 'lodash',
  'react-is': 'react-is',
  '@iconify/react': '@iconify/react',
  'framer-motion': 'framer-motion',
  'react-use': 'react-use',
  '@emotion/styled': '@emotion/styled',
  '@emotion/react': '@emotion/react',
  "@use-gesture/react": "@use-gesture/react",
  '@emotion/sheet': '@emotion/sheet',
  '@emotion/cache': '@emotion/cache',
  '@emotion/serialize': '@emotion/serialize',
  '@emotion/utils': '@emotion/utils',
  "react-resize-detector": "react-resize-detector",
  "@fullcalendar/react": "@fullcalendar/react",
  "fullcalendar": "fullcalendar",
  "@fullcalendar/core": "@fullcalendar/core",
  "@fullcalendar/daygrid": "@fullcalendar/daygrid",
  "@fullcalendar/interaction": "@fullcalendar/interaction",
  "@fullcalendar/list": "@fullcalendar/list",
  'autolinker': 'autolinker',
  'use-long-press': 'use-long-press',
  'zustand': 'zustand',
  'react-error-boundary': 'react-error-boundary',
  'react-switch': 'react-switch',
};

// https://vitejs.dev/config/
export default defineConfig(configEnv => {
  const plugins = [
    tsconfigPaths({
      root: resolve(__dirname, './')
    }),
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: [
          [
            '@emotion/babel-plugin',
            {
              sourceMap: configEnv.mode !== 'production', // Disable source maps for Emotion in production mode
              autoLabel: 'dev-only',
              labelFormat: '[local]',
              cssPropOptimization: true,
            },
          ],
        ],
      },
    }),
    svgr(),
    linterPlugin({
      include: ['./src}/**/*.{ts,tsx}'],
      linters: [new EsLinter({ configEnv })],
    }),
  ] satisfies UserConfig['plugins'];
  const productionPlugins = [
    dts({
      rollupTypes: false,
      root: resolve(__dirname, './'),
      outDir: resolve(__dirname, './dist/types'),
      include: [resolve(__dirname, './src')],
      exclude: ['node_modules/**', 'framer-motion'],
      clearPureImport: true,
      copyDtsFiles: true,
      insertTypesEntry: true,
      aliasesExclude: ['@hakit/core'],
      beforeWriteFile: (filePath, content) => {
        const base = resolve(__dirname, './dist/types/packages/components/src');
        const replace = resolve(__dirname, './dist/types');
        if (filePath.includes('test.d.ts')) return false;
        if (filePath.includes('stories.d.ts')) return false;
        if (filePath.includes('src/index.d.ts')) {
          content = `/// <reference path="./.d.ts" />
${content}`
        }
        return {
          filePath: filePath.replace(base, replace),
          content,
        }
      },
    })
  ] satisfies PluginOption[];
  if (configEnv.mode === 'production') {
    plugins.push(...productionPlugins);
  }
  let input = undefined;
  if (configEnv.mode === 'production') {
    input = Object.fromEntries(
      glob.sync([
        'src/*.{ts,tsx}',
        'src/**/*.{ts,tsx}',
        'src/**/**/*.{ts,tsx}',
      ], {
        ignore: ['**/*stories.ts', '**/*stories.tsx', "**/*.test.{ts,tsx}"]
      }).map(file => [
         // The name of the entry point
         // src/nested/foo.ts becomes nested/foo
         relative(
           'src',
           file.slice(0, file.length - extname(file).length)
         ),
         // The absolute path to the entry file
         // src/nested/foo.ts becomes /project/src/nested/foo.ts
         fileURLToPath(new URL(file, import.meta.url))
       ])
    )
  }
  return {
    build: {
      target: 'es2020',
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'hakit-components',
        formats: ['es', 'cjs'],
      },
      rollupOptions: {
        input,
        external:[
          ...Object.keys(packageJson.peerDependencies),
          'react/jsx-runtime',
          'react-is',
          '@hakit/core',
          '@iconify/react',
          '@emotion/sheet',
          '@emotion/cache',
          '@emotion/serialize',
          '@emotion/utils',
          "@fullcalendar/core",
          "@fullcalendar/daygrid",
          "@fullcalendar/interaction",
          "@fullcalendar/list",
          "react-switch",
        ],
        output: {
          globals,
          assetFileNames: 'assets/[name][extname]',
          entryFileNames: '[format]/[name].js',
          exports: 'named',
        }
      },
      sourcemap: true,
      minify: configEnv.mode === 'production',
    },
    plugins,
  } satisfies UserConfig;
});
