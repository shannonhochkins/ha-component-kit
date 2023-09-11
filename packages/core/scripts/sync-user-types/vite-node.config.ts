import { defineConfig } from 'vite';
import EsLint from 'vite-plugin-linter';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
const { EsLinter, linterPlugin } = EsLint;
import { node } from '@liuli-util/vite-plugin-node';
import dts from 'vite-plugin-dts'
// https://vitejs.dev/config/
export default defineConfig(configEnv => {
  return {
    root: path.resolve(__dirname, '../../'),
    build: {
      emptyOutDir: false,
      outDir: path.resolve(__dirname, '../../dist/sync/node'),
      rollupOptions: {
        external:[
          'prettier',
          'home-assistant-js-websocket',
          'ws',
          'lodash'
        ],
        output: {
          globals: {
            'home-assistant-js-websocket': 'home-assistant-js-websocket',
            'lodash': 'lodash',
            'prettier': 'prettier',
            'ws': 'ws',
          }
        }
      },
      sourcemap: true,
      minify: true,
    },
    plugins: [
      tsconfigPaths({
        root: path.resolve(__dirname, './')
      }),
      linterPlugin({
        include: ['./*.{ts,tsx}'],
        linters: [new EsLinter({ configEnv })],
      }),
      node({
        entry: path.resolve(__dirname, './index.ts'),
        formats: ['cjs'],
        dts: false,
      }),
      dts({
        rollupTypes: false,
        root: path.resolve(__dirname, './'),
        outDir: path.resolve(__dirname, '../../dist/sync/node/types'),
        clearPureImport: true,
        insertTypesEntry: false,
        beforeWriteFile: (filePath, content) => {
          if (filePath.includes('cli.d.ts')) return false;
          return {
            filePath,
            content,
          }
        },
      })
    ],
  }
});
