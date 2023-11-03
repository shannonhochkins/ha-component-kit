import { dirname, join } from "path";
import type { StorybookConfig } from "@storybook/react-vite";
import react from '@vitejs/plugin-react';
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
export default ({
  stories: [
    "../packages/**/*.mdx",
    "../stories/**/*.mdx",
    "../stories/*.mdx",
    "../stories/*.stories.@(js|jsx|ts|tsx)",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
    "../packages/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
    getAbsolutePath("@storybook/addon-themes"),
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-interactions"),
    getAbsolutePath("@storybook/addon-controls"),
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-mdx-gfm")
  ],
  core: {},
  staticDirs: ['../static'],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {
    }
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
        // Exclude the 'css' prop
        if (prop.name === 'css') {
          return false;
        }
        if (prop.name === 'cssStyles' || prop.name === 'style') {
          return true;
        }
        const res = /react-thermostat/.test(prop.parent?.fileName) || !/node_modules/.test(prop.parent?.fileName);
        return prop.parent ? res : true;
      },
      shouldExtractLiteralValuesFromEnum: true,
      compilerOptions: {
        allowSyntheticDefaultImports: false,
        esModuleInterop: false,
        baseUrl: ".",
        paths: {
          "@hakit/core": ["packages/core/dist"],
          "@components": ["packages/components/src"],
          "@hooks": ["packages/core/src/hooks"],
          "@utils/*": ["packages/core/src/utils/*"],
          "@typings": ["packages/core/src/types"],
        }
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
    return {
      ...config,
      plugins: [
        // Filter out `vite:react-jsx` per suggestion in `plugin-react`...
        // "You should stop using "vite:react-jsx" since this plugin conflicts with it."
        // Implementation suggestion from: https://github.com/storybookjs/builder-vite/issues/113#issuecomment-940190931
        ...(config.plugins || []).filter(
          // @ts-ignore - `name` is not in the type definition
          (plugin) => !(Array.isArray(plugin) && plugin.some((p) => (p && p.name === "vite:react-jsx"))),
        ),
        /** @see https://github.com/aleclarson/vite-tsconfig-paths */
        tsconfigPaths(),
        react({
          exclude: [/\.stories\.(t|j)sx?$/, /node_modules/],
          jsxImportSource: '@emotion/react',
          babel: {
            plugins: ['@emotion/babel-plugin'],
          },
        }),
        svgr(),
      ],
    };
  },
} satisfies StorybookConfig);

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
