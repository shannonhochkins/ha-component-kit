import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import react from '@vitejs/plugin-react';
import EsLint from 'vite-plugin-linter';
import packageJson from './package.json';
const { EsLinter, linterPlugin } = EsLint

// https://vitejs.dev/config/
export default defineConfig(configEnv => ({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'haComponentKit',
      formats: ['es', 'umd'],
      fileName: (format) => `ha-component-kit.${format}.js`,
    },
    rollupOptions: {
      external: [...Object.keys(packageJson.peerDependencies)],
    },
  },
  plugins: [
    react(),
    linterPlugin({
      include: ['./src}/**/*.{ts,tsx}'],
      linters: [new EsLinter({ configEnv })],
    }),
    dts({
      outputDir: 'dist/types',
    })],
}));
