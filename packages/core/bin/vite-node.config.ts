import { defineConfig } from 'vite';
import EsLint from 'vite-plugin-linter';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
const { EsLinter, linterPlugin } = EsLint;
import { node } from '@liuli-util/vite-plugin-node';
// https://vitejs.dev/config/
export default defineConfig(configEnv => {
  return {
    root: path.resolve(__dirname, '../'),
    build: {
      outDir: path.resolve(__dirname, '../dist/sync/node'),
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
        formats: ['cjs', 'es'],
        dts: true,
      })
    ],
  }
});
