import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Vite plugin that patches React.act before tests run.
// In React 19, `act` was moved from `react-dom/test-utils` to `react`.
// However, `react-dom/test-utils.act` internally calls `React.act()` which
// doesn't exist in production builds. This plugin ensures the dev build of
// React (which has `act`) is used in tests.
function patchReactAct() {
  return {
    name: "patch-react-act",
    enforce: "pre",
    config() {
      return {
        define: {
          "process.env.NODE_ENV": JSON.stringify("development"),
        },
        optimizeDeps: {
          include: ["react", "react-dom", "react-dom/test-utils"],
          exclude: [],
        },
        ssr: {
          noExternal: ["react", "react-dom"],
          external: [],
        },
      };
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    patchReactAct(),
  ],
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "./src"),
      },
    ],
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    globals: true,
  },
});
