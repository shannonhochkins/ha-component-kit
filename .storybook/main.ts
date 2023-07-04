import type { StorybookConfig } from "@storybook/react-vite";
import path from 'path';
import { loadConfigFromFile, mergeConfig } from 'vite';
import tsconfigPaths from "vite-tsconfig-paths";
export default ({
  stories: ["../src/**/*.mdx", "../stories/**/*.mdx", "../stories/*.mdx", "../stories/*.stories.@(js|jsx|ts|tsx)", "../stories/**/*.stories.@(js|jsx|ts|tsx)", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-styling", "@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-interactions", "@storybook/addon-controls", "@storybook/addon-docs", "@storybook/addon-mdx-gfm"],
  core: {},
  staticDirs: ['../static'],
  framework: {
    name: "@storybook/react-vite",
    options: {}
  },
  docs: {
    autodocs: 'tag'
  },
  features: {
    // storyStoreV7: true
  },
  /**
   * A option exposed by storybook-builder-vite for customising the Vite config.
   * @see https://github.com/eirslett/storybook-builder-vite#customize-vite-config
   * @param {import("vite").UserConfig} config
   * @see https://vitejs.dev/config/
   */
  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [
        /** @see https://github.com/aleclarson/vite-tsconfig-paths */
        tsconfigPaths({
          // My tsconfig.json isn't simply in viteConfig.root,
          // so I've passed an explicit path to it:
          projects: [path.resolve(path.dirname(__dirname), "./", "tsconfig.json")],
        })
      ]
    });
  },
} satisfies StorybookConfig);
