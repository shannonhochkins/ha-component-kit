import type { StorybookConfig } from "@storybook/react-vite";
import path from 'path';
import { mergeConfig } from 'vite';
import tsconfigPaths from "vite-tsconfig-paths";
export default ({
  stories: [
    "../packages/**/*.mdx",
    "../stories/**/*.mdx",
    "../stories/*.mdx",
    "../stories/*.stories.@(js|jsx|ts|tsx)",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
    "../packages/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: ["@storybook/addon-styling", "@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-interactions", "@storybook/addon-controls", "@storybook/addon-docs"],
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
    storyStoreV7: true
  },
  typescript: {
    check: true,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      propFilter: (prop: any) => {
        const res = /react-thermostat/.test(prop.parent?.fileName) || !/node_modules/.test(prop.parent?.fileName);
        return prop.parent ? res : true;
      },
      shouldExtractLiteralValuesFromEnum: true,
      compilerOptions: {
        allowSyntheticDefaultImports: false,
        esModuleInterop: false,
      },
    }
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
        tsconfigPaths()
      ]
    });
  },
} satisfies StorybookConfig);
