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
    build: {
      target: 'es2020',
      lib: {
        entry: path.resolve(__dirname, 'src/index.ts'),
        name: 'hakit-components',
        formats: ['es', 'umd'],
        fileName: (format) => `hakit-components.${format}.js`,
      },
      rollupOptions: {
        external:[
          ...Object.keys(packageJson.peerDependencies),
          'react/jsx-runtime',
          'react-is',
          '@hakit/core',
          '@iconify/react',
        ],
        output: {
          globals: {
            react: 'React',
            'react-thermostat': 'react-thermostat',
            'react-dom': 'ReactDOM',
            '@emotion/styled': '@emotion/styled',
            '@emotion/react': '@emotion/react',
            'react/jsx-runtime': 'react/jsx-runtime',
            '@hakit/core': '@hakit/core',
            'lodash': 'lodash',
            'react-is': 'react-is',
            '@iconify/react': '@iconify/react',
            'react-router-dom': "react-router-dom",
            'framer-motion': 'framer-motion',
            'react-use': 'react-use',
            "@use-gesture/react": "@use-gesture/react"
          }
        }
      },
      minify: true,
    },
    plugins: [
      tsconfigPaths({
        root: path.resolve(__dirname, './')
      }),
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
    ],
  }
});
