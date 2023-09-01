import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import EsLint from 'vite-plugin-linter';
import tsconfigPaths from 'vite-tsconfig-paths';
import packageJson from './package.json';
import path from 'path';
const { EsLinter, linterPlugin } = EsLint;
import dts from 'vite-plugin-dts';
// https://vitejs.dev/config/
export default defineConfig(configEnv => {
  return {
    build: {
      target: 'es2020',
      lib: {
        entry: path.resolve(__dirname, 'src/index.ts'),
        name: 'hakit-components',
        formats: ['es', 'cjs'],
        fileName: (format) => `hakit-components.${format}.${format === 'cjs' ? 'cjs' : 'js'}`,
      },
      rollupOptions: {
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
        ],
        output: {
          globals: {
            react: 'React',
            'react-thermostat': 'react-thermostat',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'react/jsx-runtime',
            '@hakit/core': '@hakit/core',
            'lodash': 'lodash',
            'react-is': 'react-is',
            '@iconify/react': '@iconify/react',
            'react-router-dom': "react-router-dom",
            'framer-motion': 'framer-motion',
            'react-use': 'react-use',
            '@emotion/styled': '@emotion/styled',
            '@emotion/react': '@emotion/react',
            "@use-gesture/react": "@use-gesture/react",
            '@emotion/sheet': '@emotion/sheet',
            '@emotion/cache': '@emotion/cache',
            '@emotion/serialize': '@emotion/serialize',
            '@emotion/utils': '@emotion/utils',
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
      dts({
        rollupTypes: false,
        root: path.resolve(__dirname, './'),
        outDir: path.resolve(__dirname, './dist/types'),
        include: [path.resolve(__dirname, './src')],
        exclude: ['node_modules/**', 'framer-motion'],
        clearPureImport: true,
        insertTypesEntry: false,
        aliasesExclude: ['@hakit/core'],
        beforeWriteFile: (filePath, content) => {
          const base = path.resolve(__dirname, './dist/types/packages/components/src');
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
