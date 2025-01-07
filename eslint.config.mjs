// @ts-check
import globals from "globals";
import jsLint from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import reactRefresh from "eslint-plugin-react-refresh";
import reactHooks from "eslint-plugin-react-hooks"


/** @type {import('typescript-eslint').InfiniteDepthConfigWithExtends[]} */
const configurations = [
  {
    ignores: ['**/.cache/*', '**/coverage/*', '**/.ha-repo-cache/**', '**/dist/**'],
  },
  {
    plugins: {
      // @ts-expect-error - this is correct, package is untyped
      "react-hooks": reactHooks,
    },
    // @ts-expect-error - this is correct, package is untyped
    rules: reactHooks.configs.recommended.rules,
  },
  {
    settings: {
      react: {
        version: "detect"
      }
    }
  },
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  {
    languageOptions: { 
      globals: {
        ...globals.browser,
        ...globals.node,
      }
    }
  },
  jsLint.configs.recommended,
  reactRefresh.configs.recommended,
  pluginReact.configs.flat?.recommended??[],
  ...tseslint.configs.recommended,
  {
    rules: {
      "react/prop-types": ["off", {}],
      "@typescript-eslint/no-unused-expressions": ["off", {},],
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
    }
  },
];

export default tseslint.config(...configurations);
