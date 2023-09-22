import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import EsLint from 'vite-plugin-linter';
import tsconfigPaths from 'vite-tsconfig-paths';
import packageJson from './package.json';
import path from 'path';
import dts from 'vite-plugin-dts';
const { EsLinter, linterPlugin } = EsLint;
// https://vitejs.dev/config/
export default defineConfig(configEnv => {
  return {
    root: path.resolve(__dirname, './'),
    build: {
      sourcemap: true,
      emptyOutDir: false,
      lib: {
        entry: path.resolve(__dirname, 'src/index.ts'),
        name: 'hakit-core',
        formats: ['es', 'cjs'],
        fileName: (format) => `hakit-core.${format}.${format === 'cjs' ? 'cjs' : 'js'}`,
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
            'framer-motion': 'framer-motion',
            'react/jsx-runtime': 'react/jsx-runtime',
            'home-assistant-js-websocket': 'home-assistant-js-websocket',
            'javascript-time-ago': 'javascript-time-ago',
            'javascript-time-ago/locale/en.json': 'javascript-time-ago/locale/en.json',
            "react-router-dom": "react-router-dom",
            'react-thermostat': 'react-thermostat',
            '@emotion/styled': '@emotion/styled',
            '@emotion/react': '@emotion/react',
            '@emotion/sheet': '@emotion/sheet',
            '@emotion/cache': '@emotion/cache',
            '@emotion/serialize': '@emotion/serialize',
            '@emotion/utils': '@emotion/utils',
            'zustand': 'zustand',
            'deep-object-diff': 'deep-object-diff',
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
      dts({
        rollupTypes: false,
        root: path.resolve(__dirname, './'),
        outDir: path.resolve(__dirname, './dist/types'),
        include: [path.resolve(__dirname, './src')],
        clearPureImport: true,
        insertTypesEntry: false,
        beforeWriteFile: (filePath, content) => {
          const base = path.resolve(__dirname, './dist/types/packages/core/src');
          const replace = path.resolve(__dirname, './dist/types');
          if (filePath.includes('test.d.ts')) return false;
          if (filePath.includes('stories.d.ts')) return false;
          return {
            filePath: filePath.replace(base, replace),
            content,
          }
        },
      })
    ],
  }
});
