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
    getAbsolutePath("@storybook/addon-docs")
  ],
  core: {},
  staticDirs: ['../static'],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {
    }
  },
  typescript: {
    check: true,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      propFilter: (prop) => {
        // Exclude the 'css' prop
        if (prop.name === 'css' || prop.name === 'style') {
          return false;
        }
        if (prop.name === 'cssStyles') {
          return true;
        }
        const res = !/node_modules/.test(prop.parent?.fileName ?? '');
        return prop.parent ? res : true;
      },
      shouldRemoveUndefinedFromOptional: true,
      shouldIncludeExpression: false,
      shouldExtractValuesFromUnion: false,
      shouldExtractLiteralValuesFromEnum: false,
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
          '@stories/*': ['stories/*'],
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
      // make vite produce no output during the build in the terminal
      logLevel: 'silent',
      plugins: [
        // Filter out `vite:react-jsx` per suggestion in `plugin-react`...
        // "You should stop using "vite:react-jsx" since this plugin conflicts with it."
        // Implementation suggestion from: https://github.com/storybookjs/builder-vite/issues/113#issuecomment-940190931
        ...(config.plugins || []).filter(
          // @ts-expect-error - `name` is not in the type definition
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

function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, "package.json")));
}
