import { defineConfig } from "vitest/config";

export default defineConfig({
  cacheDir: process.env.VITEST ? "./.vitest" : undefined,
  test: {
    bail: process.env.CI ? 3 : undefined,
    coverage: {
      enabled: true,
      exclude: ["**/index.ts"],
      provider: "v8",
    },
    environment: "node",
    globals: true,
    printConsoleTrace: process.env.CI ? true : false,
    reporters: process.env.GITHUB_ACTIONS
      ? ["dot", "github-actions"]
      : "default",
    retry: process.env.CI ? 3 : 0,
    sequence: {
      concurrent: true,
    },
    silent: "passed-only",
    typecheck: {
      enabled: true,
    },
    watch: false,
  },
});
