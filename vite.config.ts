import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import react from '@vitejs/plugin-react';
import EsLint from 'vite-plugin-linter';
import tsconfigPaths from 'vite-tsconfig-paths';
import packageJson from './package.json';
import path from 'path';
const { EsLinter, linterPlugin } = EsLint
console.log('path.resolve(__dirname, "./src")', path.resolve(__dirname, "./src"));
// https://vitejs.dev/config/
export default defineConfig(configEnv => {
  const isBuildStorybook = process.env.BUILD_STORYBOOK === 'true';
  return {
    build: {
      lib: {
        entry: 'src/index.ts',
        name: 'haComponentKit',
        formats: ['es', 'umd'],
        fileName: (format) => `ha-component-kit.${format}.js`,
      },
      rollupOptions: {
        external:[
          ...Object.keys(packageJson.peerDependencies),
          'react/jsx-runtime',
          '@emotion/cache',
          'react-is',
          '@emotion/utils',
          '@emotion/serialize',
          '@mui/material'
        ],
        output: {
          globals: {
            '@mui/material': '@mui/material',
            react: 'React',
            'react-dom': 'ReactDOM',
            lodash: 'lodash',
            '@emotion/cache': '@emotion/cache',
            'react/jsx-runtime': 'react/jsx-runtime',
            '@emotion/styled': 'styled',
            '@emotion/react': '@emotion/react',
            '@emotion/utils': '@emotion/utils',
            '@iconify/react': '@iconify/react',
            '@emotion/serialize': '@emotion/serialize',
            'react-is': 'react-is',
            'use-debounce': 'use-debounce',
            'home-assistant-js-websocket': 'home-assistant-js-websocket',
          }
        }
      },
      minify: true,
    },
    plugins: [
      tsconfigPaths(),
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin'],
        },
      }),
      linterPlugin({
        include: ['./src}/**/*.{ts,tsx}'],
        linters: [new EsLinter({ configEnv })],
      }),
      ...(isBuildStorybook ? [] : [dts({ outputDir: 'dist/types', rollupTypes: true })]),
    ],
  }
});
