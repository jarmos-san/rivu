import { defineConfig } from "vitest/config";

const MAX_BAIL = 3;
const MAX_RETRY = 3;
const MIN_RETRY = 0;

export default defineConfig({
  cacheDir: process.env.VITEST ? "./.vitest" : undefined,
  test: {
    bail: process.env.CI ? MAX_BAIL : undefined,
    coverage: {
      enabled: true,
      exclude: ["**/index.ts"],
      provider: "v8",
    },
    environment: "node",
    globals: true,
    printConsoleTrace: process.env.CI ? true : undefined,
    reporters: process.env.GITHUB_ACTIONS
      ? ["dot", "github-actions"]
      : "default",
    retry: process.env.CI ? MAX_RETRY : MIN_RETRY,
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
