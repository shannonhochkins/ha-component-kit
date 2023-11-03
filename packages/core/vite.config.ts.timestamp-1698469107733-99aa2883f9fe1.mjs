// vite.config.ts
import { defineConfig } from "file:///Users/shannonhochkins/Desktop/dev/PlaygroundXYZ/ha-component-kit/node_modules/vite/dist/node/index.js";
import react from "file:///Users/shannonhochkins/Desktop/dev/PlaygroundXYZ/ha-component-kit/node_modules/@vitejs/plugin-react/dist/index.mjs";
import EsLint from "file:///Users/shannonhochkins/Desktop/dev/PlaygroundXYZ/ha-component-kit/node_modules/vite-plugin-linter/dist/index.js";
import tsconfigPaths from "file:///Users/shannonhochkins/Desktop/dev/PlaygroundXYZ/ha-component-kit/node_modules/vite-tsconfig-paths/dist/index.mjs";

// package.json
var package_default = {
  name: "@hakit/core",
  version: "2.3.0",
  private: false,
  type: "module",
  keywords: [
    "react",
    "homeassistant",
    "home-assistant",
    "home-automation",
    "socket",
    "component",
    "library",
    "api",
    "ha-component-kit",
    "hakit/core",
    "hakit/components",
    "dashboard",
    "custom"
  ],
  bin: {
    "hakit-sync-types": "./dist/sync/cli/cli.js"
  },
  engines: {
    node: ">=16.0.0",
    npm: ">=7.0.0"
  },
  description: "A collection of React hooks and helpers for Home Assistant to easily communicate with the Home Assistant WebSocket API.",
  main: "./dist/hakit-core.cjs.cjs",
  module: "./dist/hakit-core.es.js",
  types: "./dist/types/index.d.ts",
  exports: {
    ".": {
      import: "./dist/hakit-core.es.js",
      require: "./dist/hakit-core.cjs.cjs",
      types: "./dist/types/index.d.ts"
    },
    "./sync": {
      types: "./dist/sync/node/types/index.d.ts",
      import: "./dist/sync/node/index.cjs",
      require: "./dist/sync/node/index.cjs"
    }
  },
  author: "Shannon Hochkins <mail@shannonhochkins.com>",
  license: "ISC",
  files: [
    "dist",
    "package.json",
    "README.md",
    "LICENCE.md"
  ],
  repository: {
    type: "git",
    url: "git+https://github.com/shannonhochkins/ha-component-kit",
    directory: "packages/core"
  },
  bugs: {
    url: "https://github.com/shannonhochkins/ha-component-kit/issues"
  },
  homepage: "https://shannonhochkins.github.io/ha-component-kit#readme",
  funding: "https://github.com/shannonhochkins/ha-component-kit?sponsor=1",
  scripts: {
    dev: "vite",
    "type-check": "tsc --noEmit",
    prebuild: "rm -rf ./dist && npm run lint && npm run prettier",
    build: "npm run sync-local-types && npm run build:sync-script-cli && npm run build:sync-ha-types && npm run build:core && npm run type-check",
    "build:core": "NODE_ENV=production vite build",
    "build:sync-script": "NODE_ENV=production vite --config ./scripts/sync-user-types/vite-node.config.ts build",
    "build:sync-script-cli": "tsup",
    "build:sync-ha-types": "ts-node --esm ./scripts/sync-ha-types/index.ts",
    "watch:build": "NODE_ENV=production vite build --watch",
    "watch:build:sync-script": "NODE_ENV=production vite --config ./scripts/sync-user-types/vite-node.config.ts build --watch",
    "dev:test:sync-script": "npm run build:sync-script && ts-node ./scripts/sync-user-types/test.ts",
    lint: "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    prettier: 'prettier "src/**/*.{ts,tsx}" --write && git status',
    test: "NODE_ENV=test jest --rootDir=src",
    prerelease: "npm run build",
    release: "npm publish --access public",
    "sync-local-types": "npm run build:sync-script && node ./sync-local-types.cjs"
  },
  tsup: {
    entry: [
      "scripts/sync-user-types/cli.ts"
    ],
    splitting: false,
    sourcemap: false,
    clean: true,
    format: "esm",
    dts: false,
    outDir: "dist/sync/cli"
  },
  peerDependencies: {
    "@emotion/react": ">=10.x",
    "@emotion/styled": ">=10.x",
    "@iconify/react": ">=4.x",
    "deep-object-diff": "^1.1.9",
    "framer-motion": ">=10.x",
    "home-assistant-js-websocket": ">=8.x",
    "javascript-time-ago": ">=2.x",
    lodash: ">=4.x",
    prettier: ">=3.x.x",
    react: ">=16.x",
    "react-dom": ">=16.x",
    "react-router-dom": ">=6.x",
    "use-debounce": ">=9.x",
    ws: ">=8.x.x",
    yargs: ">=17.x.x",
    zustand: "^4.4.1"
  },
  devDependencies: {
    "@liuli-util/vite-plugin-node": "^0.6.0",
    "@swc/core": "^1.3.78",
    "@types/javascript-time-ago": "^2.0.3",
    "@types/ws": "^8.5.5",
    "home-assistant-js-websocket": "^8.2.0",
    prettier: "3.0.3",
    "simple-git": "^3.19.1",
    "ts-morph": "^19.0.0",
    "ts-node": "^10.9.1",
    tsup: "^7.1.0"
  }
};

// vite.config.ts
import path from "path";
import dts from "file:///Users/shannonhochkins/Desktop/dev/PlaygroundXYZ/ha-component-kit/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/shannonhochkins/Desktop/dev/PlaygroundXYZ/ha-component-kit/packages/core";
var { EsLinter, linterPlugin } = EsLint;
var vite_config_default = defineConfig((configEnv) => {
  return {
    root: path.resolve(__vite_injected_original_dirname, "./"),
    build: {
      sourcemap: true,
      emptyOutDir: false,
      lib: {
        entry: path.resolve(__vite_injected_original_dirname, "src/index.ts"),
        name: "hakit-core",
        formats: ["es", "cjs"],
        fileName: (format) => `hakit-core.${format}.${format === "cjs" ? "cjs" : "js"}`
      },
      rollupOptions: {
        external: [
          ...Object.keys(package_default.peerDependencies),
          "react/jsx-runtime",
          "react-is",
          "javascript-time-ago/locale/en.json",
          "@emotion/sheet",
          "@emotion/cache",
          "@emotion/serialize",
          "@emotion/utils"
        ],
        output: {
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
            "@iconify/react": "@iconify/react",
            "use-debounce": "use-debounce",
            "lodash": "lodash",
            "framer-motion": "framer-motion",
            "react/jsx-runtime": "react/jsx-runtime",
            "home-assistant-js-websocket": "home-assistant-js-websocket",
            "javascript-time-ago": "javascript-time-ago",
            "javascript-time-ago/locale/en.json": "javascript-time-ago/locale/en.json",
            "react-router-dom": "react-router-dom",
            "react-thermostat": "react-thermostat",
            "@emotion/styled": "@emotion/styled",
            "@emotion/react": "@emotion/react",
            "@emotion/sheet": "@emotion/sheet",
            "@emotion/cache": "@emotion/cache",
            "@emotion/serialize": "@emotion/serialize",
            "@emotion/utils": "@emotion/utils",
            "zustand": "zustand",
            "deep-object-diff": "deep-object-diff"
          }
        }
      },
      minify: true
    },
    plugins: [
      tsconfigPaths({
        root: path.resolve(__vite_injected_original_dirname, "./")
      }),
      react(),
      linterPlugin({
        include: ["./src}/**/*.{ts,tsx}"],
        linters: [new EsLinter({ configEnv })]
      }),
      dts({
        rollupTypes: false,
        root: path.resolve(__vite_injected_original_dirname, "./"),
        outDir: path.resolve(__vite_injected_original_dirname, "./dist/types"),
        include: [path.resolve(__vite_injected_original_dirname, "./src")],
        clearPureImport: true,
        insertTypesEntry: false,
        beforeWriteFile: (filePath, content) => {
          const base = path.resolve(__vite_injected_original_dirname, "./dist/types/packages/core/src");
          const replace = path.resolve(__vite_injected_original_dirname, "./dist/types");
          if (filePath.includes("test.d.ts"))
            return false;
          if (filePath.includes("stories.d.ts"))
            return false;
          return {
            filePath: filePath.replace(base, replace),
            content
          };
        }
      })
    ]
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3NoYW5ub25ob2Noa2lucy9EZXNrdG9wL2Rldi9QbGF5Z3JvdW5kWFlaL2hhLWNvbXBvbmVudC1raXQvcGFja2FnZXMvY29yZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3NoYW5ub25ob2Noa2lucy9EZXNrdG9wL2Rldi9QbGF5Z3JvdW5kWFlaL2hhLWNvbXBvbmVudC1raXQvcGFja2FnZXMvY29yZS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc2hhbm5vbmhvY2hraW5zL0Rlc2t0b3AvZGV2L1BsYXlncm91bmRYWVovaGEtY29tcG9uZW50LWtpdC9wYWNrYWdlcy9jb3JlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IEVzTGludCBmcm9tICd2aXRlLXBsdWdpbi1saW50ZXInO1xuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSAndml0ZS10c2NvbmZpZy1wYXRocyc7XG5pbXBvcnQgcGFja2FnZUpzb24gZnJvbSAnLi9wYWNrYWdlLmpzb24nO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cyc7XG5jb25zdCB7IEVzTGludGVyLCBsaW50ZXJQbHVnaW4gfSA9IEVzTGludDtcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoY29uZmlnRW52ID0+IHtcbiAgcmV0dXJuIHtcbiAgICByb290OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi8nKSxcbiAgICBidWlsZDoge1xuICAgICAgc291cmNlbWFwOiB0cnVlLFxuICAgICAgZW1wdHlPdXREaXI6IGZhbHNlLFxuICAgICAgbGliOiB7XG4gICAgICAgIGVudHJ5OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2luZGV4LnRzJyksXG4gICAgICAgIG5hbWU6ICdoYWtpdC1jb3JlJyxcbiAgICAgICAgZm9ybWF0czogWydlcycsICdjanMnXSxcbiAgICAgICAgZmlsZU5hbWU6IChmb3JtYXQpID0+IGBoYWtpdC1jb3JlLiR7Zm9ybWF0fS4ke2Zvcm1hdCA9PT0gJ2NqcycgPyAnY2pzJyA6ICdqcyd9YCxcbiAgICAgIH0sXG4gICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgIGV4dGVybmFsOltcbiAgICAgICAgICAuLi5PYmplY3Qua2V5cyhwYWNrYWdlSnNvbi5wZWVyRGVwZW5kZW5jaWVzKSxcbiAgICAgICAgICAncmVhY3QvanN4LXJ1bnRpbWUnLFxuICAgICAgICAgICdyZWFjdC1pcycsXG4gICAgICAgICAgJ2phdmFzY3JpcHQtdGltZS1hZ28vbG9jYWxlL2VuLmpzb24nLFxuICAgICAgICAgICdAZW1vdGlvbi9zaGVldCcsXG4gICAgICAgICAgJ0BlbW90aW9uL2NhY2hlJyxcbiAgICAgICAgICAnQGVtb3Rpb24vc2VyaWFsaXplJyxcbiAgICAgICAgICAnQGVtb3Rpb24vdXRpbHMnLFxuICAgICAgICBdLFxuICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICBnbG9iYWxzOiB7XG4gICAgICAgICAgICByZWFjdDogJ1JlYWN0JyxcbiAgICAgICAgICAgICdyZWFjdC1kb20nOiAnUmVhY3RET00nLFxuICAgICAgICAgICAgJ0BpY29uaWZ5L3JlYWN0JzogJ0BpY29uaWZ5L3JlYWN0JyxcbiAgICAgICAgICAgICd1c2UtZGVib3VuY2UnOiAndXNlLWRlYm91bmNlJyxcbiAgICAgICAgICAgICdsb2Rhc2gnOiAnbG9kYXNoJyxcbiAgICAgICAgICAgICdmcmFtZXItbW90aW9uJzogJ2ZyYW1lci1tb3Rpb24nLFxuICAgICAgICAgICAgJ3JlYWN0L2pzeC1ydW50aW1lJzogJ3JlYWN0L2pzeC1ydW50aW1lJyxcbiAgICAgICAgICAgICdob21lLWFzc2lzdGFudC1qcy13ZWJzb2NrZXQnOiAnaG9tZS1hc3Npc3RhbnQtanMtd2Vic29ja2V0JyxcbiAgICAgICAgICAgICdqYXZhc2NyaXB0LXRpbWUtYWdvJzogJ2phdmFzY3JpcHQtdGltZS1hZ28nLFxuICAgICAgICAgICAgJ2phdmFzY3JpcHQtdGltZS1hZ28vbG9jYWxlL2VuLmpzb24nOiAnamF2YXNjcmlwdC10aW1lLWFnby9sb2NhbGUvZW4uanNvbicsXG4gICAgICAgICAgICBcInJlYWN0LXJvdXRlci1kb21cIjogXCJyZWFjdC1yb3V0ZXItZG9tXCIsXG4gICAgICAgICAgICAncmVhY3QtdGhlcm1vc3RhdCc6ICdyZWFjdC10aGVybW9zdGF0JyxcbiAgICAgICAgICAgICdAZW1vdGlvbi9zdHlsZWQnOiAnQGVtb3Rpb24vc3R5bGVkJyxcbiAgICAgICAgICAgICdAZW1vdGlvbi9yZWFjdCc6ICdAZW1vdGlvbi9yZWFjdCcsXG4gICAgICAgICAgICAnQGVtb3Rpb24vc2hlZXQnOiAnQGVtb3Rpb24vc2hlZXQnLFxuICAgICAgICAgICAgJ0BlbW90aW9uL2NhY2hlJzogJ0BlbW90aW9uL2NhY2hlJyxcbiAgICAgICAgICAgICdAZW1vdGlvbi9zZXJpYWxpemUnOiAnQGVtb3Rpb24vc2VyaWFsaXplJyxcbiAgICAgICAgICAgICdAZW1vdGlvbi91dGlscyc6ICdAZW1vdGlvbi91dGlscycsXG4gICAgICAgICAgICAnenVzdGFuZCc6ICd6dXN0YW5kJyxcbiAgICAgICAgICAgICdkZWVwLW9iamVjdC1kaWZmJzogJ2RlZXAtb2JqZWN0LWRpZmYnLFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG1pbmlmeTogdHJ1ZSxcbiAgICB9LFxuICAgIHBsdWdpbnM6IFtcbiAgICAgIHRzY29uZmlnUGF0aHMoe1xuICAgICAgICByb290OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi8nKVxuICAgICAgfSksXG4gICAgICByZWFjdCgpLFxuICAgICAgbGludGVyUGx1Z2luKHtcbiAgICAgICAgaW5jbHVkZTogWycuL3NyY30vKiovKi57dHMsdHN4fSddLFxuICAgICAgICBsaW50ZXJzOiBbbmV3IEVzTGludGVyKHsgY29uZmlnRW52IH0pXSxcbiAgICAgIH0pLFxuICAgICAgZHRzKHtcbiAgICAgICAgcm9sbHVwVHlwZXM6IGZhbHNlLFxuICAgICAgICByb290OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi8nKSxcbiAgICAgICAgb3V0RGlyOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9kaXN0L3R5cGVzJyksXG4gICAgICAgIGluY2x1ZGU6IFtwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKV0sXG4gICAgICAgIGNsZWFyUHVyZUltcG9ydDogdHJ1ZSxcbiAgICAgICAgaW5zZXJ0VHlwZXNFbnRyeTogZmFsc2UsXG4gICAgICAgIGJlZm9yZVdyaXRlRmlsZTogKGZpbGVQYXRoLCBjb250ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3QgYmFzZSA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL2Rpc3QvdHlwZXMvcGFja2FnZXMvY29yZS9zcmMnKTtcbiAgICAgICAgICBjb25zdCByZXBsYWNlID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vZGlzdC90eXBlcycpO1xuICAgICAgICAgIGlmIChmaWxlUGF0aC5pbmNsdWRlcygndGVzdC5kLnRzJykpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICBpZiAoZmlsZVBhdGguaW5jbHVkZXMoJ3N0b3JpZXMuZC50cycpKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGZpbGVQYXRoOiBmaWxlUGF0aC5yZXBsYWNlKGJhc2UsIHJlcGxhY2UpLFxuICAgICAgICAgICAgY29udGVudCxcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIF0sXG4gIH1cbn0pO1xuIiwgIntcbiAgXCJuYW1lXCI6IFwiQGhha2l0L2NvcmVcIixcbiAgXCJ2ZXJzaW9uXCI6IFwiMi4zLjBcIixcbiAgXCJwcml2YXRlXCI6IGZhbHNlLFxuICBcInR5cGVcIjogXCJtb2R1bGVcIixcbiAgXCJrZXl3b3Jkc1wiOiBbXG4gICAgXCJyZWFjdFwiLFxuICAgIFwiaG9tZWFzc2lzdGFudFwiLFxuICAgIFwiaG9tZS1hc3Npc3RhbnRcIixcbiAgICBcImhvbWUtYXV0b21hdGlvblwiLFxuICAgIFwic29ja2V0XCIsXG4gICAgXCJjb21wb25lbnRcIixcbiAgICBcImxpYnJhcnlcIixcbiAgICBcImFwaVwiLFxuICAgIFwiaGEtY29tcG9uZW50LWtpdFwiLFxuICAgIFwiaGFraXQvY29yZVwiLFxuICAgIFwiaGFraXQvY29tcG9uZW50c1wiLFxuICAgIFwiZGFzaGJvYXJkXCIsXG4gICAgXCJjdXN0b21cIlxuICBdLFxuICBcImJpblwiOiB7XG4gICAgXCJoYWtpdC1zeW5jLXR5cGVzXCI6IFwiLi9kaXN0L3N5bmMvY2xpL2NsaS5qc1wiXG4gIH0sXG4gIFwiZW5naW5lc1wiOiB7XG4gICAgXCJub2RlXCI6IFwiPj0xNi4wLjBcIixcbiAgICBcIm5wbVwiOiBcIj49Ny4wLjBcIlxuICB9LFxuICBcImRlc2NyaXB0aW9uXCI6IFwiQSBjb2xsZWN0aW9uIG9mIFJlYWN0IGhvb2tzIGFuZCBoZWxwZXJzIGZvciBIb21lIEFzc2lzdGFudCB0byBlYXNpbHkgY29tbXVuaWNhdGUgd2l0aCB0aGUgSG9tZSBBc3Npc3RhbnQgV2ViU29ja2V0IEFQSS5cIixcbiAgXCJtYWluXCI6IFwiLi9kaXN0L2hha2l0LWNvcmUuY2pzLmNqc1wiLFxuICBcIm1vZHVsZVwiOiBcIi4vZGlzdC9oYWtpdC1jb3JlLmVzLmpzXCIsXG4gIFwidHlwZXNcIjogXCIuL2Rpc3QvdHlwZXMvaW5kZXguZC50c1wiLFxuICBcImV4cG9ydHNcIjoge1xuICAgIFwiLlwiOiB7XG4gICAgICBcImltcG9ydFwiOiBcIi4vZGlzdC9oYWtpdC1jb3JlLmVzLmpzXCIsXG4gICAgICBcInJlcXVpcmVcIjogXCIuL2Rpc3QvaGFraXQtY29yZS5janMuY2pzXCIsXG4gICAgICBcInR5cGVzXCI6IFwiLi9kaXN0L3R5cGVzL2luZGV4LmQudHNcIlxuICAgIH0sXG4gICAgXCIuL3N5bmNcIjoge1xuICAgICAgXCJ0eXBlc1wiOiBcIi4vZGlzdC9zeW5jL25vZGUvdHlwZXMvaW5kZXguZC50c1wiLFxuICAgICAgXCJpbXBvcnRcIjogXCIuL2Rpc3Qvc3luYy9ub2RlL2luZGV4LmNqc1wiLFxuICAgICAgXCJyZXF1aXJlXCI6IFwiLi9kaXN0L3N5bmMvbm9kZS9pbmRleC5janNcIlxuICAgIH1cbiAgfSxcbiAgXCJhdXRob3JcIjogXCJTaGFubm9uIEhvY2hraW5zIDxtYWlsQHNoYW5ub25ob2Noa2lucy5jb20+XCIsXG4gIFwibGljZW5zZVwiOiBcIklTQ1wiLFxuICBcImZpbGVzXCI6IFtcbiAgICBcImRpc3RcIixcbiAgICBcInBhY2thZ2UuanNvblwiLFxuICAgIFwiUkVBRE1FLm1kXCIsXG4gICAgXCJMSUNFTkNFLm1kXCJcbiAgXSxcbiAgXCJyZXBvc2l0b3J5XCI6IHtcbiAgICBcInR5cGVcIjogXCJnaXRcIixcbiAgICBcInVybFwiOiBcImdpdCtodHRwczovL2dpdGh1Yi5jb20vc2hhbm5vbmhvY2hraW5zL2hhLWNvbXBvbmVudC1raXRcIixcbiAgICBcImRpcmVjdG9yeVwiOiBcInBhY2thZ2VzL2NvcmVcIlxuICB9LFxuICBcImJ1Z3NcIjoge1xuICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL3NoYW5ub25ob2Noa2lucy9oYS1jb21wb25lbnQta2l0L2lzc3Vlc1wiXG4gIH0sXG4gIFwiaG9tZXBhZ2VcIjogXCJodHRwczovL3NoYW5ub25ob2Noa2lucy5naXRodWIuaW8vaGEtY29tcG9uZW50LWtpdCNyZWFkbWVcIixcbiAgXCJmdW5kaW5nXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL3NoYW5ub25ob2Noa2lucy9oYS1jb21wb25lbnQta2l0P3Nwb25zb3I9MVwiLFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwiZGV2XCI6IFwidml0ZVwiLFxuICAgIFwidHlwZS1jaGVja1wiOiBcInRzYyAtLW5vRW1pdFwiLFxuICAgIFwicHJlYnVpbGRcIjogXCJybSAtcmYgLi9kaXN0ICYmIG5wbSBydW4gbGludCAmJiBucG0gcnVuIHByZXR0aWVyXCIsXG4gICAgXCJidWlsZFwiOiBcIm5wbSBydW4gc3luYy1sb2NhbC10eXBlcyAmJiBucG0gcnVuIGJ1aWxkOnN5bmMtc2NyaXB0LWNsaSAmJiBucG0gcnVuIGJ1aWxkOnN5bmMtaGEtdHlwZXMgJiYgbnBtIHJ1biBidWlsZDpjb3JlICYmIG5wbSBydW4gdHlwZS1jaGVja1wiLFxuICAgIFwiYnVpbGQ6Y29yZVwiOiBcIk5PREVfRU5WPXByb2R1Y3Rpb24gdml0ZSBidWlsZFwiLFxuICAgIFwiYnVpbGQ6c3luYy1zY3JpcHRcIjogXCJOT0RFX0VOVj1wcm9kdWN0aW9uIHZpdGUgLS1jb25maWcgLi9zY3JpcHRzL3N5bmMtdXNlci10eXBlcy92aXRlLW5vZGUuY29uZmlnLnRzIGJ1aWxkXCIsXG4gICAgXCJidWlsZDpzeW5jLXNjcmlwdC1jbGlcIjogXCJ0c3VwXCIsXG4gICAgXCJidWlsZDpzeW5jLWhhLXR5cGVzXCI6IFwidHMtbm9kZSAtLWVzbSAuL3NjcmlwdHMvc3luYy1oYS10eXBlcy9pbmRleC50c1wiLFxuICAgIFwid2F0Y2g6YnVpbGRcIjogXCJOT0RFX0VOVj1wcm9kdWN0aW9uIHZpdGUgYnVpbGQgLS13YXRjaFwiLFxuICAgIFwid2F0Y2g6YnVpbGQ6c3luYy1zY3JpcHRcIjogXCJOT0RFX0VOVj1wcm9kdWN0aW9uIHZpdGUgLS1jb25maWcgLi9zY3JpcHRzL3N5bmMtdXNlci10eXBlcy92aXRlLW5vZGUuY29uZmlnLnRzIGJ1aWxkIC0td2F0Y2hcIixcbiAgICBcImRldjp0ZXN0OnN5bmMtc2NyaXB0XCI6IFwibnBtIHJ1biBidWlsZDpzeW5jLXNjcmlwdCAmJiB0cy1ub2RlIC4vc2NyaXB0cy9zeW5jLXVzZXItdHlwZXMvdGVzdC50c1wiLFxuICAgIFwibGludFwiOiBcImVzbGludCBzcmMgLS1leHQgdHMsdHN4IC0tcmVwb3J0LXVudXNlZC1kaXNhYmxlLWRpcmVjdGl2ZXMgLS1tYXgtd2FybmluZ3MgMFwiLFxuICAgIFwicHJldHRpZXJcIjogXCJwcmV0dGllciBcXFwic3JjLyoqLyoue3RzLHRzeH1cXFwiIC0td3JpdGUgJiYgZ2l0IHN0YXR1c1wiLFxuICAgIFwidGVzdFwiOiBcIk5PREVfRU5WPXRlc3QgamVzdCAtLXJvb3REaXI9c3JjXCIsXG4gICAgXCJwcmVyZWxlYXNlXCI6IFwibnBtIHJ1biBidWlsZFwiLFxuICAgIFwicmVsZWFzZVwiOiBcIm5wbSBwdWJsaXNoIC0tYWNjZXNzIHB1YmxpY1wiLFxuICAgIFwic3luYy1sb2NhbC10eXBlc1wiOiBcIm5wbSBydW4gYnVpbGQ6c3luYy1zY3JpcHQgJiYgbm9kZSAuL3N5bmMtbG9jYWwtdHlwZXMuY2pzXCJcbiAgfSxcbiAgXCJ0c3VwXCI6IHtcbiAgICBcImVudHJ5XCI6IFtcbiAgICAgIFwic2NyaXB0cy9zeW5jLXVzZXItdHlwZXMvY2xpLnRzXCJcbiAgICBdLFxuICAgIFwic3BsaXR0aW5nXCI6IGZhbHNlLFxuICAgIFwic291cmNlbWFwXCI6IGZhbHNlLFxuICAgIFwiY2xlYW5cIjogdHJ1ZSxcbiAgICBcImZvcm1hdFwiOiBcImVzbVwiLFxuICAgIFwiZHRzXCI6IGZhbHNlLFxuICAgIFwib3V0RGlyXCI6IFwiZGlzdC9zeW5jL2NsaVwiXG4gIH0sXG4gIFwicGVlckRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAZW1vdGlvbi9yZWFjdFwiOiBcIj49MTAueFwiLFxuICAgIFwiQGVtb3Rpb24vc3R5bGVkXCI6IFwiPj0xMC54XCIsXG4gICAgXCJAaWNvbmlmeS9yZWFjdFwiOiBcIj49NC54XCIsXG4gICAgXCJkZWVwLW9iamVjdC1kaWZmXCI6IFwiXjEuMS45XCIsXG4gICAgXCJmcmFtZXItbW90aW9uXCI6IFwiPj0xMC54XCIsXG4gICAgXCJob21lLWFzc2lzdGFudC1qcy13ZWJzb2NrZXRcIjogXCI+PTgueFwiLFxuICAgIFwiamF2YXNjcmlwdC10aW1lLWFnb1wiOiBcIj49Mi54XCIsXG4gICAgXCJsb2Rhc2hcIjogXCI+PTQueFwiLFxuICAgIFwicHJldHRpZXJcIjogXCI+PTMueC54XCIsXG4gICAgXCJyZWFjdFwiOiBcIj49MTYueFwiLFxuICAgIFwicmVhY3QtZG9tXCI6IFwiPj0xNi54XCIsXG4gICAgXCJyZWFjdC1yb3V0ZXItZG9tXCI6IFwiPj02LnhcIixcbiAgICBcInVzZS1kZWJvdW5jZVwiOiBcIj49OS54XCIsXG4gICAgXCJ3c1wiOiBcIj49OC54LnhcIixcbiAgICBcInlhcmdzXCI6IFwiPj0xNy54LnhcIixcbiAgICBcInp1c3RhbmRcIjogXCJeNC40LjFcIlxuICB9LFxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAbGl1bGktdXRpbC92aXRlLXBsdWdpbi1ub2RlXCI6IFwiXjAuNi4wXCIsXG4gICAgXCJAc3djL2NvcmVcIjogXCJeMS4zLjc4XCIsXG4gICAgXCJAdHlwZXMvamF2YXNjcmlwdC10aW1lLWFnb1wiOiBcIl4yLjAuM1wiLFxuICAgIFwiQHR5cGVzL3dzXCI6IFwiXjguNS41XCIsXG4gICAgXCJob21lLWFzc2lzdGFudC1qcy13ZWJzb2NrZXRcIjogXCJeOC4yLjBcIixcbiAgICBcInByZXR0aWVyXCI6IFwiMy4wLjNcIixcbiAgICBcInNpbXBsZS1naXRcIjogXCJeMy4xOS4xXCIsXG4gICAgXCJ0cy1tb3JwaFwiOiBcIl4xOS4wLjBcIixcbiAgICBcInRzLW5vZGVcIjogXCJeMTAuOS4xXCIsXG4gICAgXCJ0c3VwXCI6IFwiXjcuMS4wXCJcbiAgfVxufVxuIl0sCiAg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
