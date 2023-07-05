// vite.config.ts
import { defineConfig } from "file:///Users/shannonhochkins/Desktop/dev/PlaygroundXYZ/ha-component-kit/node_modules/vite/dist/node/index.js";
import dts from "file:///Users/shannonhochkins/Desktop/dev/PlaygroundXYZ/ha-component-kit/node_modules/vite-plugin-dts/dist/index.mjs";
import react from "file:///Users/shannonhochkins/Desktop/dev/PlaygroundXYZ/ha-component-kit/node_modules/@vitejs/plugin-react/dist/index.mjs";
import EsLint from "file:///Users/shannonhochkins/Desktop/dev/PlaygroundXYZ/ha-component-kit/node_modules/vite-plugin-linter/dist/index.js";
import tsconfigPaths from "file:///Users/shannonhochkins/Desktop/dev/PlaygroundXYZ/ha-component-kit/node_modules/vite-tsconfig-paths/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "/Users/shannonhochkins/Desktop/dev/PlaygroundXYZ/ha-component-kit";
var { EsLinter, linterPlugin } = EsLint;
console.log('path.resolve(__dirname, "./src")', path.resolve(__vite_injected_original_dirname, "./src"));
var vite_config_default = defineConfig((configEnv) => {
  const isBuildStorybook = process.env.BUILD_STORYBOOK === "true";
  return {
    build: {
      lib: {
        entry: "src/index.ts",
        name: "haComponentKit",
        formats: ["es", "umd"],
        fileName: (format) => `ha-component-kit.${format}.js`
      },
      rollupOptions: {
        external: [
          /node_modules/
        ],
        output: {
          globals: {
            "@mui/material": "@mui/material",
            react: "React",
            "react-dom": "ReactDOM",
            lodash: "lodash",
            "@emotion/cache": "@emotion/cache",
            "react/jsx-runtime": "react/jsx-runtime",
            "@emotion/styled": "styled",
            "@emotion/react": "@emotion/react",
            "@emotion/utils": "@emotion/utils",
            "@iconify/react": "@iconify/react",
            "@emotion/serialize": "@emotion/serialize",
            "react-is": "react-is",
            "use-debounce": "use-debounce",
            "react-thermostat": "react-thermostat",
            "home-assistant-js-websocket": "home-assistant-js-websocket",
            "javascript-time-ago": "javascript-time-ago"
          }
        }
      },
      minify: true
    },
    plugins: [
      tsconfigPaths(),
      react({
        jsxImportSource: "@emotion/react",
        babel: {
          plugins: ["@emotion/babel-plugin"]
        }
      }),
      linterPlugin({
        include: ["./src}/**/*.{ts,tsx}"],
        linters: [new EsLinter({ configEnv })]
      }),
      ...isBuildStorybook ? [] : [dts({ outputDir: "dist/types", rollupTypes: true })]
    ]
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc2hhbm5vbmhvY2hraW5zL0Rlc2t0b3AvZGV2L1BsYXlncm91bmRYWVovaGEtY29tcG9uZW50LWtpdFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3NoYW5ub25ob2Noa2lucy9EZXNrdG9wL2Rldi9QbGF5Z3JvdW5kWFlaL2hhLWNvbXBvbmVudC1raXQvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3NoYW5ub25ob2Noa2lucy9EZXNrdG9wL2Rldi9QbGF5Z3JvdW5kWFlaL2hhLWNvbXBvbmVudC1raXQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCBkdHMgZnJvbSAndml0ZS1wbHVnaW4tZHRzJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgRXNMaW50IGZyb20gJ3ZpdGUtcGx1Z2luLWxpbnRlcic7XG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJztcbmltcG9ydCBwYWNrYWdlSnNvbiBmcm9tICcuL3BhY2thZ2UuanNvbic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmNvbnN0IHsgRXNMaW50ZXIsIGxpbnRlclBsdWdpbiB9ID0gRXNMaW50XG5jb25zb2xlLmxvZygncGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKScsIHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIikpO1xuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyhjb25maWdFbnYgPT4ge1xuICBjb25zdCBpc0J1aWxkU3Rvcnlib29rID0gcHJvY2Vzcy5lbnYuQlVJTERfU1RPUllCT09LID09PSAndHJ1ZSc7XG4gIHJldHVybiB7XG4gICAgYnVpbGQ6IHtcbiAgICAgIGxpYjoge1xuICAgICAgICBlbnRyeTogJ3NyYy9pbmRleC50cycsXG4gICAgICAgIG5hbWU6ICdoYUNvbXBvbmVudEtpdCcsXG4gICAgICAgIGZvcm1hdHM6IFsnZXMnLCAndW1kJ10sXG4gICAgICAgIGZpbGVOYW1lOiAoZm9ybWF0KSA9PiBgaGEtY29tcG9uZW50LWtpdC4ke2Zvcm1hdH0uanNgLFxuICAgICAgfSxcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgZXh0ZXJuYWw6W1xuICAgICAgICAgIC9ub2RlX21vZHVsZXMvXG4gICAgICAgIF0sXG4gICAgICAgIG91dHB1dDoge1xuICAgICAgICAgIGdsb2JhbHM6IHtcbiAgICAgICAgICAgICdAbXVpL21hdGVyaWFsJzogJ0BtdWkvbWF0ZXJpYWwnLFxuICAgICAgICAgICAgcmVhY3Q6ICdSZWFjdCcsXG4gICAgICAgICAgICAncmVhY3QtZG9tJzogJ1JlYWN0RE9NJyxcbiAgICAgICAgICAgIGxvZGFzaDogJ2xvZGFzaCcsXG4gICAgICAgICAgICAnQGVtb3Rpb24vY2FjaGUnOiAnQGVtb3Rpb24vY2FjaGUnLFxuICAgICAgICAgICAgJ3JlYWN0L2pzeC1ydW50aW1lJzogJ3JlYWN0L2pzeC1ydW50aW1lJyxcbiAgICAgICAgICAgICdAZW1vdGlvbi9zdHlsZWQnOiAnc3R5bGVkJyxcbiAgICAgICAgICAgICdAZW1vdGlvbi9yZWFjdCc6ICdAZW1vdGlvbi9yZWFjdCcsXG4gICAgICAgICAgICAnQGVtb3Rpb24vdXRpbHMnOiAnQGVtb3Rpb24vdXRpbHMnLFxuICAgICAgICAgICAgJ0BpY29uaWZ5L3JlYWN0JzogJ0BpY29uaWZ5L3JlYWN0JyxcbiAgICAgICAgICAgICdAZW1vdGlvbi9zZXJpYWxpemUnOiAnQGVtb3Rpb24vc2VyaWFsaXplJyxcbiAgICAgICAgICAgICdyZWFjdC1pcyc6ICdyZWFjdC1pcycsXG4gICAgICAgICAgICAndXNlLWRlYm91bmNlJzogJ3VzZS1kZWJvdW5jZScsXG4gICAgICAgICAgICAncmVhY3QtdGhlcm1vc3RhdCc6ICdyZWFjdC10aGVybW9zdGF0JyxcbiAgICAgICAgICAgICdob21lLWFzc2lzdGFudC1qcy13ZWJzb2NrZXQnOiAnaG9tZS1hc3Npc3RhbnQtanMtd2Vic29ja2V0JyxcbiAgICAgICAgICAgICdqYXZhc2NyaXB0LXRpbWUtYWdvJzogJ2phdmFzY3JpcHQtdGltZS1hZ28nXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgbWluaWZ5OiB0cnVlLFxuICAgIH0sXG4gICAgcGx1Z2luczogW1xuICAgICAgdHNjb25maWdQYXRocygpLFxuICAgICAgcmVhY3Qoe1xuICAgICAgICBqc3hJbXBvcnRTb3VyY2U6ICdAZW1vdGlvbi9yZWFjdCcsXG4gICAgICAgIGJhYmVsOiB7XG4gICAgICAgICAgcGx1Z2luczogWydAZW1vdGlvbi9iYWJlbC1wbHVnaW4nXSxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgbGludGVyUGx1Z2luKHtcbiAgICAgICAgaW5jbHVkZTogWycuL3NyY30vKiovKi57dHMsdHN4fSddLFxuICAgICAgICBsaW50ZXJzOiBbbmV3IEVzTGludGVyKHsgY29uZmlnRW52IH0pXSxcbiAgICAgIH0pLFxuICAgICAgLi4uKGlzQnVpbGRTdG9yeWJvb2sgPyBbXSA6IFtkdHMoeyBvdXRwdXREaXI6ICdkaXN0L3R5cGVzJywgcm9sbHVwVHlwZXM6IHRydWUgfSldKSxcbiAgICBdLFxuICB9XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBcVgsU0FBUyxvQkFBb0I7QUFDbFosT0FBTyxTQUFTO0FBQ2hCLE9BQU8sV0FBVztBQUNsQixPQUFPLFlBQVk7QUFDbkIsT0FBTyxtQkFBbUI7QUFFMUIsT0FBTyxVQUFVO0FBTmpCLElBQU0sbUNBQW1DO0FBT3pDLElBQU0sRUFBRSxVQUFVLGFBQWEsSUFBSTtBQUNuQyxRQUFRLElBQUksb0NBQW9DLEtBQUssUUFBUSxrQ0FBVyxPQUFPLENBQUM7QUFFaEYsSUFBTyxzQkFBUSxhQUFhLGVBQWE7QUFDdkMsUUFBTSxtQkFBbUIsUUFBUSxJQUFJLG9CQUFvQjtBQUN6RCxTQUFPO0FBQUEsSUFDTCxPQUFPO0FBQUEsTUFDTCxLQUFLO0FBQUEsUUFDSCxPQUFPO0FBQUEsUUFDUCxNQUFNO0FBQUEsUUFDTixTQUFTLENBQUMsTUFBTSxLQUFLO0FBQUEsUUFDckIsVUFBVSxDQUFDLFdBQVcsb0JBQW9CO0FBQUEsTUFDNUM7QUFBQSxNQUNBLGVBQWU7QUFBQSxRQUNiLFVBQVM7QUFBQSxVQUNQO0FBQUEsUUFDRjtBQUFBLFFBQ0EsUUFBUTtBQUFBLFVBQ04sU0FBUztBQUFBLFlBQ1AsaUJBQWlCO0FBQUEsWUFDakIsT0FBTztBQUFBLFlBQ1AsYUFBYTtBQUFBLFlBQ2IsUUFBUTtBQUFBLFlBQ1Isa0JBQWtCO0FBQUEsWUFDbEIscUJBQXFCO0FBQUEsWUFDckIsbUJBQW1CO0FBQUEsWUFDbkIsa0JBQWtCO0FBQUEsWUFDbEIsa0JBQWtCO0FBQUEsWUFDbEIsa0JBQWtCO0FBQUEsWUFDbEIsc0JBQXNCO0FBQUEsWUFDdEIsWUFBWTtBQUFBLFlBQ1osZ0JBQWdCO0FBQUEsWUFDaEIsb0JBQW9CO0FBQUEsWUFDcEIsK0JBQStCO0FBQUEsWUFDL0IsdUJBQXVCO0FBQUEsVUFDekI7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLE1BQ0EsUUFBUTtBQUFBLElBQ1Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLGNBQWM7QUFBQSxNQUNkLE1BQU07QUFBQSxRQUNKLGlCQUFpQjtBQUFBLFFBQ2pCLE9BQU87QUFBQSxVQUNMLFNBQVMsQ0FBQyx1QkFBdUI7QUFBQSxRQUNuQztBQUFBLE1BQ0YsQ0FBQztBQUFBLE1BQ0QsYUFBYTtBQUFBLFFBQ1gsU0FBUyxDQUFDLHNCQUFzQjtBQUFBLFFBQ2hDLFNBQVMsQ0FBQyxJQUFJLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUFBLE1BQ3ZDLENBQUM7QUFBQSxNQUNELEdBQUksbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxXQUFXLGNBQWMsYUFBYSxLQUFLLENBQUMsQ0FBQztBQUFBLElBQ2xGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
