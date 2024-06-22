import { defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { EsLinter, linterPlugin } from 'vite-plugin-linter';
import tsconfigPaths from 'vite-tsconfig-paths';
import packageJson from './package.json';
import { fileURLToPath } from 'node:url';
import { extname, relative, resolve } from 'path'
import { glob } from 'glob';

import dts from 'vite-plugin-dts';

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  '@iconify/react': '@iconify/react',
  'use-debounce': 'use-debounce',
  'lodash': 'lodash',
  'framer-motion': 'framer-motion',
  'react/jsx-runtime': 'react/jsx-runtime',
  'home-assistant-js-websocket': 'home-assistant-js-websocket',
  '@emotion/styled': '@emotion/styled',
  '@emotion/react': '@emotion/react',
  '@emotion/sheet': '@emotion/sheet',
  '@emotion/cache': '@emotion/cache',
  '@emotion/serialize': '@emotion/serialize',
  '@emotion/utils': '@emotion/utils',
  'zustand': 'zustand',
  'deep-object-diff': 'deep-object-diff',
};
// https://vitejs.dev/config/
export default defineConfig(configEnv => {
  return {
    root: resolve(__dirname, './'),
    json: {
      namedExports: false,
    },
    build: {
      target: 'esnext',
      sourcemap: true,
      emptyOutDir: false,
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'hakit-core',
        formats: ['es', 'cjs'],
      },
      rollupOptions: {
        input: Object.fromEntries(
          glob.sync([
            'src/*.{ts,tsx}',
            'src/**/*.{ts,tsx}',
            'src/**/**/*.{ts,tsx}',
            'src/**/locales/**/*.json',
          ], {
            ignore: ['**/*stories.ts', '**/*stories.tsx', "**/*.test.{ts,tsx}"]
          }).map(file => {
            return [
            // The name of the entry point
            // src/nested/foo.ts becomes nested/foo
            relative(
              'src',
              file.slice(0, file.length - extname(file).length)
            ),
            // The absolute path to the entry file
            // src/nested/foo.ts becomes /project/src/nested/foo.ts
            fileURLToPath(new URL(file, import.meta.url))
          ]})
       ),
        external:[
          ...Object.keys(packageJson.peerDependencies),
          'react/jsx-runtime',
          'react-is',
          '@emotion/sheet',
          '@emotion/cache',
          '@emotion/serialize',
          '@emotion/utils',
        ],
        output: {
          globals,
          assetFileNames: 'assets/[name][extname]',
          entryFileNames: '[format]/[name].js',
          exports: 'named',
        }
      },
      minify: true,
    },
    plugins: [
      tsconfigPaths({
        root: resolve(__dirname, './')
      }),
      react(),
      linterPlugin({
        include: ['./src}/**/*.{ts,tsx}'],
        linters: [new EsLinter({ configEnv: configEnv })],
      }),
      dts({
        logLevel: 'silent',
        rollupTypes: false,
        root: resolve(__dirname, './'),
        outDir: resolve(__dirname, './dist/types'),
        include: ['./src'],
        clearPureImport: true,
        insertTypesEntry: false,
        beforeWriteFile: (filePath, content) => {
          const base = resolve(__dirname, './dist/types/packages/core/src');
          const replace = resolve(__dirname, './dist/types');
          if (filePath.includes('test.d.ts')) return false;
          if (filePath.includes('stories.d.ts')) return false;
          return {
            filePath: filePath.replace(base, replace),
            content,
          }
        },
      })
    ],
  } satisfies UserConfig;
});
