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
          'javascript-time-ago/locale/en.json'
        ],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
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
