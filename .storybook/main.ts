import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from 'vite';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(ts|tsx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  core: {
    builder: '@storybook/builder-vite', // 👈 The builder enabled here.
  },
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  /**
   * A option exposed by storybook-builder-vite for customising the Vite config.
   * @see https://github.com/eirslett/storybook-builder-vite#customize-vite-config
   * @param {import("vite").UserConfig} config
   * @see https://vitejs.dev/config/
   */
  viteFinal: async (config) => {
    if (!config.plugins) config.plugins = [];
    config.plugins.push(
      /** @see https://github.com/aleclarson/vite-tsconfig-paths */
      tsconfigPaths({
        projects: [path.resolve(path.dirname(__dirname), "tsconfig.json")],
      })
    );
    
    return config;
  },
};
export default config;
