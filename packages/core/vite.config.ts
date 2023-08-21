import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import EsLint from 'vite-plugin-linter';
import tsconfigPaths from 'vite-tsconfig-paths';
import packageJson from './package.json';
import path from 'path';
const { EsLinter, linterPlugin } = EsLint;
// https://vitejs.dev/config/
export default defineConfig(configEnv => {
  return {
    root: path.resolve(__dirname, './'),
    build: {
      lib: {
        entry: path.resolve(__dirname, 'src/index.ts'),
        name: 'hakit-core',
        formats: ['es', 'umd'],
        fileName: (format) => `hakit-core.${format}.js`,
      },
      rollupOptions: {
        external:[
          ...Object.keys(packageJson.peerDependencies),
          'react/jsx-runtime',
          'react-is',
          'javascript-time-ago/locale/en.json',
          '@emotion/sheet',
          '@emotion/cache',
          '@emotion/serialize',
          '@emotion/utils',
        ],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            '@iconify/react': '@iconify/react',
            'use-debounce': 'use-debounce',
            'lodash': 'lodash',
            'react/jsx-runtime': 'react/jsx-runtime',
            'home-assistant-js-websocket': 'home-assistant-js-websocket',
            'javascript-time-ago': 'javascript-time-ago',
            'javascript-time-ago/locale/en.json': 'javascript-time-ago/locale/en.json',
            "react-router-dom": "react-router-dom",
            'react-thermostat': 'react-thermostat',
            '@emotion/sheet': '@emotion/sheet',
            '@emotion/cache': '@emotion/cache',
            '@emotion/serialize': '@emotion/serialize',
            '@emotion/utils': '@emotion/utils',
          }
        }
      },
      minify: true,
    },
    plugins: [
      tsconfigPaths({
        root: path.resolve(__dirname, './')
      }),
      react(),
      linterPlugin({
        include: ['./src}/**/*.{ts,tsx}'],
        linters: [new EsLinter({ configEnv })],
      }),
    ],
  }
});
