import { defineConfig } from "oxlint";

export default defineConfig({
  categories: {
    correctness: "error",
    nursery: "error",
    pedantic: "warn",
    perf: "error",
    restriction: "error",
    style: "warn",
    suspicious: "error",
  },
  env: {
    builtin: true,
  },
  plugins: [
    "typescript",
    "unicorn",
    "oxc",
    "eslint",
    "import",
    "jsdoc",
    "vitest",
    "node",
  ],
  rules: {},
});
